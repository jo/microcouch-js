import HttpReplicator from '../Replicator.js'
import BulkGetParser from './BulkGetParser'

export const base64ToBlob = (data, type) => {
  const raw = atob(data)
  const length = raw.length
  const uInt8Array = new Uint8Array(length)
  for (let i = 0; i < length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type })
}

export const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dec = `data:${blob.type};base64,`
      const data = reader.result.slice(dec.length)
      resolve(data)
    }
    reader.readAsDataURL(blob)
  })
}

class GetRevsTransformStream extends TransformStream {
  constructor (adapter, stats) {
    stats.docsRead = 0

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
        const reader = response.body.getReader()
        const bulkDocsParser = new BulkGetParser()

        bulkDocsParser.onDoc = async r => {
          const { id, docs } = r
          if (!(id in batchById)) {
            console.log(r)
            throw new Error('recived doc which we did not ask for')
          }

          const byRev = {}
          for (const { ok: doc } of docs) {
            byRev[doc._rev] = doc
            if (doc._attachments) {
              for (const name in doc._attachments) {
                const attachment = doc._attachments[name]
                const { data, content_type } = attachment
                attachment.data = await base64ToBlob(data, content_type)
              }
            }
          }

          const row = batchById[id]
          for (const rev of row.revs) {
            if (rev.rev in byRev) {
              // TODO: think of cases where we don't have the rev (it does)
              // then we'd emit a row with missing docs
              // can we handle it?
              // seems like we're ignoring it
              // should we add latest=true?
              rev.doc = byRev[rev.rev]
            }
          }
          controller.enqueue(row)
          stats.docsRead++
        }

        while(true) {
          const { done, value } = await reader.read()
          if (done) break
          await bulkDocsParser.write(value)
        }
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024*4 })
  }
}

class SaveDocsWritableStream extends WritableStream {
  constructor (adapter, stats = {}) {
    stats.docsWritten = 0

    super({
      async write (batch) {
        const revs = batch.reduce((memo, { revs }) => memo.concat(revs.map(({ doc }) => doc)), [])
        if (revs.length > 0) {
          for (const doc of revs) {
            if (doc._attachments) {
              for (const name in doc._attachments) {
                const attachment = doc._attachments[name]
                const { data } = attachment
                attachment.data = await blobToBase64(data)
              }
            }
          }
          const response = await adapter.bulkDocs(revs)
        }
        // TODO: check response
        // TODO: record write failures
        stats.docsWritten += batch.length
      }
    })
  }
}

export default class HttpInlineReplicator extends HttpReplicator {
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
