import BaseDatabase from '../../base/Database.js'
import Adapter from './Adapter.js'
import Replicator from './Replicator.js'

export default class IndexedDBFlatDatabase extends BaseDatabase {
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

  async saveDoc (doc) {
    const [ response ] = await this.adapter.saveDocs([doc])
    this.dispatchEvent(new Event('change'))
    return response
  }
}
