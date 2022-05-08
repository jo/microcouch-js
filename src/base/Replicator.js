export default class Replicator {
  async getInfo () {
    throw new Error(`getInfo is not implemented for ${this.constructor.name}`)
  }

  async getLog (id) {
    throw new Error(`getLog is not implemented for ${this.constructor.name}`)
  }

  async saveLog (doc) {
    throw new Error(`saveLog is not implemented for ${this.constructor.name}`)
  }


  getChanges (since, { limit } = {}, stats = {}) {
    throw new Error(`getChanges is not implemented for ${this.constructor.name}`)
  }

  getDiff () {
    throw new Error(`getDiff is not implemented for ${this.constructor.name}`)
  }

  getRevs (stats = {}) {
    throw new Error(`getRevs is not implemented for ${this.constructor.name}`)
  }

  saveRevs (stats = {}) {
    throw new Error(`saveRevs is not implemented for ${this.constructor.name}`)
  }
}
