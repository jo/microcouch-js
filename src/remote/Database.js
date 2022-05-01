import { gzip } from '../utils.js'

const gzipJSONBody = body => {
  const blob = new Blob([JSON.stringify(body)], { type: 'application/json' })
  return gzip(blob)
}

export default class Database {
  constructor ({ url, headers }) {
    this.url = url
    this.root = url.pathname
    this.headers = headers
  }

  async getServerInfo () {
    const url = new URL(this.url)
    url.pathname = '/'
    
    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote server not reachable')
    }
    
    return response
  }

  async getInfo () {
    const url = new URL(this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote database not reachable')
    }
    
    return response
  }

  async getDoc (id) {
    const url = new URL(`${this.root}/${id}`, this.url)

    const response = await fetch(url, {
      headers: this.headers
    })

    if (response.status !== 200) {
      throw new Error('Could not get doc')
    }
    
    return response
  }

  async saveDoc (doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url)

    const body = await gzipJSONBody(doc)
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip'
      },
      method: 'put',
      body
    })
    if (response.status !== 201) {
      throw new Error('Could not save doc')
    }

    return response
  }

  async getChanges (since, { limit } = {}) {
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

    return response
  }

  async bulkGet (docs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')

    const body = await gzipJSONBody({ docs })
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        'Accept': 'multipart/related',
        'Content-Encoding': 'gzip'
      },
      method: 'post',
      body
    })
    if (response.status !== 200) {
      throw new Error('Could not get docs multipart')
    }

    return response
  }
}
