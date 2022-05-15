export default class HttpAdapter {
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
    
    return response.json()
  }

  async getInfo () {
    const url = new URL(this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Remote database not reachable')
    }
    
    return response.json()
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

    const body = JSON.stringify(doc)
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body
    })
    if (response.status !== 201) {
      throw new Error('Could not save doc')
    }

    return response
  }

  async deleteDoc (doc) {
    const url = new URL(`${this.root}/${doc._id}`, this.url)
    url.searchParams.set('rev', doc._rev)

    const response = await fetch(url, {
      headers: {
        ...this.headers
      },
      method: 'delete'
    })
    if (response.status !== 200) {
      throw new Error('Could not delete doc')
    }

    return response
  }

  async getChanges (since, { limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url)
    url.searchParams.set('feed', 'continuous')
    url.searchParams.set('timeout', '0')
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

  async revsDiff (payload) {
    const url = new URL(`${this.root}/_revs_diff`, this.url)

    const body = JSON.stringify(payload)
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs diff')
    }

    return response
  }

  async bulkDocs (docs) {
    const url = new URL(`${this.root}/_bulk_docs`, this.url)

    const body = JSON.stringify({ docs, new_edits: false })
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body
    })
    if (response.status !== 201) {
      throw new Error('Could not save bulk docs')
    }

    return response
  }
}
