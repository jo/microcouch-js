import SparkMD5 from 'spark-md5'

import { makeUuid, BatchingTransformStream } from './utils.js'

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
    getChanges: 512*8,
    getDiff: 512,
    getDocs: 1024,
    saveDocs: 512
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
    target.replicator.getUuid(),
    source.replicator.getUuid(),
    source.replicator.getUpdateSeq()
  ])

  // construct an id to store replication logs at
  const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid)

  // get replication logs from source and target
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.replicator.getReplicationLog(replicationLogId),
    source.replicator.getReplicationLog(replicationLogId)
  ])

  // find common ancestor from logs
  let startSeq = findCommonAncestor(targetLog, sourceLog)

  // if start seq and remote seq match, do nothing
  if (compareSeqs(startSeq, remoteSeq) === 0) {
    return stats
  }

  let changesComplete = false
  while (!changesComplete) {
    const batchStats = {}

    const getChanges = await source.replicator.getChanges(startSeq, { limit: batchSize.getChanges }, batchStats)
    const filterMissingRevs = target.replicator.filterMissingRevs()
    const getDocs = source.replicator.getDocs(batchStats)
    const saveDocs = target.replicator.saveDocs(batchStats)

    const logger = new WritableStream({
      write (data) {
        console.log(data)
      },
      close () {
        console.log('complete.')
      }
    })

    // run the pipeline:
    // 1. get changes from source
    // 2. get diffs from target
    // 3. get docs from source
    // 4. save docs to target
    await getChanges
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getDiff }))
      .pipeThrough(filterMissingRevs)
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getDocs }))
      .pipeThrough(getDocs)
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.saveDocs }))
      .pipeTo(saveDocs)
      // .pipeTo(logger)

    // collect stats
    stats.lastSeq = batchStats.lastSeq
    stats.docsRead += batchStats.docsRead
    stats.docsWritten += batchStats.docsWritten

    // changesComplete = true
    // continue

    // store replication logs only if there was a change
    if (batchStats.lastSeq !== startSeq) {
      sourceLog.session_id = sessionId
      sourceLog.source_last_seq = batchStats.lastSeq
      targetLog.session_id = sessionId
      targetLog.source_last_seq = batchStats.lastSeq
      
      const [
        { rev: targetLogRev },
        { rev: sourceLogRev }
      ] = await Promise.all([
        target.replicator.saveReplicationLog(targetLog),
        source.replicator.saveReplicationLog(sourceLog)
      ])
      targetLog._rev = targetLogRev
      sourceLog._rev = sourceLogRev
    }
    
    // set next batch start seq
    startSeq = batchStats.lastSeq

    // exit condition:
    // * either retrieved less changes than limit
    // * or reached the remote seq
    changesComplete = batchStats.numberOfChanges < batchSize.getChanges || compareSeqs(batchStats.lastSeq, remoteSeq) >= 0
  }
    
  return stats
}
