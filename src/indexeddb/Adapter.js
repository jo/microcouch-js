import { ReadableStream } from 'web-streams-polyfill/ponyfill'

import { md5FromBlob } from '../md5.js'
import { buildEntry, updateEntry, docFromEntry, changeFromEntry } from '../datamodel.js'

const DOC_STORE = 'docs'
const META_STORE = 'meta'

const calculateDigest = async blob => {
  const md5 = await md5FromBlob(blob, true)
  const md5Base64 = btoa(md5)
  return `md5-${md5Base64}`
}

export default class IndexedDBAdapter {
  constructor ({ name }) {
    this.name = name
    this.db = null
  }

  async init () {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(this.name)

      openReq.onerror = e => reject(e.target.error)
      openReq.onblocked = e => reject(e)

      openReq.onupgradeneeded = e => {
        const db = e.target.result

        const keyPath = 'id'
        const docStore = db.createObjectStore(DOC_STORE, { keyPath })
        docStore.createIndex('seq', 'seq', { unique: true })
        docStore.createIndex('revs', 'available', { multiEntry: true })
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
            if (!e.target.result) {
              const metadata =  {
                id: META_STORE,
                doc_count: 0,
                seq: 0,
                db_uuid: crypto.randomUUID()
              }
              metaStore.put(metadata)
            }
          }
      }
    })
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

  getMetadata () {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(META_STORE, 'readonly')
      transaction.onerror = e => reject(e)
      transaction
        .objectStore(META_STORE)
        .get(META_STORE)
        .onsuccess = e => resolve(e.target.result)
    })
  }

  getLocalDoc (id) {
    const _id = `_local/${id}`
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      transaction.onerror = e => reject(e)
      transaction
        .objectStore(DOC_STORE)
        .get(_id)
        .onsuccess = e => {
          const entry = e.target.result
          const doc = entry ? entry.data : { _id }
          resolve(doc)
        }
    })
  }

  saveLocalDoc (doc) {
    const entry = {
      id: doc._id,
      data: {
        ...doc,
        _rev: doc._rev ? doc._rev + 1 : 1
      }
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readwrite')
      transaction.onerror = e => reject(e)
      transaction
        .objectStore(DOC_STORE)
        .put(entry)
        .onsuccess = () => resolve({ rev: doc._rev })
    })
  }

  async getDiff (batch) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      transaction.onerror = e => reject(e)
      const index = transaction.objectStore(DOC_STORE).index('revs')
      
      const result = []
      transaction.oncomplete = () => {
        const filteredResult = result.filter(({ revs }) => revs.length > 0)
        resolve(filteredResult)
      }

      for (const { id, revs } of batch) {
        const row = { id, revs: [] }
        for (const { rev } of revs) {
          index.getKey([id, rev])
            .onsuccess = e => {
              if (!e.target.result) {
                row.revs.push({ rev })
              }
            }
        }
        result.push(row)
      }
    })
  }

  async getRevs (docs) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      transaction.onerror = e => reject(e)

      const store = transaction.objectStore(DOC_STORE)
      
      transaction.oncomplete = () => resolve(docs)

      for (const doc of docs) {
        const { id, revs } = doc
        
        store
          .get(id)
          .onsuccess = e => {
            const entry = e.target.result
            if (!entry) {
              throw new Error(`doc not found: '${id}'`)
            }

            for (const rev of revs) {
              rev.doc = docFromEntry(entry, rev.rev)
            }
          }
      }
    })
  }

  async saveDocs (docs) {
    // save revisions
    const docRevs = docs.map(doc => ({
      id: doc._id,
      revs: [{ doc }]
    }))
    return this.saveRevs(docRevs, { newEdits: true })
  }

  async saveRevs (docRevs, { newEdits }) {
    // calculate attachments digests
    for (const { id, revs } of docRevs) {
      for (const { doc: { _attachments } } of revs) {
        if (!_attachments) continue
        for (const name in _attachments) {
          const attachment = _attachments[name]
          const { data } = attachment
          if (!data) continue
          attachment.digest = await calculateDigest(data)
        }
      }
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE, META_STORE], 'readwrite')
      transaction.onerror = e => reject(e)

      const result = []
      transaction.oncomplete = () => resolve(result)
      
      const docStore = transaction.objectStore(DOC_STORE)
      const metaStore = transaction.objectStore(META_STORE)

      metaStore
        .get(META_STORE)
        .onsuccess = e => {
          const metadata = e.target.result

          let cnt = docRevs.length
          for (const { id, revs } of docRevs) {
            docStore
              .get(id)
              .onsuccess = e => {
                const existingEntry = e.target.result

                const isNew = !existingEntry
                const wasDeleted = existingEntry && existingEntry.deleted
                
                const entry = existingEntry || buildEntry(id)
                const updatedEntry = updateEntry(entry, revs, { newEdits })
                updatedEntry.seq = ++metadata.seq
                
                const isDeleted = updatedEntry.deleted
                
                docStore
                  .put(updatedEntry)
                  .onsuccess = () => {
                    result.docsWritten++

                    let delta = 0
                    if (isNew) {
                      delta = 1
                    } else {
                      if (!wasDeleted && isDeleted) delta = -1
                      if (wasDeleted && !isDeleted) delta = 1
                    }
                    metadata.doc_count += delta
                    result.push({ id, rev: updatedEntry.rev })

                    cnt--
                    if (cnt === 0) {
                      metaStore.put(metadata)
                    }
                  }
              }
          }
        }
    })
  }

  async getChanges ({ since, limit } = {}) {
    since = since || -1
    limit = limit || -1

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      transaction.onerror = e => reject(e)
      const index = transaction.objectStore(DOC_STORE).index('seq')

      const changes = []
      let lastSeq = -1
      let received = 0

      index.openCursor(IDBKeyRange.lowerBound(since, true))
        .onsuccess = e => {
          if (!e.target.result) {
            return
          }
          const cursor = e.target.result

          const entry = cursor.value
          const change = changeFromEntry(entry)
          changes.push(change)
          lastSeq = change.seq

          received++
          if (received !== limit) {
            cursor.continue()
          }
        }

      transaction.oncomplete = () => resolve({ changes, lastSeq })
    })
  }

  getDoc (id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      transaction.onerror = e => reject(e)
      transaction
        .objectStore(DOC_STORE)
        .get(id)
        .onsuccess = e => {
          const entry = e.target.result
          if (!entry) return reject(new Error('not found'))
          const doc = docFromEntry(entry, entry.rev)
          resolve(doc)
        }
    })
  }

  getDocs (range, direction) {
    const db = this.db

    return new ReadableStream({
      start (controller) {
        const transaction = db.transaction(DOC_STORE, 'readonly')

        transaction.onerror = e => {
          console.error('error getDocs', e)
          controller.error(e)
        }
        transaction.oncomplete = () => controller.close()
        const store = transaction.objectStore(DOC_STORE)
        
        store.openCursor(range, direction)
          .onsuccess = e => {
            if (!e.target.result) {
              return
            }

            const cursor = e.target.result

            const entry = cursor.value
            const doc = docFromEntry(entry, entry.rev)
            if (!doc._deleted) {
              controller.enqueue(doc)
            }
            cursor.continue()
          }
      }

      // TODO: could we use poll and call cursor.continue there?
    })
  }
}
