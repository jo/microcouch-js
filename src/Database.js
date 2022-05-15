import { md5FromString, makeUuid } from './utils.js'

// generate replication log id from source and target uuids
const generateReplicationLogId = async (targetId, sourceId) => {
  return md5FromString(`${targetId}${sourceId}`)
}

// compare replication logs and find common ancestor
// TODO: record and traverse history
const findCommonAncestor = (targetLog, sourceLog) => {
  return targetLog.sessionId && targetLog.sessionId === sourceLog.sessionId &&
    targetLog.sourceLastSeq && targetLog.sourceLastSeq === sourceLog.sourceLastSeq
    ? targetLog.sourceLastSeq
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
        console.debug(scope, data.length, data)
        controller.enqueue(data)
      }
    }, { highWaterMark: 1024*4 }, { highWaterMark: 1024*4 })
  }
}

// Replicate source to target
const replicate = async (source, target, {
  batchSize = {
    source: 1024,
    target: 256
  } 
} = {}) => {
  const sessionId = makeUuid()

  const stats = {
    docsRead: 0,
    docsWritten: 0
  }
  
  // get source and target database uuids
  // and current source update seq
  const [
    { uuid: targetUuid },
    { uuid: sourceUuid, updateSeq: sourceSeq }
  ] = await Promise.all([
    target.replicator.getInfo(),
    source.replicator.getInfo(),
  ])

  // construct an id to store replication logs at
  const replicationLogId = await generateReplicationLogId(targetUuid, sourceUuid)

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

  // if start seq and source seq match, do nothing
  if (compareSeqs(startSeq, sourceSeq) === 0) {
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
    await source.replicator.getChanges(startSeq, { limit: batchSize.source }, batchStats)
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target }))
      // .pipeThrough(new Logger('got changes now getDiff'))
      .pipeThrough(target.replicator.getDiff())
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.source }))
      .pipeThrough(new Logger('got diffs now getRevs'))
      .pipeThrough(source.replicator.getRevs(batchStats))
      .pipeThrough(new BatchingTransformStream({ batchSize: batchSize.target }))
      // .pipeThrough(new Logger('got revs now saveRevs'))
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
    // * or reached the source seq
    changesComplete = batchStats.numberOfChanges < batchSize.source || compareSeqs(batchStats.lastSeq, sourceSeq) >= 0
  }
    
  return stats
}

export default class Database extends EventTarget {
  constructor () {
    super()
    this.replicator = null
  }

  async init () {
    throw new Error(`init is not implemented for ${this.constructor.name}`)
  }

  async destroy () {
    throw new Error(`destroy is not implemented for ${this.constructor.name}`)
  }


  async getChanges () {
    throw new Error(`getChanges is not implemented for ${this.constructor.name}`)
  }


  async getDoc (id) {
    throw new Error(`getDoc is not implemented for ${this.constructor.name}`)
  }

  async saveDoc (doc) {
    throw new Error(`saveDoc is not implemented for ${this.constructor.name}`)
  }

  async deleteDoc (doc) {
    throw new Error(`deleteDoc is not implemented for ${this.constructor.name}`)
  }

  async getDocs (range) {
    throw new Error(`getDocs is not implemented for ${this.constructor.name}`)
  }


  async pull (other, options) {
    const result = await replicate(other, this, options)
    if (result.docsWritten > 0) {
      this.dispatchEvent(new Event('change'))
    }
    return result
  }

  push (other, options) {
    return replicate(this, other, options)
  }

  sync (other) {
    return Promise.all([
      this.pull(other),
      this.push(other)
    ])
  }
}
