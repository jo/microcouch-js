import MultipartRelated from 'multipart-related'

// const transformContent = {
//   start (controller) {
//     controller.enqueue(this.textencoder.encode('{"docs":['))
//   },
//   transform (doc, controller) {
//     const line = JSON.stringify(doc)
//     if (!this.firstLineSent) {
//       this.firstLineSent = true
//       controller.enqueue(this.textencoder.encode(line))
//     }
//     controller.enqueue(this.textencoder.encode(`,${line}`))
//   },
//   flush (controller) {
//     controller.enqueue(this.textencoder.encode(']}'))
//   }
// }

// class DiffRequest extends TransformStream {
//   constructor() {
//     super({...transformContent, textencoder: new TextEncoder()})
//   }
// }

const gzip = blob => {
  const ds = new CompressionStream('gzip')
  const compressedStream = blob.stream().pipeThrough(ds)
  return new Response(compressedStream).blob()
}

const gunzip = (blob, type) => {
  const ds = new DecompressionStream('gzip')
  const decompressedStream = blob.stream().pipeThrough(ds)
  const responseOptions = {
    headers: {
      'Content-Type': type
    }
  }
  return new Response(decompressedStream, responseOptions).blob()
}

class DocsGetter {
  constructor (db, { batchSize }) {
    this.db = db
    this.batchSize = batchSize
    
    this.decoder = new TextDecoder()

    this.onDoc = null
    this.onClose = null

    this.revs = []
    this.docsRead = 0
  }

  addRev (rev) {
    this.revs.push(rev)
    return this.getDocs()
  }

  close () {
    return this.getDocs(true)
  }

  async getDocs (flush) {
    if (!flush && this.revs.length < this.batchSize) return
    if (this.revs.length === 0) {
      if (flush) this.onClose()
      return
    }

    let batch = []
    do {
      batch = this.revs.splice(0, this.batchSize)
      if (batch.length > 0) {
        await this.processBatch(batch)
      }
    } while (batch.length === this.batchSize)

    if (flush) this.onClose()
  }
  
  async processBatch (batch) {
    const response = await this.getDocsMultipart(batch)
    const contentType = response.headers.get('Content-Type')
    const parser = new MultipartRelated(contentType)
    const reader = response.body.getReader()

    let batchComplete = false
    let currentParts = []
    let currentBoundary = null
    do {
      const { done, value } = await reader.read()
      const parts = parser.read(value)
      for (const part of parts) {
        if (!part.boundary) {
          await this.emitDoc(currentParts)
          currentParts = []
          currentBoundary = null
          await this.emitDoc([part])
          // single doc without attachments
        } else if (currentBoundary && currentBoundary !== part.boundary) {
          await this.emitDoc(currentParts)
          currentParts = [part]
          currentBoundary = null
        } else {
          currentParts.push(part)
          currentBoundary = part.boundary
        }
      }
      batchComplete = done
    } while (!batchComplete)
    await this.emitDoc(currentParts)
  }

  async getDocsMultipart (revs) {
    const url = new URL(`${this.db.root}/_bulk_get`, this.db.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')

    const payload = { docs: revs }
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    const body = await gzip(blob)
    const response = await fetch(url, {
      headers: {
        ...this.db.headers,
        'Content-Type': 'application/json',
        'Accept': 'multipart/related',
        'Content-Encoding': 'gzip'
      },
      method: 'post',
      body
    })
    if (response.status !== 200) {
      throw new Error('Could not get docs multipart')
    }
    
    return response
  }
 
  async emitDoc (parts) {
    if (parts.length === 0) return

    const { headers, data } = parts.shift()
    const json = this.decoder.decode(data)
    const doc = JSON.parse(json)

    for (const { headers, data } of parts) {
      const contentDisposition = headers['Content-Disposition']
      if (!contentDisposition) {
        console.warn('skipping attachment with missing Content-Disposition header', headers, doc, parts)
        continue
      }

      const [_, filename] = contentDisposition.match(/filename="([^"]+)"/)
      if (!(filename in doc._attachments)) {
        console.warn('skipping attachment due to missing filename in docs attachments stub', headers, doc, parts)
        continue
      }

      const type = headers['Content-Type']
      if (!type) {
        console.warn('skipping attachment due to missing Content-Type header', headers, doc, parts)
        continue
      }

      const blob = new Blob([data], { type })

      const contentEncoding = headers['Content-Encoding']
      if (contentEncoding === 'gzip') {
        doc._attachments[filename].data = await gunzip(blob, type)
        delete doc._attachments[filename].follows
        delete doc._attachments[filename].encoding
        delete doc._attachments[filename].encoded_length
      } else if (contentEncoding) {
        console.warn('skipping attachment with unsupported Content-Encoding header', headers, doc, parts)
        continue
      } else {
        doc._attachments[filename].data = blob
        delete doc._attachments[filename].follows
      }
    }

    this.docsRead++
    this.onDoc(doc)
  }
}

class GetDocsTransformStream {
  constructor(db, { batchSize }) {
    const docsGetter = new DocsGetter(db, { batchSize })
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })

    this.docsGetter = docsGetter

    this.readable = new ReadableStream({
      start(controller) {
        docsGetter.onDoc = diff => controller.enqueue(diff)
        docsGetter.onClose = () => controller.close()
      }
    })

    this.writable = new WritableStream({
      write (rev) {
        return docsGetter.addRev(rev)
      },
      close () {
        return docsGetter.close()
      }
    }, queueingStrategy)
  }
  
  get docsRead () {
    return this.docsGetter.docsRead
  }
}

export default function getDocs (db, { batchSize } = {}) {
  return new GetDocsTransformStream(db, { batchSize })
}
