
class GetDiffs {
  constructor (db, { batchSize }) {
    this.db = db
    this.batchSize = batchSize
    
    this.onDiff = null
    this.onClose = null

    this.changes = []
  }

  addChange (change) {
    this.changes.push(change)
    return this.processDiffs()
  }

  close () {
    return this.processDiffs(true)
  }

  async getDiff(changes) {
    return new Promise((resolve, reject) => {
      const store = this.db.getDocStore('readonly')

      const revs = []
      let cnt = Object.keys(changes).length

      for (const id in changes) {
        store.get(id).onsuccess = e => {
          cnt--
          const entry = e.target.result
          for (const rev of changes[id]) {
            const isPresent = entry && rev in entry.revs
            if (!isPresent) {
              revs.push({ id, rev })
            }
          }
          if (cnt === 0) {
            resolve(revs)
          }
        }
      }
    })
  }

  async processDiffs(flush) {
    if (!flush && this.changes.length < this.batchSize) return
    if (this.changes.length === 0) {
      if (flush) this.onClose()
      return
    }

    let batch = []
    do {
      batch = this.changes.splice(0, this.batchSize)
      if (batch.length > 0) {
        const revs = {}
        for (const { id, changes } of batch) {
          revs[id] = changes.map(({ rev }) => rev)
        }
        const diff = await this.getDiff(revs)
        for (const rev of diff) {
          this.onDiff(rev)
        }
      }
    } while (batch.length === this.batchSize)

    if (flush) this.onClose()
  }
}

class GetDiffsTransformStream {
  constructor(db, { batchSize }) {
    const revsDiffsGetter = new GetDiffs(db, { batchSize })
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })

    this.readable = new ReadableStream({
      start(controller) {
        revsDiffsGetter.onDiff = diff => controller.enqueue(diff)
        revsDiffsGetter.onClose = () => controller.close()
      }
    })

    this.writable = new WritableStream({
      write(change) {
        return revsDiffsGetter.addChange(change)
      },
      close() {
        return revsDiffsGetter.close()
      }
    }, queueingStrategy)
  }
}

export default function getDiff (db, { batchSize } = { batchSize: 128 }) {
  return new GetDiffsTransformStream(db, { batchSize })
}
