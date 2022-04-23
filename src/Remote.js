// remote http database

import { makeUuid, base64ToBlob, blobToBase64 } from './utils.js'
import MultipartRelated from 'multipart-related'

export default class Remote {
  constructor ({ url, headers }) {
    this.url = url
    this.root = url.pathname
    this.headers = headers
  }

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

  async getDoc (id) {
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url)
    url.searchParams.set('attachments', 'true')

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        Accept: 'application/json'
      }
    })
    if (response.status !== 200) {
      throw new Error(`Could not find doc with id '${id}'`)
    }

    const doc = await response.json()
    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          content_type,
          data: data64
        } = doc._attachments[name]
        doc._attachments[name].data = base64ToBlob(data64, content_type)
      }
    }
    return doc
  }

  async saveDoc (doc) {
    const { _id: id } = doc
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url)

    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          data: blob
        } = doc._attachments[name]
        doc._attachments[name].data = await blobToBase64(blob)
      }
    }

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(doc)
    })
    if (response.status !== 201) {
      throw new Error(`Could not save doc '${id}'`)
    }
    return response.json()
  }

  async getReplicationLog (id) {
    const url = new URL(`${this.root}/_local/${id}`, this.url)

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status === 200) {
      return response.json()
    }

    return {
      _id: `_local/${id}`
    }
  }

  async saveReplicationLog (log) {
    const url = new URL(`${this.root}/${log._id}`, this.url)

    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'put',
      body: JSON.stringify(log)
    })
    if (response.status !== 201) {
      throw new Error('Could not save replication log')
    }
  }

  async getChanges ({ since, limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url)
    url.searchParams.set('feed', 'normal')
    url.searchParams.set('style', 'all_docs')
    if (limit) {
      url.searchParams.set('limit', limit)
      url.searchParams.set('seq_interval', limit)
    }
    if (since) {
      url.searchParams.set('since', since)
    }

    const response = await fetch(url, {
      headers: this.headers
    })
    if (response.status !== 200) {
      throw new Error('Could not get changes')
    }

    const {
      results,
      last_seq: lastSeq
    } = await response.json()
    
    return {
      changes: results,
      lastSeq
    }
  }

  async getRevsDiff (changes) {
    const url = new URL(`${this.root}/_revs_diff`, this.url)
    
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(changes)
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs diff')
    }
    
    const diff = await response.json()

    const revs = []
    for (const id in diff) {
      const { missing } = diff[id]
      for (const rev of missing) {
        revs.push({ id, rev })
      }
    }
    return revs
  }

  async getRevsMultipart (revs, ondoc) {
    const url = new URL(`${this.root}/_bulk_get`, this.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')
    
    const payload = { docs: revs }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
        'Accept': 'multipart/related'
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs')
    }
    
    const contentType = response.headers.get('Content-Type')
    const multipart = new MultipartRelated(contentType)
    const reader = response.body.getReader()
    
    // tie together the process stream
    let currentBoundary
    let currentParts = []
    const decoder = new TextDecoder()
    const process = ({ value, done }) => {
      const parts = multipart.read(value)

      for (const part of parts) {
        if (!part.related) {
          const { headers, data } = part
          const json = decoder.decode(data)
          const doc = JSON.parse(json)
          ondoc(doc)
          currentParts = []
          currentBoundary = null
        } else {
          if (currentBoundary && currentBoundary !== part.related) {
            const { headers, data } = currentParts.shift()
            const json = decoder.decode(data)
            const doc = JSON.parse(json)

            for (const { headers, data } of currentParts) {
              const contentDisposition = headers['Content-Disposition']
              if (!contentDisposition) {
                console.warn('unparsed attachment', headers, doc, currentParts)
                continue
              }
              const [_, filename] = contentDisposition.match(/filename="([^"]+)"/)
              const type = headers['Content-Type']
              // TODO: check if gzipped
              const blob = new Blob([data], { type })
              doc._attachments[filename].data = blob
              delete doc._attachments[filename].follows
            }

            // emit doc
            ondoc(doc)

            currentParts = []
          }
          currentBoundary = part.related
          currentParts.push(part)
        }
      }

      return done || reader.read().then(process)
    }
    // and kick off processing
    return reader.read().then(process)
  }

  // get revs with inline attachments
  // currently not used anymore
  async getRevs (revs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')
    
    const payload = { docs: revs }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    if (response.status !== 200) {
      throw new Error('Could not get revs')
    }
    
    const { results } = await response.json()

    const foundRevs = []
    for (const { docs } of results) {
      for (const { ok } of docs) {
        foundRevs.push(ok)
      }
    }
    return foundRevs
  }

  async saveRevs (revs) {
    const url = new URL(`${this.root}/_bulk_docs`, this.url)
    
    const payload = { docs: revs, new_edits: false }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(payload)
    })
    if (response.status !== 201) {
      throw new Error('Could not save revs')
    }
  }
}
