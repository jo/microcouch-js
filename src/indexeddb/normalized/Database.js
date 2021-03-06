import Database from '../../Database.js'
import Adapter from './Adapter.js'
import Replicator from './Replicator.js'

export default class IndexedDBNormalizedDatabase extends Database {
  constructor ({ name }) {
    super()
    this.name = name
    this.adapter = new Adapter({ name })
    this.replicator = new Replicator(this.adapter)
  }

  init () {
    return this.adapter.init()
  }

  destroy () {
    return this.adapter.destroy()
  }
}
