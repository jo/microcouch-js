import MultipartRelated from 'multipart-related'

import { gzip, gunzip } from '../utils.js'

// find next position where to split changes
const nextSplitPosition = (data, offset = 0) => {
  if (offset > data.length + 4) return [-1]
  for (let i = offset; i < data.length; i++) {
    // mid changes: `},\r\n{` == [ 125, 44, 10, 123 ]
    if (data[i] === 125 && data[i+1] === 44 && data[i+2] === 13 && data[i+3] === 10 && data[i+4] === 123) return [i]
    // end of changes: `\n],` == [ 10, 93, 44 ]
    if (data[i] === 10 && data[i+1] === 93 && data[i+2] === 44) return [i, true]
  }
  return [-1]
}

class ChangesParserTransformStream extends TransformStream {
  constructor (stats = {}) {
    stats.numberOfChanges = 0
    stats.lastSeq = null

    super({
      start () {},

      transform (chunk, controller) {
        const newData = new Uint8Array(this.data.length + chunk.length)
        newData.set(this.data, 0)
        newData.set(chunk, this.data.length)
        this.data = newData

        if (!this.startParsed) {
          // remove the start: `{"results":[\n`
          this.data = this.data.slice(13)
          this.startParsed = true
        }

        let change
        do {
          change = null

          const [endPosition, endReached] = nextSplitPosition(this.data)
          if (endPosition === -1) continue

          if (endPosition > 0) {
            const json = this.decoder.decode(this.data.slice(0, endPosition + 1))
            change = JSON.parse(json)
            const { id, changes, deleted } = change
            const revs = changes.map(({ rev }) => rev)
            const row = { id, revs }
            if (deleted) {
              row.deleted = true
            }
            stats.numberOfChanges++
            controller.enqueue(row)
          }

          if (endReached) {
            const rest = this.decoder.decode(this.data.slice(endPosition + 4))
            const { last_seq } = JSON.parse(`{${rest}`)
            stats.lastSeq = last_seq
            return
          }

          this.data = this.data.slice(endPosition + 4)
        } while (change)
      },
      
      flush () {},

      decoder: new TextDecoder(),
      data: new Uint8Array(0),
      startParsed: false
    })
  }
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
  constructor (database, stats) {
    stats.docsRead = 0

    const decoder = new TextDecoder()

    super({
      start () {},

      async transform (batchOfMissingDocs, controller) {
        const docs = []
        const entries = {}

        for (const { id, revs, entry } of batchOfMissingDocs) {
          entries[id] = entry
          for (const rev of revs) {
            docs.push({ id, rev })
          }
        }

        const emitDoc = async parts => {
          const doc = await assembleDoc(parts, { decoder })
          if (doc) {
            const entry = entries[doc._id]
            controller.enqueue({ doc, entry }) 
            stats.docsRead++
          }
        }

        const url = new URL(`${database.root}/_bulk_get`, database.url)
        url.searchParams.set('revs', 'true')
        url.searchParams.set('attachments', 'true')

        // TODO: move this to database
        const payload = { docs }
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        const body = await gzip(blob)
        const response = await fetch(url, {
          headers: {
            ...database.headers,
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
        do {
          const { done, value } = await reader.read()
          const parts = parser.read(value)
          for (const part of parts) {
            if (!part.boundary) {
              emitDoc(currentParts)
              currentParts = []
              currentBoundary = null
              emitDoc([part])
              // single doc without attachments
            } else if (currentBoundary && currentBoundary !== part.boundary) {
              emitDoc(currentParts)
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
        emitDoc(currentParts)
      },
      
      flush () {}
    }, { highWaterMark: 8 })
  }
}

export default class Replicator {
  constructor (database) {
    this.database = database
  }

  async getUuid () {
    const { uuid } = await this.database.getServerInfo()
    return uuid
  }

  async getUpdateSeq () {
    const { update_seq } = await this.database.getInfo()
    return update_seq
  }

  // fallback to a stub if non-existent
  async getReplicationLog (id) {
    const _id = `_local/${id}`
    try {
      const doc = await this.database.getDoc(_id)
      return doc
    } catch (e) {
      return { _id }
    }
  }

  saveReplicationLog (doc) {
    return this.database.saveDoc(doc)
  }

  // get stream of changes
  async getChanges (since, { limit } = {}, stats = {}) {
    // TODO: put this into database
    const url = new URL(`${this.database.root}/_changes`, this.database.url)
    url.searchParams.set('feed', 'normal')
    url.searchParams.set('style', 'all_docs')
    if (since) {
      url.searchParams.set('since', since)
    }
    if (limit) {
      url.searchParams.set('limit', limit)
      url.searchParams.set('seq_interval', limit)
    }

    const response = await fetch(url, {
      headers: this.database.headers
    })
    if (response.status !== 200) {
      throw new Error('Could not get changes')
    }

    const changesParserTransformStream = new ChangesParserTransformStream(stats)

    // create a new ReadableStream out of the response
    // in order to get it polyfilled
    const reader = response.body.getReader()
    const readableStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
        controller.close()
        reader.releaseLock()
      }
    })
    
    return readableStream
      .pipeThrough(changesParserTransformStream)
  }

  filterMissingRevs () {
    throw new Error('Not supported for Remote yet')
  }

  // get a stream of docs
  getDocs (stats = {}) {
    return new GetDocsTransformStream(this.database, stats)
  }

  saveDocs (stats = {}) {
    throw new Error('Not supported for Remote yet')
  }
}
