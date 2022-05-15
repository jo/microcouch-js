import IndexedDBDatabase from '../Database.js'
import Adapter from './Adapter.js'
import Replicator from './Replicator.js'

export default class IndexedDBFlatDatabase extends IndexedDBDatabase {
  constructor ({ name }) {
    super({ name })
    this.adapter = new Adapter({ name })
    this.replicator = new Replicator(this.adapter)
  }
}
