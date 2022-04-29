import SparkMD5 from 'spark-md5'

import { makeUuid } from './utils.js'

// generate replication log id from local and remote uuids
const generateReplicationLogId = async (localId, remoteId) => {
  return SparkMD5.hash(`${localId}${remoteId}`)
}

// compare replication logs and find common ancestor
// TODO: record and traverse history
const findCommonAncestor = (localLog, remoteLog) => {
  return localLog.session_id && localLog.session_id === remoteLog.session_id &&
    localLog.source_last_seq && localLog.source_last_seq === remoteLog.source_last_seq
    ? localLog.source_last_seq
    : null
}

// compare two update sequences by comparing their numbers
const compareSeqs = (a, b) => {
  if (!a) return -1
  if (!b) return 1
  if (a === b) return 0
  const aInt = parseInt(a, 10)
  const bInt = parseInt(b, 10)
  return aInt - bInt
}

// Replicate source to target
export default async function replicate(source, target, {
  batchSize = {
    getChanges: 1024,
    getDiff: 128,
    getDocs: 512,
    saveDocs: 128
  } 
} = {}) {
  const sessionId = makeUuid()

  const stats = {
    docsRead: 0,
    docsWritten: 0
  }
  
  // get source and target database uuids
  // and current source update seq
  const [
    localUuid,
    remoteUuid,
    remoteSeq
  ] = await Promise.all([
    target.getUuid(),
    source.getUuid(),
    source.getUpdateSeq()
  ])

  // construct an id to store replication logs at
  const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid)

  // get replication logs from source and target
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.getReplicationLog(replicationLogId),
    source.getReplicationLog(replicationLogId)
  ])

  // find common ancestor from logs
  let startSeq = findCommonAncestor(targetLog, sourceLog)

  // if start seq and remote seq match, do nothing
  if (compareSeqs(startSeq, remoteSeq) === 0) {
    return stats
  }

  let changesComplete = false
  while (!changesComplete) {
    const getcChanges = await source.getChanges(startSeq, { limit: batchSize.getChanges })
    const getDiff = target.getDiff({ batchSize: batchSize.getDiff })
    const getDocs = source.getDocs({ batchSize: batchSize.getDocs })
    const saveDocs = target.saveDocs({ batchSize: batchSize.saveDocs })

    // const logger = new WritableStream({
    //   write (data) {
    //     console.log(data)
    //   },
    //   close () {
    //     console.log('closed.')
    //   }
    // })

    // run the pipeline:
    // 1. get changes from source
    // 2. get diffs from target
    // 3. get docs from source
    // 4. save docs to target
    await getcChanges
      .pipeThrough(getDiff)
      .pipeThrough(getDocs)
      .pipeTo(saveDocs)

    // store replication logs only if there was a change
    if (getcChanges.lastSeq !== startSeq) {
      sourceLog.session_id = sessionId
      sourceLog.source_last_seq = getcChanges.lastSeq
      targetLog.session_id = sessionId
      targetLog.source_last_seq = getcChanges.lastSeq
      
      const [
        { rev: targetLogRev },
        { rev: sourceLogRev }
      ] = await Promise.all([
        target.saveReplicationLog(targetLog),
        source.saveReplicationLog(sourceLog)
      ])
      targetLog._rev = targetLogRev
      sourceLog._rev = sourceLogRev
    }
    
    // collect stats
    stats.lastSeq = getcChanges.lastSeq
    stats.docsRead += getDocs.docsRead
    stats.docsWritten += saveDocs.docsWritten

    // set next batch start seq
    startSeq = getcChanges.lastSeq

    // exit condition:
    // * either retrieved less changes than limit
    // * or reached the remote seq
    changesComplete = getcChanges.numberOfChanges < batchSize.getChanges || compareSeqs(getcChanges.lastSeq, remoteSeq) >= 0
  }
    
  return stats
}
