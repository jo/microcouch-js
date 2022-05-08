import SparkMD5 from 'spark-md5'

import { makeUuid } from '../utils.js'

// generate replication log id from local and remote uuids
const generateReplicationLogId = async (localId, remoteId) => {
  return SparkMD5.hash(`${localId}${remoteId}`)
}

// compare replication logs and find common ancestor
// TODO: record and traverse history
const findCommonAncestor = (localLog, remoteLog) => {
  return localLog.sessionId && localLog.sessionId === remoteLog.sessionId &&
    localLog.sourceLastSeq && localLog.sourceLastSeq === remoteLog.sourceLastSeq
    ? localLog.sourceLastSeq
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

class BatchingTransformStream extends TransformStream {
  constructor ({ batchSize }) {
    super({
      transform (entry, controller) {
        this.entries.push(entry)
        if (this.entries.length >= batchSize) {
          const batch = this.entries.splice(0, batchSize)
          controller.enqueue(batch)
        }
      },
      
      flush (controller) {
        if (this.entries.length > 0) controller.enqueue(this.entries)
      },

      entries: []
    }, { highWaterMark: 1024*4 }, { highWaterMark: 1024*4 })
  }
}

class Logger extends TransformStream {
  constructor (scope) {
    super({
      transform (data, controller) {
        console.debug(scope, data)
        controller.enqueue(data)
      }
    }, { highWaterMark: 1024*4 }, { highWaterMark: 1024*4 })
  }
}

// Replicate source to target
export default async function replicate(source, target, {
  batchSize = {
    getChanges: 1024,
    getDiff: 512,
    getRevs: 1024,
    saveRevs: 128
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
    { uuid: localUuid },
    { uuid: remoteUuid, updateSeq: remoteSeq }
  ] = await Promise.all([
    target.replicator.getInfo(),
    source.replicator.getInfo(),
  ])

  // construct an id to store replication logs at
  const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid)

  // get replication logs from source and target
  const [
    targetLog,
    sourceLog
  ] = await Promise.all([
    target.replicator.getLog(replicationLogId),
    source.replicator.getLog(replicationLogId)
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

    // run the pipeline:
    // 1. get changes from source
    // 2. get diffs from target
    // 3. get docs from source
    // 4. save docs to target
    await source.replicator.getChanges(startSeq, { limit: batchSize.getChanges }, batchStats)
      .pipeThrough(new Logger('getChanges'))
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getDiff }))
      .pipeThrough(target.replicator.getDiff())
      .pipeThrough(new Logger('getDiff'))
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.getRevs }))
      .pipeThrough(source.replicator.getRevs(batchStats))
      .pipeThrough(new Logger('getRevs'))
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.saveRevs }))
      .pipeTo(target.replicator.saveRevs(batchStats))

    // collect stats
    stats.lastSeq = batchStats.lastSeq
    stats.docsRead += batchStats.docsRead
    stats.docsWritten += batchStats.docsWritten

    // store replication logs only if there was a change
    if (batchStats.lastSeq !== startSeq) {
      sourceLog.sessionId = sessionId
      sourceLog.sourceLastSeq = batchStats.lastSeq
      targetLog.sessionId = sessionId
      targetLog.sourceLastSeq = batchStats.lastSeq
      
      const [
        { rev: targetLogRev },
        { rev: sourceLogRev }
      ] = await Promise.all([
        target.replicator.saveLog(targetLog),
        source.replicator.saveLog(sourceLog)
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
