import SparkMD5 from 'spark-md5'

const MD5_CHUNK_SIZE = 32768

export const calculateMd5 = async blob => {
  const chunkSize = Math.min(MD5_CHUNK_SIZE, blob.size)
  const chunks = Math.ceil(blob.size / chunkSize)

  const md5 = new SparkMD5.ArrayBuffer()

  for (let i = 0; i < chunks; i++) {
    const part = blob.slice(i * chunkSize, (i+1) * chunkSize)
    const arrayBuffer = await part.arrayBuffer()
    md5.append(arrayBuffer)
  }

  return md5.end(true)
}

export const makeUuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}


export class BatchingTransformStream extends TransformStream {
  constructor ({ batchSize }) {
    // TODO: make highWaterMarks configurable
    super({
      start () {},

      transform (entry, controller) {
        this.entries.push(entry)
        if (this.entries.length >= batchSize) {
          const batch = this.entries.splice(0, batchSize)
          controller.enqueue(batch)
        }
      },
      
      flush (controller) {
        if (this.entries.length > 0) controller.enqueue(this.entries)
      },

      entries: []
    })
  }
}

export const gzip = blob => {
  const ds = new CompressionStream('gzip')
  const compressedStream = blob.stream().pipeThrough(ds)
  return new Response(compressedStream).blob()
}

export const gunzip = (blob, type) => {
  const ds = new DecompressionStream('gzip')
  const decompressedStream = blob.stream().pipeThrough(ds)
  const responseOptions = {
    headers: {
      'Content-Type': type
    }
  }
  return new Response(decompressedStream, responseOptions).blob()
}
