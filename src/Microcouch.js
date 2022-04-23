// Microcouch
// 1.0.0

import { makeUuid, calculateSha1 } from './utils.js'
import Local from './Local.js'
import Remote from './Remote.js'
import Replication from './Replication.js'

export default class Microcouch extends EventTarget {
  constructor ({ name, url, headers }) {
    super()

    this.local = new Local({ name })
    this.remote = new Remote({ url, headers })

    this.changeEvent = new Event('change')
  }

  init () {
    // only local needs initializing
    return this.local.init()
  }

  getChanges ({ since, limit } = {}) {
    return this.local.getChanges({ since, limit })
  }

  getDoc (id) {
    return this.local.getDoc(id)
  }

  async saveDoc (doc) {
    const response = await this.local.saveDoc(doc)
    this.push()
    this.dispatchEvent(this.changeEvent)
    return response
  }

  // TODO: implement getDocs
  // getDocs ({ startkey, endkey, descending, limit }) {
  //   return this.local.getDocs(ids)
  // }

  // TODO: implement saveDocs
  // async saveDocs (docs) {
  //   const response = await this.local.saveDocs(docs)
  //   this.push()
  //   this.dispatchEvent(this.changeEvent)
  //   return response
  // }

  async pull () {
    const replication = new Replication(this.remote, this.local)
    await replication.replicate()
    if (replication.docsWritten > 0) {
      this.dispatchEvent(this.changeEvent)
    }
  }

  // TODO: not supported yet
  // push () {
  //   const replication = new Replication(this.local, this.remote)
  //   return replication.replicate()
  // }
  
  // sync () {
  //   return Promise.all([
  //     this.pull(),
  //     this.push()
  //   ])
  // }
}
