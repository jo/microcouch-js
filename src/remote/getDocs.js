import MultipartRelated from 'multipart-related'

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

const assembleDoc = async (parts, { decoder }) => {
  if (parts.length === 0) return

  const { headers, data } = parts.shift()
  const json = decoder.decode(data)
  const doc = JSON.parse(json)
  
  for (const { headers, data } of parts) {
    const contentDisposition = headers['Content-Disposition']
    if (!contentDisposition) {
      console.warn('skipping attachment with missing Content-Disposition header', headers, doc, parts)
      continue
    }

    const [_, filename] = contentDisposition.match(/filename="([^"]+)"/)
    if (!filename) {
      console.warn('missing filename in Content-Disposition header "%s"', contentDisposition, headers, doc, parts)
      continue
    }
    if (!(filename in doc._attachments)) {
      console.warn('skipping attachment due to missing filename "%s" in docs attachments stub', filename, headers, doc, parts)
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
      console.warn('skipping attachment with unsupported Content-Encoding header %s', contentEncoding, headers, doc, parts)
      continue
    } else {
      doc._attachments[filename].data = blob
      delete doc._attachments[filename].follows
    }
  }

  return doc
}

class GetDocsTransformStream extends TransformStream {
  constructor (db, stats) {
    stats.docsRead = 0

    const decoder = new TextDecoder()

    super({
      start () {},

      async transform (docs, controller) {
        const url = new URL(`${db.root}/_bulk_get`, db.url)
        url.searchParams.set('revs', 'true')
        url.searchParams.set('attachments', 'true')

        const payload = { docs }
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        const body = await gzip(blob)
        const response = await fetch(url, {
          headers: {
            ...db.headers,
            'Content-Type': 'application/json',
            'Accept': 'multipart/related',
            'Content-Encoding': 'gzip'
          },
          method: 'post',
          body
        })
        if (response.status !== 200) {
          throw new Error('Could not get docs multipart')
          // TODO: use controller.error and controller.terminate
        }
        
        const contentType = response.headers.get('Content-Type')
        const parser = new MultipartRelated(contentType)
        const reader = response.body.getReader()

        let batchComplete = false
        let currentParts = []
        let currentBoundary = null
        let doc
        do {
          const { done, value } = await reader.read()
          const parts = parser.read(value)
          for (const part of parts) {
            if (!part.boundary) {
              doc = await assembleDoc(currentParts, { decoder })
              if (doc) {
                controller.enqueue(doc) 
                stats.docsRead++
              }
              currentParts = []
              currentBoundary = null
              doc = await assembleDoc([part], { decoder })
              if (doc) {
                controller.enqueue(doc) 
                stats.docsRead++
              }
              // single doc without attachments
            } else if (currentBoundary && currentBoundary !== part.boundary) {
              doc = await assembleDoc(currentParts, { decoder })
              if (doc) {
                controller.enqueue(doc) 
                stats.docsRead++
              }
              currentParts = [part]
              currentBoundary = null
            } else {
              currentParts.push(part)
              currentBoundary = part.boundary
            }
          }
          batchComplete = done
        } while (!batchComplete)
        
        // assemble the rest
        doc = await assembleDoc(currentParts, { decoder })
        if (doc) {
          controller.enqueue(doc) 
          stats.docsRead++
        }
      },
      
      flush () {}
    })
  }
}


export default function getDocs (db, stats = {}) {
  return new GetDocsTransformStream(db, stats)
}
