import BaseDatabase from '../../base/Database.js'
import Adapter from './Adapter.js'
import Replicator from './Replicator.js'

export default class HttpMultipartDatabase extends BaseDatabase {
  constructor ({ url, headers }) {
    super()
    this.adapter = new Adapter({ url, headers })
    this.replicator = new Replicator(this.adapter)
  }

  async getDoc (id) {
    const response = await this.adapter.getDoc(id)
    return response.json()
  }

  async saveDoc (doc) {
    const response = await this.adapter.saveDoc(doc)
    this.dispatchEvent(new Event('change'))
    return response.json()
  }

  async deleteDoc (doc) {
    const response = await this.adapter.deleteDoc(doc)
    this.dispatchEvent(new Event('change'))
    return response.json()
  }
}
