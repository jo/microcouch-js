import { winningRev as calculateWinningRev, merge, compactTree } from 'pouchdb-merge'
import SparkMD5 from 'spark-md5'

import { calculateMd5, makeUuid } from '../../utils.js'

const DOC_STORE = 'docs'
const META_STORE = 'meta'

const REVS_LIMIT = 1000
const STATUS_AVAILABLE = { status: 'available' }
const STATUS_MISSING = { status: 'missing' }

const makeRev = data => SparkMD5.hash(JSON.stringify(data))

const parseRev = rev => {
  const [prefix, id] = rev.split('-')
  return [
    parseInt(prefix, 10),
    id
  ]
}

const calculateDigest = async blob => {
  const md5 = await calculateMd5(blob)
  return `md5-${md5}`
}

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
      this.db.transaction(DOC_STORE, 'readonly').objectStore(DOC_STORE)
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
      this.db.transaction(DOC_STORE, 'readwrite').objectStore(DOC_STORE)
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
        }
      }
    })
  }

  async getRevs (docs) {
    const ids = docs.map(({ id }) => id)
    const entries = await this.getEntries(ids)

    for (const { id, revs } of docs) {
      const entry = entries[id]
      if (!entry) {
        // TODO: throw
        continue
      }
      rev.entry = entry

      for (const rev of revs) {
        const e = entry.revs[rev.rev]
        if (!e) {
          // TODO: throw
          continue
        }

        // build _revisions
        const { rev_tree: [{ pos, ids }] } = entry
        const _revisions = { start: pos - 1, ids: [] }
        let [revId, status, childs] = ids
        while (childs) {
          _revisions.start += 1
          _revisions.ids.unshift(revId)
          const child = childs[0] || []
          revId = child[0]
          status = child[1]
          childs = child[2]
        }

        // TODO: attachments
        
        const { data, deleted } = e
        rev.doc = {
          ...data,
          _id: id,
          _rev: rev.rev,
          _deleted: deleted,
          _revisions
        }
      }
    }
    return docs
  }

  async buildEntriesWithNewEdits (docsWithEntries) {
    const entries = []

    for (const { id, revs, entry: existingEntry } of docsWithEntries) {
      const seq = ++this.metadata.seq
      const entry = {
        id,
        seq
      }

      for (const { doc } of revs ) {
        const { _id, _rev, _deleted, _attachments, _revisions } = doc

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
        const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT)
        const winningRev = calculateWinningRev({ rev_tree: revTree })
        const winningRevPos = parseInt(winningRev, 10)

        const attachments = existingEntry ? existingEntry.attachments : {}
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
            attachments[digest] = {
              data,
              revs: {
                [winningRev]: true
              }
            }
          }
        }

        const data = {}
        for (const key in doc) {
          if (key.startsWith('_')) continue
          data[key] = doc[key]
        }
        if (doc._attachments) {
          data._attachments = {}
          for (const name in doc._attachments) {
            const { digest, revpos } = doc._attachments[name]
            data._attachments[name] = {
              digest,
              revpos
            }
          }
        }

        const existingRevs = existingEntry ? existingEntry.revs : null
        const revs = {
          ...existingRevs,
          [_rev]: {
            data,
            deleted: !!_deleted
          }
        }

        // compact revs
        const revsToCompact = compactTree({ rev_tree: revTree })
        const revsToDelete = revsToCompact.concat(stemmedRevs)
        for (const rev of revsToDelete) {
          delete revs[rev]
        }
        // TODO: compact attachments

        const deleted = revs[winningRev].deleted
        entry.attachments = attachments
        entry.deleted = deleted
        entry.rev = winningRev
        entry.rev_tree = revTree
        entry.revs = revs
      }

      let delta
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = entry.deleted ? 0 : 1
        } else {
          delta = entry.deleted ? -1 : 0
        }
      } else {
        delta = entry.deleted ? 0 : 1
      }
      this.metadata.doc_count += delta

      entries.push(entry)
    }
    
    return entries
  }

  async buildEntries (docsWithEntries) {
    const entries = []
    for (const { doc, existingEntry } of docsWithEntries) {
      const seq = ++this.metadata.seq

      const { _id, _rev, _deleted, _attachments } = doc

      // plain data to store
      const data = {}
      for (const key in doc) {
        if (key.startsWith('_')) continue
        data[key] = doc[key]
      }
      if (doc._attachments) {
        data._attachments = {}
        for (const name in doc._attachments) {
          const { digest, revpos } = doc._attachments[name]
          data._attachments[name] = {
            digest,
            revpos
          }
        }
      }
      
      const newRevId = await makeRev({ ...data, _id, _rev, _deleted })
      
      let newRevTree
      let newRevNum
      
      if (_rev) {
        const [currentRevPos, currentRevId] = parseRev(doc._rev)
        newRevNum = currentRevPos + 1
        newRevTree = [{
          pos: currentRevPos,
          ids: [
            currentRevId,
            STATUS_MISSING,
            [
              [
                newRevId,
                STATUS_AVAILABLE,
                []
              ]
            ]
          ]
        }]
      } else {
        newRevNum = 1
        newRevTree = [{
          pos: 1,
          ids : [
            newRevId,
            STATUS_AVAILABLE,
            []
          ]
        }]
      }

      const existingRevTree = existingEntry ? existingEntry.rev_tree : []
      const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT)
      const winningRev = calculateWinningRev({ rev_tree: revTree })
      const winningRevPos = parseInt(winningRev, 10)

      const attachments = existingEntry ? existingEntry.attachments : {}
      if (_attachments) {
        for (const name in _attachments) {
          const attachment = _attachments[name]
          const {
            content_type,
            data,
            stub
          } = attachment
          if (stub) {
            // TODO: donno
            attachments[digest].revs[winningRev] = true
            continue
          }
          const digest = await calculateDigest(data)
          attachment.digest = digest
          attachment.revpos = winningRevPos
          attachments[digest] = {
            data,
            revs: {
              [winningRev]: true
            }
          }
        }
      }
      doc._rev = `${newRevNum}-${newRevId}`

      const existingRevs = existingEntry ? existingEntry.revs : null
      const revs = {
        ...existingRevs,
        [doc._rev]: {
          data,
          deleted: !!_deleted
        }
      }
      const deleted = revs[winningRev].deleted
      const entry = {
        attachments,
        deleted,
        id: _id,
        rev: winningRev,
        rev_tree: revTree,
        revs,
        seq
      }
      
      // compact revs
      const revsToCompact = compactTree({ rev_tree: revTree })
      const revsToDelete = revsToCompact.concat(stemmedRevs)
      for (const rev of revsToDelete) {
        delete entry.revs[rev]
      }
      // TODO: compact attachments

      let delta
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = deleted ? 0 : 1
        } else {
          delta = deleted ? -1 : 0
        }
      } else {
        delta = deleted ? 0 : 1
      }
      this.metadata.doc_count += delta
      entries.push(entry)
    }
    
    return entries
  }


  async saveEntries (entries) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE, META_STORE], 'readwrite')
      const docStore = transaction.objectStore(DOC_STORE)
      const metaStore = transaction.objectStore(META_STORE)

      let docsWritten = 0
      let cnt = entries.length
      for (const entry of entries) {
        docStore.put(entry).onsuccess = () => {
          docsWritten++
          cnt--
          if (cnt === 0) {
            metaStore.put(this.metadata).onsuccess = () => resolve(docsWritten)
          }
        }
      }
    })
  }

  async saveRevsWithEntries (docsWithEntries) {
    const entries = await this.buildEntriesWithNewEdits(docsWithEntries)
    return this.saveEntries(entries)
  }

  async saveDocs (docs) {
    const ids = docs.map(({ _id }) => _id)
    const entries = await this.getEntries(ids)
    const docsWithEntries = docs.map(doc => ({ doc, entry: entries[doc._id] }))
    const newEntries = await this.buildEntries(docsWithEntries)
    await this.saveEntries(newEntries)
    return newEntries.map(({ id, rev }) => ({ ok: true, id, rev }))
  }

  async getChanges ({ since, limit } = {}) {
    since = since || -1
    limit = limit || -1

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, 'readonly')
      const store = transaction.objectStore(DOC_STORE).index('seq')
      const req = store.openCursor(IDBKeyRange.lowerBound(since, true))

      const changes = []
      let lastSeq = -1
      let received = 0

      req.onsuccess = e => {
        if (!e.target.result) {
          return
        }
        const cursor = e.target.result
        const doc = cursor.value
        const { id, rev, seq, deleted } = doc
        // TODO: handle conflicts
        const change = { seq, id, changes: [{ rev }], deleted }
        changes.push(change)
        lastSeq = seq
        received++
        if (received !== limit) {
          cursor.continue()
        }
      }

      transaction.oncomplete = () => resolve({ changes, lastSeq })
    })
  }
}
