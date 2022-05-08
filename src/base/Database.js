import replicate from './replicate.js'

export default class Database extends EventTarget {
  async init () {
    throw new Error(`init is not implemented for ${this.constructor.name}`)
  }

  async destroy () {
    throw new Error(`destroy is not implemented for ${this.constructor.name}`)
  }


  async getChanges (id) {
    throw new Error(`getChanges is not implemented for ${this.constructor.name}`)
  }


  async getDoc (id) {
    throw new Error(`getDoc is not implemented for ${this.constructor.name}`)
  }

  async saveDoc (doc) {
    throw new Error(`saveDoc is not implemented for ${this.constructor.name}`)
  }

  async deleteDoc (doc) {
    throw new Error(`deleteDoc is not implemented for ${this.constructor.name}`)
  }

  async getDocs (range) {
    throw new Error(`getDocs is not implemented for ${this.constructor.name}`)
  }


  async pull (other) {
    const result = await replicate(other, this)
    if (result.docsWritten > 0) {
      this.dispatchEvent(new Event('change'))
    }
    return result
  }

  push (other) {
    return replicate(this, other)
  }

  sync (other) {
    return Promise.all([
      this.pull(other),
      this.push(other)
    ])
  }
}
