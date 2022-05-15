const objectOpen = 123 // {
const objectClose = 125 // }
const string = 34 // "
const backslash = 92 // \

export default class BulkGetParser {
  constructor () {
    this.decoder = new TextDecoder()

    this.data = new Uint8Array(0)
    this.objectLevel = 0
    this.onDoc = undefined
  }

  async write (chunk) {
    if (chunk) {
      // add current chunk to data
      const newData = new Uint8Array(this.data.length + chunk.length)
      newData.set(this.data, 0)
      newData.set(chunk, this.data.length)
      this.data = newData
    }

    // TODO: use state object
    let objectLevel = 0 + this.objectLevel
    let objectStart = -1
    let objectEnd = -1
    let innerString = false
    let escaping = false

    for (let i = 0; i < this.data.length; i++) {
      // check whether we're inside a string or not
      if (this.data[i] === string && !escaping) {
        innerString = !innerString
      }

      // check whether we're inside a string and escaping
      escaping = innerString && this.data[i] === backslash

      // do nothing if we're inside a string
      if (innerString) continue

      // look for object openings
      if (this.data[i] === objectOpen) {
        objectLevel++
        // we're only interested at objects at level 2
        if (objectLevel === 2) {
          objectStart = i
        }
      }

      // look for object closings
      if (this.data[i] === objectClose) {
        // only interested in level 2 objects
        if (objectLevel === 2) {
          // parse json and emit it
          const json = this.decoder.decode(this.data.slice(objectStart, i + 1))
          const doc = JSON.parse(json)
          await this.onDoc(doc)
          objectStart = -1
          objectEnd = i + 1
        }
        objectLevel--
      }
    }

    // if we emitted something, remove that from data
    if (objectEnd > -1) {
      this.data = this.data.slice(objectEnd)
      this.objectLevel = 1
    } else if (objectStart > -1) {
      this.data = this.data.slice(objectStart)
      this.objectLevel = 1
    }
  }
}
