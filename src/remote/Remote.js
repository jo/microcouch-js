import getChanges from './getChanges.js'
import getDocs from './getDocs.js'

export default class Remote {
  constructor ({ url, headers }) {
    this.url = url
    this.root = url.pathname
    this.headers = headers

    this.changesParser = null
  }

  // get the server uuid
  // used in replication
  async getUuid () {
    const url = new URL(this.url)
    url.pathname = '/'
    
    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote server not reachable')
    }
    
    const { uuid } = await response.json()
    return uuid
  }

  // get the db update seq
  // used in replication
  async getUpdateSeq () {
    const url = new URL(this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote database not reachable')
    }
    
    const { update_seq } = await response.json()
    return update_seq
  }

  // get a replication log (a local doc)
  // and fallback to a stub if non-existent
  // used in replication
  // TODO: use getDoc
  async getReplicationLog (id) {
    const _id = `_local/${id}`
    const url = new URL(`${this.root}/${_id}`, this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status === 200) {
      return response.json()
    }

    return { _id }
  }

  // save replication doc
  // used in replication
  // TODO: use saveDoc
  async saveReplicationLog (doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url)

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(doc)
    })
    if (response.status !== 201) {
      throw new Error('Could not save replication log')
    }
    return response.json()
  }

  // get stream of changes
  getChanges (since, { limit } = {}) {
    return getChanges(this, since, { limit })
  }

  // used in push replication
  // TODO: rename to getDiffs
  getDiffsStream ({ batchSize } = { batchSize: 128 }) {
    throw new Error('Not supported for Remote yet')
  }

  // get a stream of docs
  getDocs ({ batchSize } = { batchSize: 512 }) {
    return getDocs(this, { batchSize })
  }

  // used in push replication
  // TODO: rename to saveDocs
  writeDocsStream ({ batchSize } = { batchSize: 128 }) {
    throw new Error('Not supported for Remote yet')
  }

  // used in push replication
  // TODO: somehow expose to saveDocs stream directly
  get docsWritten () {
    throw new Error('Not supported for Remote yet')
  }
}
