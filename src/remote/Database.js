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
    
    return response.json()
  }

  async saveDoc (doc) {
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
      throw new Error('Could not save doc')
    }
    return response.json()
  }
}
