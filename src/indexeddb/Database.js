import Database from '../Database.js'

export default class IndexedDBDatabase extends Database {
  constructor ({ name }) {
    super()
    this.name = name
    this.adapter = null
    this.replicator = null
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
}
