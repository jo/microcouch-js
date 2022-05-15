import Database from '../Database.js'

export default class HttpDatabase extends Database {
  constructor () {
    super()
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
