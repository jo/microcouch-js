import Database from '../Database.js'
import HttpAdapter from './Adapter.js'
import HttpReplicator from './Replicator.js'

export default class HttpDatabase extends Database {
  constructor ({ url, headers }) {
    super()
    this.adapter = new HttpAdapter({ url, headers })
    this.replicator = new HttpReplicator(this.adapter)
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
