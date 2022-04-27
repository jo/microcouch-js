import SparkMD5 from 'spark-md5'
import { winningRev as calculateWinningRev, merge, compactTree } from 'pouchdb-merge'

import { calculateMd5 } from '../utils.js'

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

export const calculateDigest = async blob => {
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

export const docToEntry = async (seq, doc, existingEntry, { newEdits } = { newEdits: true }) => {
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
