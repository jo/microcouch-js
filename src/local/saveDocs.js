import { docToEntry } from './model.js'

class DocsWriter {
  constructor (db) {
    this.db = db

    this.docsWritten = 0
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

  async saveDocs (docs) {
    const docsWithEntries = await this.getExistingEntries(docs)
    const { seq, doc_count } = this.db.metadata
    const { entries, metadata } = await this.buildEntries(docsWithEntries, { seq, doc_count })
    return this.saveEntries(entries, metadata)
  }
}

class SaveDocsWritableStream extends WritableStream {
  constructor (db, stats = {}) {
    const docsWriter = new DocsWriter(db)

    super({
      write (docs) {
        return docsWriter.saveDocs(docs)
      },
      close () {
        stats.docsWritten = docsWriter.docsWritten
      }
    })
  }
}

export default function saveDocs (db, stats = {}) {
  return new SaveDocsWritableStream(db, stats)
}
