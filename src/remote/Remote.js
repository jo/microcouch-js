import Database from './Database.js'
import Replicator from './Replicator.js'

export default class Remote {
  constructor ({ url, headers }) {
    this.database = new Database({ url, headers })
    this.replicator = new Replicator(this.database)
  }
}
