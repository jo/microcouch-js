import { makeUuid, calculateSha1 } from './utils.js'

const CHANGES_LIMIT = 10000
const DATA_BATCH_SIZE = 256

const generateReplicationLogId = async (localId, remoteId) => {
  const text = localId + remoteId
  return await calculateSha1(text)
}

const findCommonAncestor = (localLog, remoteLog) => {
  return localLog.session_id && localLog.session_id === remoteLog.session_id &&
    localLog.source_last_seq && localLog.source_last_seq === remoteLog.source_last_seq
    ? localLog.source_last_seq
    : null
}

export default class Replication {
  constructor (source, target) {
    this.source = source
    this.target = target

    this.id = makeUuid()
    this.diffs = []
    this.written = 0
  }

  get name () {
    return `replication ${this.id} ${this.source.constructor.name}→${this.target.constructor.name}`
  }

  async replicate () {
    await this.prepare()
    let changesDone
    do {
      changesDone = await this.getDiffs()
      this.getData()
    } while (!changesDone)
    // TODO: use a proper queue
    await this.getData()
    await this.finish()
  }

  async prepare () {
    console.time(this.name)
    
    const [
      localUuid,
      remoteUuid,
      remoteSeq
    ] = await Promise.all([
      this.target.getUuid(),
      this.source.getUuid(),
      this.source.getUpdateSeq()
    ])

    const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid)

    const [
      targetLog,
      sourceLog
    ] = await Promise.all([
      this.target.getReplicationLog(replicationLogId),
      this.source.getReplicationLog(replicationLogId)
    ])

    this.targetLog = targetLog
    this.sourceLog = sourceLog

    this.startSeq = findCommonAncestor(targetLog, sourceLog)
    this.endSeq = this.startSeq
  }

  async finish () {
    if (this.endSeq !== this.startSeq) {
      this.sourceLog.session_id = this.id
      this.sourceLog.source_last_seq = this.endSeq
      this.targetLog.session_id = this.id
      this.targetLog.source_last_seq = this.endSeq
      
      await Promise.all([
        this.target.saveReplicationLog(this.targetLog),
        this.source.saveReplicationLog(this.sourceLog)
      ])
    }
    console.timeEnd(this.name)
  }

  async getDiffs () {
    const { changes, lastSeq } = await this.source.getChanges({
      since: this.lastChangesSeq || this.startSeq,
      limit: CHANGES_LIMIT
    })
    this.lastChangesSeq = lastSeq
    const done = Object.keys(changes).length < CHANGES_LIMIT
    const diffs = await this.target.getRevsDiff(changes)
    this.diffs = this.diffs.concat(diffs)
    return Object.keys(changes).length < CHANGES_LIMIT
  }

  async getData () {
    let diffs
    do {
      diffs = this.diffs.splice(0, DATA_BATCH_SIZE)
      if (diffs.length > 0) {
        await this.source.getRevsMultipart(diffs, async doc => {
          this.written++
          await this.target.saveRev(doc)
        })
      }
    } while (diffs.length > 0)
  }
}
