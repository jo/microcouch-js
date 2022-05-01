import SparkMD5 from 'spark-md5'
import { winningRev as calculateWinningRev, merge, compactTree } from 'pouchdb-merge'

import { makeUuid, calculateMd5 } from '../utils.js'

const DOC_STORE = 'docs'
const META_STORE = 'meta'

const REVS_LIMIT = 1000
const STATUS_AVAILABLE = { status: 'available' }
const STATUS_MISSING = { status: 'missing' }

const parseRev = rev => {
  const [prefix, id] = rev.split('-')
  return [
    parseInt(prefix, 10),
    id
  ]
}

const revisionsToRevTree = revisions => {
  const pos = revisions.start - revisions.ids.length + 1

  const revisionIds = revisions.ids
  let ids = [
    revisionIds[0],
    STATUS_AVAILABLE,
    []
  ]

  for (let i = 1, len = revisionIds.length; i < len; i++) {
    ids = [
      revisionIds[i],
      STATUS_MISSING,
      [ids]
    ]
  }

  return [{
    pos,
    ids
  }]
}

const calculateDigest = async blob => {
  const hash = await calculateMd5(blob)
  const md5 = btoa(hash)
  return `md5-${md5}`
}

const makeRev = doc => {
  const data = {}
  for (const key in doc) {
    if (key === '_revisions') continue
    data[key] = doc[key]
  }
  const string = JSON.stringify(data)
  return SparkMD5.hash(string)
}


const updateAttachmentsEntry = async (newAttachments, attachments, rev) => {
  if (!newAttachments) return attachments

  for (const name in newAttachments) {
    const attachment = newAttachments[name]
    const { stub } = attachment

    if (stub) {
      // existing attachment
      const { digest: stubDigest } = attachment
      attachments[stubDigest].revs[rev] = true
    } else {
      // new attachment
      const {
        content_type,
        data
      } = attachment
      if (typeof data === 'string') {
        throw new Error('Base64 attachments are not supported')
      }
      const digest = attachment.digest || await calculateDigest(data)
      // validate incoming attachment digest
      // is kinda costy, so disabled by now
      // const digest = await calculateDigest(data)
      // if ('digest' in attachment && attachment.digest !== digest) {
      //   throw new Error(`Attachment digest for ${name} does not match`)
      // }
      attachment.digest = digest
      attachment.revpos = parseInt(rev, 10)
      attachments[digest] = {
        data,
        revs: {
          [rev]: true
        }
      }
    }
  }
  return attachments
}

const docToData = doc => {
  const data = {}
  for (const key in doc) {
    if (key.startsWith('_')) continue
    data[key] = doc[key]
  }
  if (doc._attachments) {
    data._attachments = {}
    for (const name in doc._attachments) {
      const {
        digest,
        revpos
      } = doc._attachments[name]
      data._attachments[name] = {
        digest,
        revpos
      }
    }
  }
  return data
}

const docToEntry = async (seq, doc, existingEntry, { newEdits } = { newEdits: true }) => {
  let newRevTree
  if (newEdits) {
    const newRevId = await makeRev(doc)
    let newRevNum
    if (doc._rev) {
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
    
    doc._rev = `${newRevNum}-${newRevId}`
  } else {
    newRevTree = revisionsToRevTree(doc._revisions)
  }

  const { _id, _rev, _deleted, _attachments } = doc
  
  const existingAttachments = existingEntry ? existingEntry.attachments : {}
  const attachments = await updateAttachmentsEntry(_attachments, existingAttachments, _rev)
  const data = docToData(doc)
  
  const existingRevTree = existingEntry ? existingEntry.rev_tree : []
  const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT)
  const winningRev = calculateWinningRev({ rev_tree: revTree })

  const existingRevs = existingEntry ? existingEntry.revs : null
  const revs = {
    ...existingRevs,
    [_rev]: {
      data,
      deleted: !!_deleted
    }
  }
  const deleted = revs[winningRev].deleted
  
  // compact revs
  const revsToCompact = compactTree({ rev_tree: revTree })
  const revsToDelete = revsToCompact.concat(stemmedRevs)
  for (const rev of revsToDelete) {
    delete revs[rev]
  }
  // TODO: compact attachments

  return {
    attachments,
    deleted,
    id: _id,
    rev: winningRev,
    rev_tree: revTree,
    revs,
    seq
  }
}

export default class Database {
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

  getDocStore (mode) {
    return this.db.transaction(DOC_STORE, mode)
      .objectStore(DOC_STORE)
  }

  async buildEntries (docsWithEntries) {
    const entries = []
    for (const { doc, existingEntry } of docsWithEntries) {
      const seq = ++this.metadata.seq
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

  async saveDocs (docsWithEntries) {
    const entries = await this.buildEntries(docsWithEntries)
    return this.saveEntries(entries)
  }
}
