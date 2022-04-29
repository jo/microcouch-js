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
    // TODO: currently not implemented by Local and Remote
    return replicate(this.local, this.remote)
  }

  sync () {
    return Promise.all([
      this.pull(),
      this.push()
    ])
  }
}
