import { makeUuid } from '../utils.js'
import getDiff from './getDiff.js'
import saveDocs from './saveDocs.js'

const DOC_STORE = 'docs'
const META_STORE = 'meta'

export default class Local {
  constructor ({ name }) {
    this.name = name
    this.db = null
    this.metadata = null
  }

  async init () {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(this.name)

      openReq.onupgradeneeded = e => {
        const db = e.target.result

        const keyPath = 'id'
        const docStore = db.createObjectStore(DOC_STORE, { keyPath })
        docStore.createIndex('seq', 'seq', { unique: true })
        db.createObjectStore(META_STORE, { keyPath })
      }

      openReq.onsuccess = e => {
        this.db = e.target.result

        this.db.onabort = () => this.db.close()
        this.db.onversionchange = () => this.db.close()

        const transaction = this.db.transaction(META_STORE, 'readwrite')
        transaction.oncomplete = () => resolve()

        const metaStore = transaction.objectStore(META_STORE)

        metaStore
          .get(META_STORE)
          .onsuccess = e => {
            this.metadata = e.target.result || { id: META_STORE }

            let changed = false

            if (!('doc_count' in this.metadata)) {
              changed = true
              this.metadata.doc_count = 0
            }

            if (!('seq' in this.metadata)) {
              changed = true
              this.metadata.seq = 0
            }

            if (!('db_uuid' in this.metadata)) {
              changed = true
              this.metadata.db_uuid = makeUuid()
            }

            if (changed) {
              metaStore.put(this.metadata)
            }
          }
      }
      openReq.onerror = e => reject(e.target.error)
      openReq.onblocked = e => reject(e)
    })
  }

  // TODO: make this kinda private or use the indexeddb directly
  getDocStore (mode) {
    return this.db.transaction(DOC_STORE, mode).objectStore(DOC_STORE)
  }

  // TODO: make this kinda private or use the indexeddb directly
  getStores (mode) {
    const transaction =  this.db.transaction([DOC_STORE, META_STORE], mode)
    return {
      docStore: transaction.objectStore(DOC_STORE),
      metaStore: transaction.objectStore(META_STORE)
    }
  }

  destroy () {
    return new Promise((resolve, reject) => {
      this.db.close()
      const req = indexedDB.deleteDatabase(this.name)
      req.onsuccess = () => {
        this.db = null
        this.metadata = null
        resolve()
      }
    })
  }

  getUuid () {
    const { db_uuid } = this.metadata
    return db_uuid
  }

  getUpdateSeq () {
    const { seq } = this.metadata
    return seq
  }

  // TODO: use getDoc
  async getReplicationLog (id) {
    const _id = `_local/${id}`
    return new Promise((resolve, reject) => {
      this.getDocStore('readonly')
        .get(_id)
        .onsuccess = e => {
          const entry = e.target.result
          const doc = entry ? entry.data : { _id }
          resolve(doc)
        }
    })
  }

  // TODO: use saveDoc
  async saveReplicationLog (doc) {
    doc._rev = doc._rev ? doc._rev + 1 : 1
    return new Promise((resolve, reject) => {
      const entry = {
        id: doc._id,
        data: doc
      }
      this.getDocStore('readwrite')
        .put(entry)
        .onsuccess = () => resolve({ rev: doc._rev })
    })
  }

  getChanges (since, { limit } = {}) {
    throw new Error('Not supported for Local yet')
  }

  getDiff ({ batchSize } = { batchSize: 128 }) {
    return new getDiff(this, { batchSize })
  }

  getDocs ({ batchSize } = { batchSize: 512 }) {
    throw new Error('Not supported for Local yet')
  }

  saveDocs ({ batchSize } = { batchSize: 128 }) {
    return saveDocs(this, { batchSize })
  }
}
