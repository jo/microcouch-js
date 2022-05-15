import Replicator from '../Replicator.js'

export default class FakeReplicator extends Replicator {
  constructor (database) {
    super()
    this.database = database
  }

  getInfo () {
    const { uuid, updateSeq } = this.database
    const info = {
      uuid,
      updateSeq
    }
    console.log('getInfo', info)
    return info
  }

  getLog (id) {
    console.log('getLog %s', id)
    return {
      _id: `_local/${id}`
    }
  }

  saveLog (log) {
    console.log('saveLog', log)
    return {
      rev: '1-fake-log-rev'
    }
  }

  getChanges (since, { limit } = {}, stats = {}) {
    const database = this.database
    return new ReadableStream({
      start(controller) {
        console.log('getting changes since %s', since)
        controller.enqueue({
          id: 'changed-fake-doc-a', revs: [
            { rev: '1-change-a' },
            { rev: '2-change-a' }
          ]
        })
        controller.enqueue({
          id: 'changed-fake-doc-b', revs: [
            { rev: '1-change-b' }
          ]
        })
        stats.numberOfChanges = 2
        stats.lastSeq = database.updateSeq
        controller.close()
      }
    })
  }

  getDiff () {
    return new TransformStream({
      transform (changes, controller) {
        console.log('geting diff', changes)
        for (const change of changes) {
          controller.enqueue(change)
        }
      }
    })
  }

  getRevs (stats = {}) {
    stats.docsRead = 0
    return new TransformStream({
      transform (changes, controller) {
        console.log('getting revs', changes)
        for (const { id, revs } of changes) {
          controller.enqueue({
            id,
            revs: revs.map(({ rev }) => ({
              rev,
              doc: {
                _id: id,
                _rev: rev,
                foo: 'bar'
              }
            }))
          })
        }
        stats.docsRead += changes.length
      }
    })
  }

  saveRevs (stats = {}) {
    stats.docsWritten = 0
    const database = this.database
    return new WritableStream({
      write (docs) {
        console.log('saving revs', docs)
        stats.docsWritten += docs.length
        database.updateSeq += docs.length
      }
    })
  }
}
