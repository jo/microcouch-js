import SparkMD5 from 'spark-md5'

const MD5_CHUNK_SIZE = 32768

export const md5FromString = (string, raw) => SparkMD5.hash(string, raw)

export const md5FromBlob = async (blob, raw) => {
  const chunkSize = Math.min(MD5_CHUNK_SIZE, blob.size)
  const chunks = Math.ceil(blob.size / chunkSize)

  const md5 = new SparkMD5.ArrayBuffer()

  for (let i = 0; i < chunks; i++) {
    const part = blob.slice(i * chunkSize, (i+1) * chunkSize)
    const arrayBuffer = await part.arrayBuffer()
    md5.append(arrayBuffer)
  }

  return md5.end(raw)
}
