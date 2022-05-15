import HttpDatabase from '../Database.js'
import HttpInlineAdapter from './Adapter.js'
import HttpInlineReplicator from './Replicator.js'

export default class HttpInlineDatabase extends HttpDatabase {
  constructor ({ url, headers }) {
    super()
    this.adapter = new HttpInlineAdapter({ url, headers })
    this.replicator = new HttpInlineReplicator(this.adapter)
  }
}
