import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill'

import Replicator from '../Replicator.js'
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

            const { last_seq, id, changes: revs } = change
            if (last_seq) {
              stats.lastSeq = last_seq
            } else {
              stats.numberOfChanges++
              controller.enqueue({ id, revs })
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
          if (!('missing' in diff[id])) {
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


export default class HttpReplicator extends Replicator {
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
