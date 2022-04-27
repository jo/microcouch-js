import ChangesParserTransformStream from './ChangesParserTransformStream.js'
import GetDocsTransformStream from './GetDocsTransformStream.js'

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
  // used in replication
  async getChangesStream (since, { limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url)
    url.searchParams.set('feed', 'normal')
    url.searchParams.set('style', 'all_docs')
    if (since) {
      url.searchParams.set('since', since)
    }
    if (limit) {
      url.searchParams.set('limit', limit)
      url.searchParams.set('seq_interval', limit)
    }

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Could not get changes')
    }

    this.changesParserTransformStream = new ChangesParserTransformStream()

    // create a new ReadableStream out of the response
    // in order to get it polyfilled
    const reader = response.body.getReader()
    const readableStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          controller.enqueue(value)
        }

        controller.close()
        reader.releaseLock()
      }
    })
    
    return readableStream
      .pipeThrough(this.changesParserTransformStream)
  }

  // retrieve update seq of last parsed change
  // used in replication
  get lastSeq () {
    return this.changesParserTransformStream && this.changesParserTransformStream.lastSeq
  }

  // retrieve number of changes of last parsed change
  // used in replication
  get numberOfChanges () {
    return this.changesParserTransformStream && this.changesParserTransformStream.numberOfChanges
  }

  // used in push replication
  getDiffsStream ({ batchSize } = { batchSize: 128 }) {
    throw new Error('Not supported for Remote yet')
  }

  // get a stream of docs
  // used in replication
  getDocsStream ({ batchSize } = { batchSize: 512 }) {
    this.getDocsTransformSteam = new GetDocsTransformStream(this, { batchSize })
    return this.getDocsTransformSteam
  }

  // return number of docs read via getDocsStream
  // used in replication
  get docsRead () {
    return this.getDocsTransformSteam ? this.getDocsTransformSteam.docsRead : 0
  }

  // used in push replication
  writeDocsStream ({ batchSize } = { batchSize: 128 }) {
    throw new Error('Not supported for Remote yet')
  }

  // used in push replication
  get docsWritten () {
    throw new Error('Not supported for Remote yet')
  }
}
