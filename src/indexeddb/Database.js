import Database from '../Database.js'
import IndexedDBAdapter from './Adapter.js'
import IndexedDBReplicator from './Replicator.js'

export default class IndexedDBDatabase extends Database {
  constructor ({ name }) {
    super()
    this.name = name
    this.adapter = new IndexedDBAdapter({ name })
    this.replicator = new IndexedDBReplicator(this.adapter)
  }

  init () {
    return this.adapter.init()
  }

  destroy () {
    return this.adapter.destroy()
  }

  async saveDoc (doc) {
    const [ response ] = await this.adapter.saveDocs([doc])
    this.dispatchEvent(new Event('change'))
    return response
  }
  
  getDocs ({ startkey, endkey, descending }) {
    const range = IDBKeyRange.bound(startkey, endkey)
    const direction = descending ? 'prev' : 'next'
    return this.adapter.getDocs(range, direction)
  }
  
  getDoc (id) {
    return this.adapter.getDoc(id)
  }
}
