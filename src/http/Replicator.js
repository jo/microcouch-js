import Replicator from '../Replicator.js'

class GetChangesReadableStream extends ReadableStream {
  constructor (adapter, { since, limit }) {
    let reader

    super({
      async start(controller) {
        const response = await adapter.getChanges(since, { limit })
        reader = response.body.getReader()
      },

      async pull (controller) {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          reader.releaseLock()
        } else {
          controller.enqueue(value)
        }
      }
    }, { highWaterMark: 1024*1024 })
  }
}

// find next position of linebreak where to split changes
const nextSplitPosition = data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 10) return i
  }
  return -1
}

class ChangesParserTransformStream extends TransformStream {
  constructor (stats = {}) {
    stats.numberOfChanges = 0
    stats.lastSeq = null

    const decoder = new TextDecoder()

    super({
      transform (chunk, controller) {
        const newData = new Uint8Array(this.data.length + chunk.length)
        newData.set(this.data, 0)
        newData.set(chunk, this.data.length)
        this.data = newData

        while (true) {
          const endPosition = nextSplitPosition(this.data)
          if (endPosition === -1) return

          if (endPosition > 0) {
            const line = decoder.decode(this.data.slice(0, endPosition))
            let change
            try {
              change = JSON.parse(line)
            } catch (e) {
              throw new Error('could not parse change JSON')
            }

            const { last_seq, id, changes: revs } = change
            if (last_seq) {
              stats.lastSeq = last_seq
            } else {
              stats.numberOfChanges++
              controller.enqueue({ id, revs })
            }
          }

          this.data = this.data.slice(endPosition + 1)
        }
      },
      
      data: new Uint8Array(0),
      startParsed: false
    }, { highWaterMark: 1024*1024*8 }, { highWaterMark: 1024 })
  }
}

class FilterMissingRevsTransformStream extends TransformStream {
  constructor (adapter) {
    super({
      async transform (batch, controller) {
        const payload = {}
        for (const { id, revs } of batch) {
          payload[id] = revs.map(({ rev }) => rev)
        }

        const response = await adapter.revsDiff(payload)
        const diff = await response.json()

        for (const id in diff) {
          if (!('missing' in diff[id])) {
            throw new Error('missing `missing` property in revsDiff response')
          }

          const { missing } = diff[id]
          const revs = missing.map(rev => ({ rev }))
          if (revs.length > 0) {
            controller.enqueue({ id, revs })
          }
        }
      }
    })
  }
}

export default class HttpReplicator extends Replicator {
  constructor (adapter) {
    super()
    this.adapter = adapter
  }

  // TODO: compose uuid from server uuid + dbname
  async getInfo () {
    const [
      { uuid },
      { update_seq: updateSeq }
    ] = await Promise.all([
      this.adapter.getServerInfo(),
      this.adapter.getInfo()
    ])
    
    return { uuid, updateSeq }
  }

  // fallback to a stub if non-existent
  async getLog (id) {
    const _id = `_local/${id}`
    let doc

    try {
      const response = await this.adapter.getDoc(_id)
      doc = await response.json()
    } catch (e) {
      doc = { _id }
    }

    return doc
  }

  async saveLog (doc) {
    const response = await this.adapter.saveDoc(doc)
    return response.json()
  }

  getChanges (since, { limit } = {}, stats = {}) {
    const getChangesReadableStream = new GetChangesReadableStream(this.adapter, { since, limit })
    const changesParserTransformStream = new ChangesParserTransformStream(stats)

    return getChangesReadableStream
      .pipeThrough(changesParserTransformStream)
  }

  getDiff () {
    return new FilterMissingRevsTransformStream(this.adapter)
  }
}
