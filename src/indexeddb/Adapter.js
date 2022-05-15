export default class IndexedDBAdapter {
  constructor ({ name }) {
    this.name = name
    this.db = null
    // TODO: remove metadata
    this.metadata = null
  }

  destroy () {
    return new Promise((resolve, reject) => {
      this.db.close()
      const req = indexedDB.deleteDatabase(this.name)
      req.onsuccess = () => {
        this.db = null
        this.metadata = null
        resolve()
      }
    })
  }
}
