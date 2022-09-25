import IndexedDBDatabase from './indexeddb/Database.js'
import HttpDatabase from './http/Database.js'
import Replicator from './Replicator.js'

export default class Microcouch extends EventTarget {
  constructor(url, { headers } = {}) {
    super()

    this.local = new IndexedDBDatabase(url)
    this.remote = new HttpDatabase(new URL(url), { headers })

    this.initialized = false
  }

  async init() {
    if (this.initialized) return
    await this.local.init()
    this.initialized = true
  }

  async destroy() {
    await this.init()
    await this.local.destroy()
  }

  async reset() {
    await this.init()
    await this.local.destroy()
    this.initialized = false
    return this.init()
  }

  
  getInfo() {
    return this.local.getInfo()
  }


  async getDoc(id) {
    await this.init()
    return this.local.getDoc(id)
  }

  async saveDoc(doc) {
    await this.init()
    const response = await this.local.saveDoc(doc)
    this.dispatchEvent(new Event("change"))
    return response
  }


  async getLocalDoc(id) {
    await this.init()
    return this.local.getLocalDoc(id)
  }

  async saveLocalDoc(doc) {
    await this.init()
    return this.local.saveLocalDoc(doc)
  }


  async getDocs(options) {
    await this.init()
    return this.local.getDocs(options)
  }

  async getDocsStream(options) {
    await this.init()
    return this.local.getDocsStream(options)
  }

  async updateDocs(options, fn) {
    await this.init()
    return this.local.updateDocs(options, fn)
  }


  async pull() {
    await this.init()
    const replicator = new Replicator(this.local, this.remote, "pull", { concurrency: 8, batchSize: 512 })
    const result = await replicator.replicate()
    if (result.docsWritten > 0) {
      this.dispatchEvent(new Event("change"))
    }
    return result
  }

  async push() {
    await this.init()
    const replicator = new Replicator(this.local, this.remote, "push", { concurrency: 8, batchSize: 512 })
    return replicator.replicate()
  }

  sync() {
    return Promise.all([
      this.pull(),
      this.push()
    ]);
  }
}
