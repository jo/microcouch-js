import HttpAdapter from '../Adapter.js'

export default class HttpInlineAdapter extends HttpAdapter {
  constructor ({ url, headers }) {
    super({ url, headers })
  }

  async bulkGet (docs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url)
    url.searchParams.set('revs', 'true')
    url.searchParams.set('attachments', 'true')

    const body = JSON.stringify({ docs })
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
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
