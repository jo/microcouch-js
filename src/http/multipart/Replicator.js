import MultipartRelated from 'multipart-related'

import HttpReplicator from '../Replicator.js'

class PatchableReadableStream extends ReadableStream {
  constructor (reader) {
    super({
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
  }
}

const gunzip = (blob, type) => {
  const ds = new DecompressionStream('gzip')

  // `const compressedStream = blob.stream().pipeThrough(ds)`
  // is not possible in eg FF so we create a new ReadableStream out of the blob
  // in order to be able to get it polyfilled
  const reader = blob.stream().getReader()
  const readableStream = new PatchableReadableStream(reader)

  const decompressedStream = readableStream.pipeThrough(ds)
  const responseOptions = {
    headers: {
      'Content-Type': type
    }
  }
  return new Response(decompressedStream, responseOptions).blob()
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
            if (!(id in batchById)) {
              throw new Error(`received a doc which was not requested: '${id}'`)
            }
            
            docsById[id] = docsById[id] || {}
            docsById[id][rev] = doc

            if (lastId && lastId !== id) {
              const idToEmit = lastId
              const row = batchById[idToEmit]
              const revs = []
              for (const rev of row.revs) {
                if (rev.rev in docsById[idToEmit]) {
                  const doc = docsById[idToEmit][rev.rev]
                  revs.push({ rev, doc })
                } else {
                  console.warn(`could not fetch rev '${rev.rev}' for doc '${idToEmit}'`)
                }
              }
              delete docsById[idToEmit]
              controller.enqueue({ ...row, revs })
              stats.docsRead++
            }
            lastId = id

          }
          if (flush) {
            for (const id in docsById) {
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
              delete docsById[id]
              controller.enqueue({ ...row, revs })
              stats.docsRead++
            }
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
              await emitDoc(currentParts)
              currentParts = []
              currentBoundary = null
              await emitDoc([part])
              // single doc without attachments
            } else if (currentBoundary && currentBoundary !== part.boundary) {
              await emitDoc(currentParts)
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
        await emitDoc(currentParts, true)
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024*4 })
  }
}

// TODO: support attachments
// This is not so nice, because CouchDB does not support `_bulk_docs` multipart/related requests yet.
// So we will have to make multiple request for each doc with attachment.
class SaveDocsWritableStream extends WritableStream {
  constructor (adapter, stats = {}) {
    stats.docsWritten = 0

    super({
      async write (batch) {
        const revs = batch.reduce((memo, { revs }) => memo.concat(revs.map(({ doc }) => doc)), [])
        const revsWithoutAttachments = revs.filter(({ _attachments }) => !_attachments || Object.keys(_attachments).length === 0)
        if (revsWithoutAttachments.length > 0) {
          const response = await adapter.bulkDocs(revsWithoutAttachments)
        }
        const revsWithAttachments = revs.filter(({ _attachments }) => _attachments && Object.keys(_attachments).length > 0)
        if (revsWithAttachments.length > 0) {
          // TODO: support attachments
          console.warn('would save docs with attachments', revsWithAttachments)
        }
        // TODO: check response
        // TODO: record write failures
        stats.docsWritten += batch.length
      }
    })
  }
}

export default class HttpMultipartReplicator extends HttpReplicator {
  constructor (adapter) {
    super()
    this.adapter = adapter
  }

  getRevs (stats = {}) {
    return new GetRevsTransformStream(this.adapter, stats)
  }

  saveRevs (stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats)
  }
}
