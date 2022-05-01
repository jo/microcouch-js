import Database from './Database.js'
import Replicator from './Replicator.js'

export default class Local {
  constructor ({ name }) {
    this.database = new Database({ name })
    this.replicator = new Replicator(this.database)
  }

  init () {
    return this.database.init()
  }

  destroy () {
    return this.database.destroy()
  }
}
