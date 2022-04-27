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
export default async function replicate(source, target) {
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

  // track whether we've already retrieved all changes
  let changesComplete = false

  // if start seq and remote seq match, do nothing
  while (!changesComplete && compareSeqs(startSeq, remoteSeq) < 0) {
    // run the pipeline:
    // 1. get changes from source
    await source.getChangesStream(startSeq, { limit: 1024 })
      // 2. get diffs from target
      .then(rs => rs.pipeThrough(target.getDiffsStream({ batchSize: 128 })))
      // 3. get docs from source
      .then(rs => rs.pipeThrough(source.getDocsStream({ batchSize: 512 })))
      // 4. save docs to target
      .then(rs => rs.pipeTo(target.writeDocsStream({ batchSize: 128 })))

    // collect stats
    const { lastSeq, numberOfChanges, docsRead } = source
    const { docsWritten } = target
    stats.lastSeq = lastSeq
    stats.docsRead += docsRead
    stats.docsWritten += docsWritten

    changesComplete = numberOfChanges < 1024

    // when done, store replication logs, only if there was a change
    if (lastSeq !== startSeq) {
      sourceLog.session_id = sessionId
      sourceLog.source_last_seq = lastSeq
      targetLog.session_id = sessionId
      targetLog.source_last_seq = lastSeq
      
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

    startSeq = lastSeq
  }
    
  return stats
}
