class FilterMissingRevsTransformStream extends TransformStream {
  constructor (database) {
    super({
      start () {},

      // TODO: move to Database somehow
      async transform (batchOfChanges, controller) {
        return new Promise((resolve, reject) => {
          const store = database.getDocStore('readonly')

          let cnt = batchOfChanges.length
          for (const change of batchOfChanges) {
            const { id, revs } = change
            store.get(id).onsuccess = e => {
              cnt--
              const entry = e.target.result
              if (entry) {
                controller.enqueue({
                  id,
                  revs: revs.filter(rev => rev in entry.revs),
                  entry
                })
              } else {
                controller.enqueue({ id, revs })
              }
              if (cnt === 0) {
                resolve()
              }
            }
          }
        })
      },
      
      flush () {}
    })
  }
}

class SaveDocsWritableStream extends WritableStream {
  constructor (database, stats = {}) {
    stats.docsWritten = 0

    super({
      async write (docs) {
        stats.docsWritten += await database.saveDocs(docs)
      },
      close () {}
    })
  }
}

export default class Replicator {
  constructor (database) {
    this.database = database
  }

  getUuid () {
    const { db_uuid } = this.database.metadata
    return db_uuid
  }

  getUpdateSeq () {
    const { seq } = this.database.metadata
    return seq
  }

  getReplicationLog (id) {
    return this.database.getLocalDoc(id)
  }

  saveReplicationLog (doc) {
    return this.database.saveLocalDoc(doc)
  }
  
  getChanges (since, { limit } = {}, stats = {}) {
    throw new Error('Not supported for Local yet')
  }

  filterMissingRevs () {
    return new FilterMissingRevsTransformStream(this.database)
  }

  getDocs (stats = {}) {
    throw new Error('Not supported for Local yet')
  }

  saveDocs (stats = {}) {
    return new SaveDocsWritableStream(this.database, stats)
  }
}
