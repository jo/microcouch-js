import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill'

import Replicator from '../Replicator.js'

class GetChangesReadableStream extends ReadableStream {
  constructor (adapter, { since, limit }, stats = {}) {
    let changes

    super({
      async start(controller) {
        const response = await adapter.getChanges({ since, limit })
        changes = response.changes
        stats.numberOfChanges = changes.length
        stats.lastSeq = response.lastSeq
      },

      pull (controller) {
        if (changes.length === 0) {
          controller.close()
          return
        }
        const { id, changes: revs } = changes.shift()
        controller.enqueue({ id, revs })
      }
    })
  }
}

class FilterMissingRevsTransformStream extends TransformStream {
  constructor (adapter) {
    super({
      async transform (batchOfChanges, controller) {
        const ids = batchOfChanges.map(({ id }) => id)
        const revs = await adapter.getDiff(batchOfChanges)
        for (const rev of revs) {
          controller.enqueue(rev)
        }
      }
    }, { highWaterMark: 8 }, { highWaterMark: 1024 })
  }
}

class GetDocsTransformStream extends TransformStream {
  constructor (adapter, stats) {
    stats.docsRead = 0

    super({
      async transform (batchOfMissingDocs, controller) {
        if (batchOfMissingDocs.length === 0) return

        const response = await adapter.getRevs(batchOfMissingDocs)

        for (const row of response) {
          stats.docsRead++
          controller.enqueue(row)
        }
      }
    }, { highWaterMark: 8 })
  }
}

class SaveDocsWritableStream extends WritableStream {
  constructor (adapter, stats = {}) {
    stats.docsWritten = 0

    super({
      async write (revs) {
        const result = await adapter.saveRevs(revs, { newEdits: false })
        stats.docsWritten += result.length
      }
    }, { highWaterMark: 1024*4 })
  }
}

export default class IndexedDBReplicator extends Replicator  {
  constructor (adapter) {
    super()
    this.adapter = adapter
  }

  async getInfo () {
    const { db_uuid, seq } = await this.adapter.getMetadata()
    return {
      uuid: db_uuid,
      updateSeq: seq
    }
  }

  getLog (id) {
    return this.adapter.getLocalDoc(id)
  }

  saveLog (doc) {
    return this.adapter.saveLocalDoc(doc)
  }
  
  getChanges (since, { limit } = {}, stats = {}) {
    return new GetChangesReadableStream(this.adapter, {since, limit }, stats)
  }

  getDiff () {
    return new FilterMissingRevsTransformStream(this.adapter)
  }

  getRevs (stats = {}) {
    return new GetDocsTransformStream(this.adapter, stats)
  }

  saveRevs (stats = {}) {
    return new SaveDocsWritableStream(this.adapter, stats)
  }
}
