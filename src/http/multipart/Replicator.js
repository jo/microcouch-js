import MultipartRelated from 'multipart-related'

import BaseReplicator from '../../base/Replicator.js'
import { gunzip } from '../../utils.js'

class GetChangesReadableStream extends ReadableStream {
  constructor (adapter, { since, limit }) {
    let reader

    super({
      async start(controller) {
        const response = await adapter.getChanges(since, { limit })
        reader = response.body.getReader()
      },

      async pull (controller) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          reader.releaseLock()
        } else {
          controller.enqueue(value)
        }
      }
    }, { highWaterMark: 1024*1024 })
  }
}

// find next position of linebreak where to split changes
const nextSplitPosition = data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 10) return i
  }
  return -1
}

class ChangesParserTransformStream extends TransformStream {
  constructor (stats = {}) {
    stats.numberOfChanges = 0
    stats.lastSeq = null

    const decoder = new TextDecoder()

    super({
      transform (chunk, controller) {
        const newData = new Uint8Array(this.data.length + chunk.length)
        newData.set(this.data, 0)
        newData.set(chunk, this.data.length)
        this.data = newData

        while (true) {
          const endPosition = nextSplitPosition(this.data)
          if (endPosition === -1) return

          if (endPosition > 0) {
            const line = decoder.decode(this.data.slice(0, endPosition))
            let change
            try {
              change = JSON.parse(line)
            } catch (e) {
              throw new Error('could not parse change JSON')
            }

            // TODO: think about deleted - is this needed?
            const { last_seq, id, changes: revs, deleted } = change
            if (last_seq) {
              stats.lastSeq = last_seq
            } else {
              stats.numberOfChanges++
              controller.enqueue({ id, revs, deleted })
            }
          }

          this.data = this.data.slice(endPosition + 1)
        }
      },
      
      data: new Uint8Array(0),
      startParsed: false
    }, { highWaterMark: 1024*1024*8 }, { highWaterMark: 1024 })
  }
}

class FilterMissingRevsTransformStream extends TransformStream {
  constructor (adapter) {
    super({
      async transform (batch, controller) {
        const payload = {}
        for (const { id, revs } of batch) {
          payload[id] = revs.map(({ rev }) => rev)
        }

        const response = await adapter.revsDiff(payload)
        const diff = await response.json()

        for (const id in diff) {
          if (!(missing in diff[id])) {
            throw new Error('missing `missing` property in revsDiff response')
          }

          const { missing } = diff[id]
          const revs = missing.map(rev => ({ rev }))
          if (revs.length > 0) {
            controller.enqueue({ id, revs })
          }
        }
      }
    })
  }
}

class GetRevsTransformStream extends TransformStream {
  constructor (adapter, stats) {
    stats.docsRead = 0

    const decoder = new TextDecoder()

    // assemble a doc with attachments from parts received via multipart/related response
    const assembleDoc = async parts => {
      if (parts.length === 0) return

      // first part is the doc
      const { headers, data } = parts.shift()
      const docContentType = headers['Content-Type']
      if (!docContentType) {
        throw new Error('missing Content-Type header for first part')
      }
      if (docContentType !== 'application/json') {
        throw new Error(`wrong Content-Type header for first part '${docContentType}', must be application/json`)
      }
      const json = decoder.decode(data)
      let doc
      try {
        doc = JSON.parse(json)
      } catch (e) {
        throw new Error('Error parsing doc JSON')
      }
      
      for (const { headers, data } of parts) {
        const contentDisposition = headers['Content-Disposition']
        if (!contentDisposition) {
          throw new Error('attachment with missing Content-Disposition header')
        }

        const [_, filename] = contentDisposition.match(/filename="([^"]+)"/)
        if (!filename) {
          throw new Error(`missing filename in Content-Disposition header '${contentDisposition}'`)
        }
        if (!(filename in doc._attachments)) {
          throw new Error(`missing filename '${filename}' in docs attachments stub`)
        }

        const type = headers['Content-Type']
        if (!type) {
          throw new Error('missing Content-Type header')
        }

        const blob = new Blob([data], { type })

        const contentEncoding = headers['Content-Encoding']
        if (contentEncoding === 'gzip') {
          doc._attachments[filename].data = await gunzip(blob, type)
          delete doc._attachments[filename].follows
          delete doc._attachments[filename].encoding
          delete doc._attachments[filename].encoded_length
        } else if (contentEncoding) {
          throw new Error(`unsupported Content-Encoding '${contentEncoding}'. Must be 'gzip'`)
        } else {
          doc._attachments[filename].data = blob
          delete doc._attachments[filename].follows
        }
      }

      return doc
    }

    super({
      async transform (batch, controller) {
        if (batch.length === 0) return

        const docs = []
        const batchById = {}

        for (const row of batch) {
          const { id, revs } = row
          batchById[id] = row
          for (const { rev } of revs) {
            docs.push({ id, rev })
          }
        }
        
        if (docs.length === 0) {
          throw new Error('received messages with empty revs')
        }

        // request revs
        const response = await adapter.bulkGet(docs)
        const contentType = response.headers.get('Content-Type')
        const parser = new MultipartRelated(contentType)
        const reader = response.body.getReader()

        // emit docs, combine by id
        let lastId
        const docsById = {}
        const emitDoc = async (parts, flush) => {
          // assemble doc from parts
          const doc = await assembleDoc(parts)

          if (doc) {
            const { _id: id, _rev: rev } = doc
            docsById[id] = docsById[id] || {}
            docsById[id][rev] = doc

            if (flush || (lastId && lastId !== id)) {
              if (!(id in batchById)) {
                throw new Error(`received a doc which was not requested: '${id}'`)
              }
              const row = batchById[id]
              const revs = []
              for (const rev of row.revs) {
                if (rev.rev in docsById[id]) {
                  const doc = docsById[id][rev.rev]
                  revs.push({ rev, doc })
                } else {
                  console.warn(`could not fetch rev '${rev.rev}' for doc '${id}'`)
                }
              }
              controller.enqueue({ ...row, revs })
              stats.docsRead++
            }
            lastId = id
          }
        }

        // parse multipart response
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
        emitDoc(currentParts, true)
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024*4 })
  }
}

// use put doc multipart (not implemented in CouchDB yet, though)
// TODO: support attachments
class SaveDocsWritableStream extends WritableStream {
  constructor (adapter, stats = {}) {
    stats.docsWritten = 0

    super({
      async write (batch) {
        const payload = batch.reduce((memo, { revs }) => memo.concat(revs.map(({ doc }) => doc)), [])
        const response = await adapter.bulkDocs(payload)
        // TODO: check response
        // TODO: record write failures
        stats.docsWritten += batch.length
      }
    })
  }
}

export default class Replicator extends BaseReplicator {
  constructor (adapter) {
    super()
    this.adapter = adapter
  }

  // TODO: compose uuid from server uuid + dbname
  async getInfo () {
    const [
      { uuid },
      { update_seq: updateSeq }
    ] = await Promise.all([
      this.adapter.getServerInfo(),
      this.adapter.getInfo()
    ])
    
    return { uuid, updateSeq }
  }

  // fallback to a stub if non-existent
  async getLog (id) {
    const _id = `_local/${id}`
    let doc

    try {
      const response = await this.adapter.getDoc(_id)
      doc = await response.json()
    } catch (e) {
      doc = { _id }
    }

    return doc
  }

  async saveLog (doc) {
    const response = await this.adapter.saveDoc(doc)
    return response.json()
  }

  getChanges (since, { limit } = {}, stats = {}) {
    const getChangesReadableStream = new GetChangesReadableStream(this.adapter, { since, limit })
    const changesParserTransformStream = new ChangesParserTransformStream(stats)

    return getChangesReadableStream
      .pipeThrough(changesParserTransformStream)
  }

  getDiff () {
    return new FilterMissingRevsTransformStream(this.adapter)
  }

  getRevs (stats = {}) {
    return new GetRevsTransformStream(this.adapter, stats)
  }

  saveRevs (stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats)
  }
}
