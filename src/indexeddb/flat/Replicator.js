import BaseReplicator from '../../base/Replicator.js'

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
        // TODO: think whether we need deleted here
        const { id, changes: revs, deleted } = changes.shift()
        controller.enqueue({ id, revs, deleted })
      }
    })
  }
}

class FilterMissingRevsTransformStream extends TransformStream {
  constructor (adapter) {
    super({
      async transform (batchOfChanges, controller) {
        const ids = batchOfChanges.map(({ id }) => id)
        const entries = await adapter.getEntries(ids)
        for (const { id, revs } of batchOfChanges) {
          const entry = entries[id]
          if (entry) {
            const filteredRevs = revs.filter(({ rev }) => !(rev in entry.revs))
            if (filteredRevs.length > 0) {
              controller.enqueue({
                id,
                revs: filteredRevs,
                // pass over entry to be later used in saveRevs
                entry
              })
            }
          } else {
            controller.enqueue({
              id,
              revs
            })
          }
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
        // TODO: check response
        stats.docsWritten += await adapter.saveRevsWithEntries(revs)
      }
    }, { highWaterMark: 1024*4 })
  }
}

export default class Replicator extends BaseReplicator  {
  constructor (adapter) {
    super()
    this.adapter = adapter
  }

  getInfo () {
    const { db_uuid, seq } = this.adapter.metadata
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
