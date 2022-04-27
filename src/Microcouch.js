// Microcouch

import Local from './local/Local.js'
import Remote from './remote/Remote.js'
import replicate from './replicate.js'

const CHANGE_EVENT = new Event('change')

export default class Microcouch extends EventTarget {
  constructor ({ name, url, headers }) {
    super()

    this.local = new Local({ name })
    this.remote = new Remote({ url, headers })
  }

  init () {
    return this.local.init()
  }

  async pull () {
    console.time('pull')
    const result = await replicate(this.remote, this.local)
    console.timeEnd('pull')
    if (result.docsWritten > 0) {
      this.dispatchEvent(CHANGE_EVENT)
    }
    return result
  }

  push () {
    return replicate(this.local, this.remote)
  }

  sync () {
    return Promise.all([
      this.pull(),
      this.push()
    ])
  }

  // TODO: this will be the user facing db api
  // it will operate on the local db only

  // getDoc (id) {
  //   return this.local.getDoc(id)
  // }

  // getDocs ({ startkey, endkey, descending, limit }) {
  //   return this.local.getRange({ startkey, endkey, descending, limit })
  // }

  // getChanges ({ since, limit } = {}) {
  //   return this.local.getChanges({ since, limit })
  // }

  // async saveDoc (doc) {
  //   const response = await this.local.saveDoc(doc)
  //   this.push()
  //   this.dispatchEvent(CHANGE_EVENT)
  //   return response
  // }

  // async saveDocs (docs) {
  //   const response = await this.local.saveDocs(docs)
  //   this.push()
  //   this.dispatchEvent(CHANGE_EVENT)
  //   return response
  // }
}
