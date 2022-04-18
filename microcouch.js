// Microcouch
// 1.0.0

// use PouchDBs merge algorithm
import { winningRev as calculateWinningRev, merge, compactTree } from './pouchdb-merge.js'


// constants
const DOC_STORE = 'docs'
const META_STORE = 'meta'
const REVS_LIMIT = 1000
const REPLICATION_BATCH_SIZE = 512
const STATUS_AVAILABLE = { status: 'available' }
const STATUS_MISSING = { status: 'missing' }


const base64ToBlob = (data, type) => {
  const raw = atob(data)
  const length = raw.length
  const uInt8Array = new Uint8Array(length)
  for (let i = 0; i < length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type })
}

const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dec = `data:${blob.type};base64,`
      const data = reader.result.slice(dec.length)
      resolve(data)
    }
    reader.readAsDataURL(blob)
  })
}

const encodeBase64 = data => btoa(String.fromCharCode(...new Uint8Array(data)))

const makeUuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const encodeHex = data => Array.from(new Uint8Array(data))
  .map(x => ('00' + x.toString(16)).slice(-2))
  .join('')

const calculateSha1 = async text => {
  const enc = new TextEncoder()
  const bits = enc.encode(text)
  const data = await crypto.subtle.digest('SHA-1', bits)
  return encodeHex(data)
}

// couch functions

// TODO: switch to md5, thats what couch uses
const makeRev = doc => {
  const data = {}
  for (const key in doc) {
    if (key !== '_attachments' && key.startsWith('_')) continue
    data[key] = doc[key]
  }
  return calculateSha1(JSON.stringify(data))
}

// TODO: switch to md5, thats what couch uses
const calculateDigest = async blob => {
  const bits = await blob.arrayBuffer()
  const data = await crypto.subtle.digest('SHA-1', bits)
  const sha1 = encodeBase64(data)
  return `sha1-${sha1}`
}

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

const revTreeToRevisions = revTree => {
  const [{ pos, ids }] = revTree

  const revisions = { start: pos - 1, ids: [] }

  let [id, status, childs] = ids
  while (childs) {
    revisions.start += 1
    revisions.ids.unshift(id)
    const child = childs[0] || []
    id = child[0]
    status = child[1]
    childs = child[2]
  }

  return revisions
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
      const blob = typeof data === 'string'
        ? base64ToBlob(data, content_type)
        : data
      const digest = attachment.digest || await calculateDigest(blob)
      attachment.digest = digest
      attachment.revpos = parseInt(rev, 10)
      attachments[digest] = {
        data: blob,
        revs: {
          [rev]: true
        }
      }
    }
  }
  return attachments
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

const entryToDoc = async (entry, rev, { base64 } = {}) => {
  const { id, attachments, revs, rev_tree } = entry
  const { data } = revs[rev]
  const { _attachments } = data
  const revisions = revTreeToRevisions(rev_tree)
  
  if (_attachments) {
    for (const name in _attachments) {
      const attachment = _attachments[name]
      const { digest } = attachment
      const { data } = attachments[digest]
      attachment.content_type = data.type
      if (base64) {
        attachment.data = await blobToBase64(data)
      } else {
        attachment.data = data
      }
      attachment.length = data.size
    }
  }

  return {
    _id: id,
    _rev: rev,
    _revisions: revisions,
    ...data
  }
}

// indexeddb functions

const openDatabase = id => new Promise((resolve, reject) => {
  const openReq = indexedDB.open(id)

  openReq.onupgradeneeded = e => {
    const db = e.target.result

    const keyPath = 'id'
    const docStore = db.createObjectStore(DOC_STORE, { keyPath })
    docStore.createIndex('seq', 'seq', { unique: true })
    db.createObjectStore(META_STORE, { keyPath })
  }

  openReq.onsuccess = e => {
    const db = e.target.result

    db.onabort = () => db.close()
    db.onversionchange = () => db.close()

    let metadata
    const transaction = db.transaction([META_STORE], 'readwrite')

    transaction.oncomplete = () => resolve({ db, metadata })
    const metaStore = transaction.objectStore(META_STORE)

    metaStore.get(META_STORE).onsuccess = e => {
      metadata = e.target.result || { id: META_STORE }

      let changed = false

      if (!('doc_count' in metadata)) {
        changed = true
        metadata.doc_count = 0
      }

      if (!('seq' in metadata)) {
        changed = true
        metadata.seq = 0
      }

      if (!('db_uuid' in metadata)) {
        changed = true
        metadata.db_uuid = makeUuid()
      }

      if (changed) {
        metaStore.put(metadata)
      }
    }
  }
  openReq.onerror = e => reject(e.target.error)
  openReq.onblocked = e => reject(e)
})

const getEntry = (transaction, id) => new Promise((resolve, reject) => {
  transaction.objectStore(DOC_STORE).get(id).onsuccess = e => {
    const doc = e.target.result
    resolve(doc)
  }
})

const getEntries = async (transaction, ids) => {
  const result = await Promise.all(ids.map(id => getEntry(transaction, id)))
  const docs = {}
  for (const doc of result) {
    if (doc) {
      docs[doc.id] = doc
    }
  }
  return docs
}

const saveEntry = (transaction, doc) => new Promise((resolve, reject) => {
  transaction.objectStore(DOC_STORE).put(doc).onsuccess = () => resolve()
})

const saveEntries = (transaction, docs) => Promise.all(docs.map(doc => saveEntry(transaction, doc)))

const saveMetadata = (transaction, metadata) => new Promise((resolve, reject) => {
  transaction.objectStore(META_STORE).put(metadata).onsuccess = () => resolve()
})

// local indexeddb database
class Local {
  constructor ({ name }) {
    this.name = name
    this.db = null
    this.metadata = null
  }

  async init () {
    const { db, metadata } = await openDatabase(this.name)
    this.db = db
    this.metadata = metadata
  }

  getUuid () {
    const { db_uuid } = this.metadata
    return db_uuid
  }

  getUpdateSeq () {
    const { seq } = this.metadata
    return seq
  }

  async getEntry (id) {
    const transaction = this.db.transaction([DOC_STORE], 'readonly')
    return getEntry(transaction, id)
  }

  async getDoc (id) {
    const transaction = this.db.transaction([DOC_STORE], 'readonly')
    const entry = await getEntry(transaction, id)
    if (!entry) {
      throw new Error(`Could not find doc with id '${id}'`)
    }

    const { deleted, rev } = entry
    if (deleted) {
      throw new Error(`Doc with id '${id}' has been deleted`)
    }

    return entryToDoc(entry, rev)
  }

  async saveDoc (doc) {
    const { _id: id } = doc
    const getEntriesTransaction = this.db.transaction([DOC_STORE], 'readonly')
    const existingEntry = await getEntry(getEntriesTransaction, id)
    
    const seq = ++this.metadata.seq
    let delta
    
    const entry = await docToEntry(seq, doc, existingEntry)
    
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
    
    const transaction = this.db.transaction([DOC_STORE, META_STORE], 'readwrite')
    await saveEntry(transaction, entry)
    await saveMetadata(transaction, this.metadata)
  }

  async getReplicationLog (id) {
    const transaction = this.db.transaction([DOC_STORE], 'readonly')
    const log = await getEntry(transaction, `_local/${id}`)
    if (log) {
      return log.data
    }
    return {
      _id: `_local/${id}`
    }
  }

  async saveReplicationLog (log) {
    const transaction = this.db.transaction([DOC_STORE], 'readwrite')
    const doc = {
      id: log._id,
      data: log
    }
    return saveEntry(transaction, doc)
  }

  async getChanges ({ since, limit } = {}) {
    since = since || -1
    limit = limit || -1

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE], 'readonly')
      const store = transaction.objectStore(DOC_STORE).index('seq')
      const req = store.openCursor(IDBKeyRange.lowerBound(since, true))

      const changes = {}
      let lastSeq = -1
      let received = 0

      req.onsuccess = e => {
        if (!e.target.result) {
          return
        }
        const cursor = e.target.result
        const doc = cursor.value
        const { id, rev, seq } = doc
        lastSeq = seq
        changes[id] = changes[id] || []
        changes[id].push(rev)
        // TODO: handle conflicts
        received++
        if (received !== limit) {
          cursor.continue()
        }
      }

      transaction.oncomplete = () => resolve({ changes, lastSeq })
    })
  }

  async getRevsDiff (changes) {
    const ids = Object.keys(changes)
    const transaction = this.db.transaction([DOC_STORE], 'readonly')
    const existingEntries = await getEntries(transaction, ids)
    const revs = []

    for (const id in changes) {
      for (const rev of changes[id]) {
        const existingEntry = existingEntries[id]
        const existingRev = existingEntry && rev in existingEntry.revs
        if (existingRev) continue

        revs.push({ id, rev })
      }
    }
    
    return revs
  }

  async getRevs (revs) {
    const ids = revs.map(({ id }) => id)
    const transaction = this.db.transaction([DOC_STORE], 'readonly')
    const existingEntries = await getEntries(transaction, ids)
    
    const foundRevs = []
    for (const { id, rev } of revs) {
      if (id in existingEntries) {
        const entry = existingEntries[id]
        if (rev in entry.revs) {
          const doc = await entryToDoc(entry, rev, { base64: true })
          foundRevs.push(doc)
        }
      }
    }
    return foundRevs
  }

  async saveRevs (revs) {
    const entries = []

    const ids = revs.map(({ _id }) => _id)
    const getEntriesTransaction = this.db.transaction([DOC_STORE], 'readonly')
    const existingEntries = await getEntries(getEntriesTransaction, ids)

    for (const rev of revs) {
      const seq = ++this.metadata.seq
      let delta
      
      const existingEntry = existingEntries[rev._id]

      const entry = await docToEntry(seq, rev, existingEntry, { newEdits: false })
      entries.push(entry)

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
    }

    const transaction = this.db.transaction([DOC_STORE, META_STORE], 'readwrite')
    await saveEntries(transaction, entries)
    await saveMetadata(transaction, this.metadata)
  }
}


// remote http database
class Remote {
  constructor ({ url, headers }) {
    this.url = url
    this.root = url.pathname
    this.headers = headers
  }

  async getUuid () {
    const url = new URL(this.url)
    url.pathname = '/'
    
    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote server not reachable')
    }
    
    const { uuid } = await response.json()
    return uuid
  }

  async getUpdateSeq () {
    const url = new URL(this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote database not reachable')
    }
    
    const { update_seq } = await response.json()
    return update_seq
  }

  async getDoc (id) {
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url)
    url.searchParams.set('attachments', 'true')

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        Accept: 'application/json'
      }
    })
    if (response.status !== 200) {
      throw new Error(`Could not find doc with id '${id}'`)
    }

    const doc = await response.json()
    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          content_type,
          data: data64
        } = doc._attachments[name]
        doc._attachments[name].data = base64ToBlob(data64, content_type)
      }
    }
    return doc
  }

  async saveDoc (doc) {
    const { _id: id } = doc
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url)

    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          data: blob
        } = doc._attachments[name]
        doc._attachments[name].data = await blobToBase64(blob)
      }
    }

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(doc)
    })
    if (response.status !== 201) {
      throw new Error(`Could not save doc '${id}'`)
    }
    return response.json()
  }

  async getReplicationLog (id) {
    const url = new URL(`${this.root}/_local/${id}`, this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status === 200) {
      return response.json()
    }

    return {
      _id: `_local/${id}`
    }
  }

  async saveReplicationLog (log) {
    const url = new URL(`${this.root}/${log._id}`, this.url)

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(log)
    })
    if (response.status !== 201) {
      throw new Error('Could not save replication log')
    }
  }

  async getChanges ({ since, limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url)
    url.searchParams.set('feed', 'normal')
    url.searchParams.set('style', 'all_docs')
    if (limit) {
      url.searchParams.set('limit', limit)
      url.searchParams.set('seq_interval', limit)
    }
    if (since) {
      url.searchParams.set('since', since)
    }

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Could not get changes')
    }

    const {
      results,
      last_seq: lastSeq
    } = await response.json()
    
    const revs = {}
    for (const { id, changes } of results) {
      revs[id] = changes.map(({ rev }) => rev)
    }

    return {
      changes: revs, 
      lastSeq
    }
  }

  async getRevsDiff (changes) {
    const url = new URL(`${this.root}/_revs_diff`, this.url)
    
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(changes)
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs diff')
    }
    
    const diff = await response.json()

    const revs = []
    for (const id in diff) {
      const { missing } = diff[id]
      for (const rev of missing) {
        revs.push({ id, rev })
      }
    }
    return revs
  }

  async getRevs (revs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')
    
    const payload = { docs: revs }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs')
    }
    
    const { results } = await response.json()

    const foundRevs = []
    for (const { docs } of results) {
      for (const { ok } of docs) {
        foundRevs.push(ok)
      }
    }
    return foundRevs
  }

  async saveRevs (revs) {
    const url = new URL(`${this.root}/_bulk_docs`, this.url)
    
    const payload = { docs: revs, new_edits: false }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    if (response.status !== 201) {
      throw new Error('Could not save revs')
    }
  }
}


// replication

const generateReplicationId = async (localId, remoteId) => {
  const text = localId + remoteId
  return await calculateSha1(text)
}

const findCommonAncestor = (localLog, remoteLog) => {
  return localLog.session_id && localLog.session_id === remoteLog.session_id &&
    localLog.source_last_seq && localLog.source_last_seq === remoteLog.source_last_seq
    ? localLog.source_last_seq
    : null
}

const replicate = async (source, target) => {
  const replicationType = `replication ${source.constructor.name}→${target.constructor.name}`
  console.time(replicationType)
  
  const sessionId = makeUuid()

  const [
    localUuid,
    remoteUuid,
    remoteSeq
  ] = await Promise.all([
    target.getUuid(),
    source.getUuid(),
    source.getUpdateSeq()
  ])

  const replicationId = await generateReplicationId(localUuid, remoteUuid)

  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.getReplicationLog(replicationId),
    source.getReplicationLog(replicationId)
  ])

  const since = findCommonAncestor(targetLog, sourceLog)
  
  const sinceNumber = parseInt(since, 10) || 0
  const remoteSeqNumber = parseInt(remoteSeq, 10)

  let lastSeq
  let addedRevs = 0
  let changes = null
  if (sinceNumber < remoteSeqNumber) {
    let lastSeqNumber = 0
    // TODO: make this nicer
    // we can't rely on the pure remoteSeqNumber comparison as sometimes the
    // changes feed returns an older seq than the db info last seq for some
    // reason
    while (lastSeqNumber < remoteSeqNumber && (changes === null || changes > 0)) {
      const result = await replicateBatch(source, target, lastSeq || since)
      lastSeq = result.lastSeq
      changes = result.changes
      addedRevs += result.addedRevs
      lastSeqNumber = parseInt(lastSeq, 10)
    }

    sourceLog.session_id = sessionId
    sourceLog.source_last_seq = lastSeq
    targetLog.session_id = sessionId
    targetLog.source_last_seq = lastSeq
    
    await Promise.all([
      target.saveReplicationLog(targetLog),
      source.saveReplicationLog(sourceLog)
    ])
  }

  console.timeEnd(replicationType)
  return {
    lastSeq,
    addedRevs
  }
}

const replicateBatch = async (source, target, since) => {
  // get changes
  const { changes, lastSeq } = await source.getChanges({ since, limit: REPLICATION_BATCH_SIZE })
  
  // revs diff
  const missingRevs = await target.getRevsDiff(changes)

  let newRevs = []
  if (missingRevs.length) {
    // get docs
    newRevs = await source.getRevs(missingRevs)

    // insert docs
    await target.saveRevs(newRevs)
  }

  return {
    lastSeq,
    addedRevs: newRevs.length,
    changes: changes.length
  }
}

export default class Microcouch extends EventTarget {
  constructor ({ name, url, headers }) {
    super()

    this.local = new Local({ name })
    this.remote = new Remote({ url, headers })

    this.changeEvent = new Event('change')
  }

  init () {
    return this.local.init()
  }

  getChanges ({ since, limit } = {}) {
    return this.local.getChanges({ since, limit })
  }

  getDoc (id) {
    return this.local.getDoc(id)
  }

  async saveDoc (doc) {
    const response = await this.local.saveDoc(doc)
    this.push()
    this.dispatchEvent(this.changeEvent)
    return response
  }

  // TODO: implement getDocs
  // getDocs ({ startkey, endkey, descending, limit }) {
  //   return this.local.getDocs(ids)
  // }

  // TODO: implement saveDocs
  // async saveDocs (docs) {
  //   const response = await this.local.saveDocs(docs)
  //   this.push()
  //   this.dispatchEvent(this.changeEvent)
  //   return response
  // }

  async pull () {
    const { addedRevs } = await replicate(this.remote, this.local)
    if (addedRevs > 0) {
      this.dispatchEvent(this.changeEvent)
    }
  }

  push () {
    return replicate(this.local, this.remote)
  }
  
  sync () {
    return Promise.all([
      this.pull(),
      this.push()
    ])
  }
}
