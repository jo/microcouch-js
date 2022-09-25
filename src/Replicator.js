export default class Replicator {
  constructor(local, remote, direction, { concurrency, batchSize }) {
    this.local = local
    this.remote = remote
    this.direction = direction
    this.concurrency = concurrency
    this.batchSize = batchSize
    if (direction === "push") {
      this.source = this.local
      this.target = this.remote
    } else {
      this.source = this.remote
      this.target = this.local
    }
    this.info = null
    this.remoteUuid = null
    this.pendingBatches = []
    this.startedBatches = []
    this.numberOfActiveBatches = 0
    this.changesComplete = false
    this.oncomplete = null
    this.changesReader = null
    this.sourceLog = null
    this.targetLog = null
  }

  async replicate() {
    this.remoteUuid = await this.remote.getUuid()
    this.info = await this.local.getLocalDoc("_local/replication")
    this.info[this.remoteUuid] ||= {}
    this.info[this.remoteUuid][this.direction] ||= {}
    this.info[this.remoteUuid][this.direction].startedAt = new Date()
    this.info[this.remoteUuid][this.direction].docsRead = 0
    this.info[this.remoteUuid][this.direction].docsWritten = 0
    const since = this.info[this.remoteUuid][this.direction].lastSeq
    const changesStream = this.source.getChanges(since, { limit: this.batchSize })
    this.changesReader = changesStream.getReader()
    return new Promise(async (resolve, reject) => {
      this.oncomplete = resolve
      this.enqueueBatch()
    })
  }

  enqueueBatch() {
    const batch = {
      completed: false
    }
    if (this.numberOfActiveBatches < this.concurrency) {
      this.runBatch(batch)
    } else {
      this.pendingBatches.push(batch)
    }
  }

  async runBatch(batch) {
    const { value, done } = await this.changesReader.read()
    if (done) {
      this.changesComplete = true
    } else {
      const { changes, lastSeq } = value
      batch.lastSeq = lastSeq
      this.startedBatches.push(batch)
      this.numberOfActiveBatches++
      this.enqueueBatch()
      await this.replicateBatch(changes, lastSeq)
      batch.completed = true
      this.numberOfActiveBatches--
      const next = this.pendingBatches.shift()
      if (next) {
        this.runBatch(next)
      }
    }
    await this.writeCheckpoint()
  }
  async replicateBatch(changes, lastSeq) {
    this.info[this.remoteUuid][this.direction].docsRead += changes.length
    const diffedChanges = await this.target.getDiff(changes)
    const changesWithRevs = await this.source.getRevs(diffedChanges)
    this.info[this.remoteUuid][this.direction].docsWritten += changesWithRevs.length
    const result = this.target.saveRevs(changesWithRevs)
    return { changes: result }
  }
  async writeCheckpoint() {
    let i
    for (i = 0; i < this.startedBatches.length; i++) {
      if (!this.startedBatches[i].completed)
        break
    }
    const completedTasks = this.startedBatches.splice(0, i)
    const lastCompletedTask = completedTasks.pop()
    if (!lastCompletedTask) return
    if (llastCompletedTask.lastSeq === -1) return
    if (lastCompletedTask.lastSeq === this.info[this.remoteUuid][this.direction]) return
    this.info[this.remoteUuid][this.direction].lastSeq = lastCompletedTask.lastSeq
    this.info[this.remoteUuid][this.direction].finishedAt = new Date()
    await this.local.saveLocalDoc(this.info)
    if (this.startedBatches.length === 0 && this.changesComplete) {
      this.oncomplete(this.info[this.remoteUuid][this.direction])
    }
  }
}
