import { makeUuid, calculateSha1 } from './utils.js'

// batch size configuration
const INITIAL_CHANGES_LIMIT = 128
const CHANGES_LIMIT = 1024
const DATA_BATCH_SIZE = 1024

// generate replication log id from local and remote uuids
const generateReplicationLogId = async (localId, remoteId) => {
  const text = localId + remoteId
  return await calculateSha1(text)
}

// compare replication logs and find common ancestor
// TODO: traverse history
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
export default class Replication {
  constructor (source, target) {
    this.source = source
    this.target = target

    this.sessionId = makeUuid()

    this.changes = []
    this.docsWritten = 0

    this.targetLog = null
    this.sourceLog = null
    this.remoteSeq = null
    this.startSeq = null
    this.lastSeq = null
  }

  get name () {
    return `Replication#${this.sessionId}(${this.source.constructor.name}→${this.target.constructor.name})`
  }

  async replicate () {
    console.time(this.name)
    
    // get infos and checkpoints
    await this.getInfos()

    if (compareSeqs(this.startSeq, this.remoteSeq) < 0) {
      // get first small batch of diffs
      const done = await this.getChangesBatch(INITIAL_CHANGES_LIMIT)
      if (done) {
        // in case we're already done
        await this.processChanges()
      } else {
        // otherwise process the rest in parallel
        await Promise.all([
          this.getChanges(),
          this.processChanges()
        ])
      }
      
      // store checkpoints
      await this.storeCheckpoints()
    }
    
    console.timeEnd(this.name)
  }

  async getInfos () {
    // get source and target database uuids
    // and current source update seq
    const [
      localUuid,
      remoteUuid,
      remoteSeq
    ] = await Promise.all([
      this.target.getUuid(),
      this.source.getUuid(),
      this.source.getUpdateSeq()
    ])
    this.remoteSeq = remoteSeq

    // construct an id to store replication logs at
    const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid)

    // get replication logs from source and target
    const [
      targetLog,
      sourceLog
    ] = await Promise.all([
      this.target.getReplicationLog(replicationLogId),
      this.source.getReplicationLog(replicationLogId)
    ])

    this.targetLog = targetLog
    this.sourceLog = sourceLog

    // find common ancestor from logs
    this.startSeq = findCommonAncestor(targetLog, sourceLog)
  }

  // when done, store replication logs, only if there was a change
  async storeCheckpoints () {
    if (this.lastSeq !== this.startSeq) {
      this.sourceLog.session_id = this.sessionId
      this.sourceLog.source_last_seq = this.lastSeq
      this.targetLog.session_id = this.sessionId
      this.targetLog.source_last_seq = this.lastSeq
      
      await Promise.all([
        this.target.saveReplicationLog(this.targetLog),
        this.source.saveReplicationLog(this.sourceLog)
      ])
    }
  }

  // get all changes batch after batch until done
  async getChanges () {
    let done
    do {
      done = await this.getChangesBatch()
    } while (!done)
  }

  // get a single changes batch
  // and return a boolean indicating whether there are more changes to fetch
  async getChangesBatch (limit = CHANGES_LIMIT) {
    const { changes, lastSeq } = await this.source.getChanges({
      since: this.lastSeq || this.startSeq,
      limit
    })
    this.lastSeq = lastSeq
    this.changes.push(...changes)

    // its done either if we're at or above the remote seq we checked at the start of the replication
    // of if we retrieved less changes than the batch size
    return compareSeqs(lastSeq, this.remoteSeq) >= 0 || changes.length < limit
  }

  // process changes in batches until done
  async processChanges () {
    let done
    do {
      done = await this.processChangesBatch()
    } while (!done)
  }

  // process a single batch of changes
  // and return a boolean indicating whether there are more changes to process
  async processChangesBatch (batchSize = DATA_BATCH_SIZE) {
    const batchOfChanges = this.changes.splice(0, batchSize)

    // diff changes against local
    const revs = {}
    for (const { id, changes } of batchOfChanges) {
      revs[id] = changes.map(({ rev }) => rev)
    }
    const diffs = await this.target.getRevsDiff(revs)

    // if there are missing changes, process them
    if (diffs.length > 0) {
      // by getting the revs via multipart
      await this.source.getRevsMultipart(diffs, async doc => {
        // and save each doc
        await this.target.saveRev(doc)
        this.docsWritten++
      })
    }

    return this.changes.length === 0
  }
}
