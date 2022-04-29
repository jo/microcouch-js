import { docToEntry } from './model.js'

class DocsWriter {
  constructor (db, { batchSize }) {
    this.db = db
    this.batchSize = batchSize

    this.docs = []
    this.docsWritten = 0
  }

  add (doc) {
    this.docs.push(doc)
    return this.processBatch()
  }

  close () {
    return this.processBatch(true)
  }

  async getExistingEntries (docs) {
    return new Promise((resolve, reject) => {
      const readDocStore = this.db.getDocStore('readonly')

      let cnt = docs.length
      const items = []
      for (const doc of docs) {
        const item = { doc }
        readDocStore.get(doc._id).onsuccess = async e => {
          cnt--
          item.existingEntry = e.target.result
          items.push(item)

          if (cnt === 0) {
            resolve(items)
          }
        }
      }
    })
  }

  async buildEntries (docsWithEntries, metadata) {
    const entries = []
    for (const { doc, existingEntry } of docsWithEntries) {
      const seq = ++metadata.seq
      const entry = await docToEntry(seq, doc, existingEntry, { newEdits: false })
      
      let delta
      const { deleted } = entry
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = deleted ? 0 : 1
        } else {
          delta = deleted ? -1 : 0
        }
      } else {
        delta = deleted ? 0 : 1
      }
      metadata.doc_count += delta
      entries.push(entry)
    }
    
    return {
      entries,
      metadata
    }
  }

  async saveEntries (entries, { seq, doc_count }) {
    return new Promise((resolve, reject) => {
      const { docStore, metaStore } = this.db.getStores('readwrite')
      let cnt = entries.length
      for (const entry of entries) {
        docStore.put(entry).onsuccess = () => {
          this.docsWritten++
          cnt--
          if (cnt === 0) {
            this.db.metadata.seq = seq
            this.db.metadata.doc_count = doc_count
            metaStore.put(this.db.metadata).onsuccess = () => resolve()
          }
        }
      }
    })
  }

  // this (and the above) could maybe go into a bulkDocs method on Local
  async saveDocs (docs) {
    const stats = {
      docsWritten: 0
    }

    // TODO: think: if we do not need to calculate digests here (validate attachments)
    // then this could use a single transaction for both reading and writing
    // and would be simpler and also faster.
    // Like this:
    //
    // return new Promise((resolve, reject) => {
    //   const { docStore, metaStore } = this.db.getStores('readwrite')

    //   let cnt = docs.length

    //   for (const doc of docs) {
    //     docStore.get(doc._id).onsuccess = async e => {
    //       const seq = ++this.db.metadata.seq
    //       let delta

    //       const existingEntry = e.target.result

    //       const entry = await docToEntry(seq, doc, existingEntry, { newEdits: false })

    //       const { deleted } = entry
    //       if (existingEntry) {
    //         if (existingEntry.deleted) {
    //           delta = deleted ? 0 : 1
    //         } else {
    //           delta = deleted ? -1 : 0
    //         }
    //       } else {
    //         delta = deleted ? 0 : 1
    //       }

    //       this.db.metadata.doc_count += delta
    //       
    //       docStore.put(entry).onsuccess = () => {
    //         cnt--
    //         this.docsWritten++
    //         if (cnt === 0) {
    //           metaStore.put(this.db.metadata).onsuccess = () => resolve()
    //         }
    //       }
    //     }
    //   }
    // })

    const docsWithEntries = await this.getExistingEntries(docs)
    const { seq, doc_count } = this.db.metadata
    const { entries, metadata } = await this.buildEntries(docsWithEntries, { seq, doc_count })
    return this.saveEntries(entries, metadata)
  }

  async processBatch (flush) {
    if (!flush && this.docs.length < this.batchSize) return
    if (this.docs.length === 0) {
      return
    }

    let batch = []
    do {
      batch = this.docs.splice(0, this.batchSize)
      if (batch.length > 0) {
        await this.saveDocs(batch)
      }
    } while (batch.length === this.batchSize)
  }
}

export default function saveDocs (db, { batchSize } = { batchSize: 128 }) {
  const docsWriter = new DocsWriter(db, { batchSize })

  const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })
  const stream = new WritableStream({
    write (doc) {
      return docsWriter.add(doc)
    },
    close () {
      stream.docsWritten = docsWriter.docsWritten
      return docsWriter.close()
    }
  }, queueingStrategy)

  return stream
}
