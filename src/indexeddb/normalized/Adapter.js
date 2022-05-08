import { winningRev as calculateWinningRev, merge, compactTree } from 'pouchdb-merge'

import { makeUuid } from '../../utils.js'

const SEQ_STORE = 'seqs'
const DOC_STORE = 'docs'
const LOCAL_DOC_STORE = 'local-docs'
const REV_STORE = 'revs'
const ATT_STORE = 'atts'
const META_STORE = 'meta'

const REVS_LIMIT = 1000
const STATUS_AVAILABLE = { status: 'available' }
const STATUS_MISSING = { status: 'missing' }

export default class Adapter {
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

        db.createObjectStore(SEQ_STORE, { autoIncrement: true })
        db.createObjectStore(DOC_STORE, { keyPath: 'id' })
        db.createObjectStore(LOCAL_DOC_STORE, { keyPath: 'id' })
        db.createObjectStore(REV_STORE, { keyPath: ['id', 'rev'] })
        db.createObjectStore(ATT_STORE, { keyPath: ['id', 'name', 'digest'] })
        db.createObjectStore(META_STORE, { keyPath: 'id' })
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

            if (!('uuid' in this.metadata)) {
              this.metadata.uuid = makeUuid()
              metaStore.put(this.metadata)
            }
          }
      }
      openReq.onerror = e => reject(e.target.error)
      openReq.onblocked = e => reject(e)
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

  getLocalDoc (id) {
    const _id = `_local/${id}`
    return new Promise((resolve, reject) => {
      this.db.transaction(LOCAL_DOC_STORE, 'readonly').objectStore(LOCAL_DOC_STORE)
        .get(_id)
        .onsuccess = e => {
          const entry = e.target.result
          const doc = entry ? entry.data : { _id }
          resolve(doc)
        }
    })
  }

  saveLocalDoc (doc) {
    doc._rev = doc._rev ? doc._rev + 1 : 1
    return new Promise((resolve, reject) => {
      const entry = {
        id: doc._id,
        data: doc
      }
      this.db.transaction(LOCAL_DOC_STORE, 'readwrite').objectStore(LOCAL_DOC_STORE)
        .put(entry)
        .onsuccess = () => resolve({ rev: doc._rev })
    })
  }

  getEntries (ids) {
    return new Promise((resolve, reject) => {
      const store = this.db.transaction(DOC_STORE, 'readonly')
        .objectStore(DOC_STORE)
      
      const entries = {}
      let cnt = ids.length
      for (const id of ids) {
        store.get(id).onsuccess = e => {
          entries[id] = e.target.result
          cnt--
          if (cnt === 0) {
            resolve(entries)
          }
          // TODO: get whole entry
        }
      }
    })
  }

  // TODO: adapt to docrevs format
  async buildEntries (docsWithEntries) {
    const entries = []
    for (const { doc: cDoc, existingEntry } of docsWithEntries) {
      const { _id: id, _rev, _deleted, _attachments, _revisions } = cDoc

      const pos = _revisions.start - _revisions.ids.length + 1
      let ids = [
        _revisions.ids[0],
        STATUS_AVAILABLE,
        []
      ]
      for (let i = 1, len = _revisions.ids.length; i < len; i++) {
        ids = [
          _revisions.ids[i],
          STATUS_MISSING,
          [ids]
        ]
      }
      const newRevTree = [{
        pos,
        ids
      }]

      const existingRevTree = existingEntry ? existingEntry.rev_tree : []
      const { tree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT)
      const winningRev = calculateWinningRev({ rev_tree: tree })
      const winningRevPos = parseInt(winningRev, 10)


      const atts = existingEntry ? existingEntry.atts : []
      if (_attachments) {
        for (const name in _attachments) {
          const attachment = _attachments[name]
          const {
            content_type,
            data
          } = attachment
          const digest = attachment.digest
          attachment.digest = digest
          attachment.revpos = winningRevPos
          atts.push({
            id,
            name,
            digest,
            data
          })
        }
      }

      const data = {}
      for (const key in cDoc) {
        if (key.startsWith('_')) continue
        data[key] = cDoc[key]
      }
      if (cDoc._attachments) {
        data._attachments = {}
        for (const name in cDoc._attachments) {
          const { digest, revpos } = cDoc._attachments[name]
          data._attachments[name] = {
            digest,
            revpos
          }
        }
      }
      
      const rev = {
        id,
        rev: _rev,
        data
      }

      const deleted = !!_deleted // TODO revs[winningRev].deleted
      const doc = {
        id,
        deleted,
        rev: winningRev,
        tree
      }

      const seq = {
        id,
        rev: _rev
        // TODO: _conflicts
      }

      const entry = {
        atts,
        rev,
        doc,
        seq
      }
      
      // TODO // compact revs
      // const revsToCompact = compactTree({ rev_tree: tree })
      // const revsToDelete = revsToCompact.concat(stemmedRevs)
      // for (const rev of revsToDelete) {
      //   delete entry.revs[rev]
      // }
      // // TODO: compact attachments

      entries.push(entry)
    }
    
    return entries
  }

  async saveEntries (entries) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([ATT_STORE, REV_STORE, DOC_STORE, SEQ_STORE], 'readwrite')
      const attStore = transaction.objectStore(ATT_STORE)
      const revStore = transaction.objectStore(REV_STORE)
      const docStore = transaction.objectStore(DOC_STORE)
      const seqStore = transaction.objectStore(SEQ_STORE)

      let docsWritten = 0
      let cnt = entries.length
      for (const { atts, rev, doc, seq } of entries) {
        const saveEntry = () => {
          revStore.put(rev).onsuccess = () => {
            docStore.put(doc).onsuccess = () => {
              seqStore.put(seq).onsuccess = () => {
                docsWritten++
                cnt--
                if (cnt === 0) {
                  resolve(docsWritten)
                }
              }
            }
          }
        }
        let attCnt = atts.length
        if (attCnt > 0) {
          for (const att of atts) {
            attStore.put(att).onsuccess = () => {
              attCnt--
              if (attCnt === 0) {
                saveEntry()
              }
            }
          }
        } else {
          saveEntry()
        }
      }
    })
  }

  async saveDocs (docsWithEntries) {
    const entries = await this.buildEntries(docsWithEntries)
    return this.saveEntries(entries)
  }
}
