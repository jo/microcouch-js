import HttpDatabase from '../Database.js'
import HttpMultipartAdapter from './Adapter.js'
import HttpMultipartReplicator from './Replicator.js'

export default class HttpMultipartDatabase extends HttpDatabase {
  constructor ({ url, headers }) {
    super()
    this.adapter = new HttpMultipartAdapter({ url, headers })
    this.replicator = new HttpMultipartReplicator(this.adapter)
  }
}
