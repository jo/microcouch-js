// find next position where to split changes
const nextSplitPosition = (data, offset = 0) => {
  if (offset > data.length + 4) return [-1]
  for (let i = offset; i < data.length; i++) {
    // mid changes: `},\r\n{` == [ 125, 44, 10, 123 ]
    if (data[i] === 125 && data[i+1] === 44 && data[i+2] === 13 && data[i+3] === 10 && data[i+4] === 123) return [i]
    // end of changes: `\n],` == [ 10, 93, 44 ]
    if (data[i] === 10 && data[i+1] === 93 && data[i+2] === 44) return [i, true]
  }
  return [-1]
}

class ChangesUnpacker {
  constructor() {
    this.data = new Uint8Array(0)

    this.onChange = null
    this.onClose = null

    this.decoder = new TextDecoder()

    // state
    this.startParsed = false
    this.lastSeq = null
    this.numberOfChanges = 0
  }

  addBinaryData(uint8Array) {
    const newData = new Uint8Array(this.data.length + uint8Array.length)
    newData.set(this.data, 0)
    newData.set(uint8Array, this.data.length)
    this.data = newData

    this.checkforChanges()
  }

  checkforChanges() {
    if (!this.startParsed) {
      // remove the start: `{"results":[\n`
      this.data = this.data.slice(13)
      this.startParsed = true
    }

    let change
    do {
      change = null

      const [endPosition, endReached] = nextSplitPosition(this.data)
      if (endPosition === -1) continue

      if (endPosition > 0) {
        const json = this.decoder.decode(this.data.slice(0, endPosition + 1))
        change = JSON.parse(json)
        this.onChange(change)
        this.numberOfChanges++
      }

      if (endReached) {
        const rest = this.decoder.decode(this.data.slice(endPosition + 4))
        const { last_seq } = JSON.parse(`{${rest}`)
        this.lastSeq = last_seq
        return this.onClose()
      }

      this.data = this.data.slice(endPosition + 4)
    } while (change)
  }
}

class ChangesParserTransformStream {
  constructor() {
    const unpacker = new ChangesUnpacker()
    const queueingStrategy = new CountQueuingStrategy({ highWaterMark: 1 })

    const readable = new ReadableStream({
      start(controller) {
        unpacker.onChange = change => controller.enqueue(change)
        unpacker.onClose = () => {
          // store stats
          readable.lastSeq = unpacker.lastSeq
          readable.numberOfChanges = unpacker.numberOfChanges

          controller.close()
        }
      }
    })
    this.readable = readable

    this.writable = new WritableStream({
      write(uint8Array) {
        unpacker.addBinaryData(uint8Array)
      }
    }, queueingStrategy)

    this.unpacker = unpacker
  }
}

export default async function getChanges (db, since, { limit } = {}) {
  const url = new URL(`${db.root}/_changes`, db.url)
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
    headers: db.headers
  })
  if (response.status !== 200) {
    throw new Error('Could not get changes')
  }

  db.changesParserTransformStream = new ChangesParserTransformStream()

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
    .pipeThrough(db.changesParserTransformStream)
}
