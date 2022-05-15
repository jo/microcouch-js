import Database from '../Database.js'
import FakeReplicator from './Replicator.js'

export default class FakeDatabase extends Database {
  constructor () {
    super()
    this.uuid = `fake-uuid-${Math.round(Math.random() * 100)}`
    this.updateSeq = Math.round(Math.random() * 100)
    this.replicator = new FakeReplicator(this)
  }

  init () {}
  destroy () {}

  getDoc (id) {
    throw new Error(`fake doc '${id}' not found`)
  }

  saveDoc (doc) {
    console.log('saving doc', doc)
    this.updateSeq++
    return {
      rev: '1-fake-doc-rev'
    }
  }
}
