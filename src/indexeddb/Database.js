import IndexedDBAdapter from './Adapter.js'

export default class IndexedDBDatabase {
  constructor (name) {
    this.name = name
    this.adapter = new IndexedDBAdapter(name)
  }

  init () {
    return this.adapter.init()
  }

  destroy () {
    return this.adapter.destroy()
  }

  getInfo() {
    return this.adapter.getMetadata()
  }

  getLocalDoc(id) {
    return this.adapter.getLocalDoc(id);
  }
  saveLocalDoc(doc) {
    return this.adapter.saveLocalDoc(doc);
  }

  async saveDoc (doc) {
    const [ response ] = await this.adapter.saveDocs([doc])
    return response
  }
  
  getDoc (id) {
    return this.adapter.getDoc(id)
  }
  
  getDocs ({ startkey, endkey, descending }) {
    const range = IDBKeyRange.bound(startkey, endkey)
    const direction = descending ? 'prev' : 'next'
    return this.adapter.getDocs(range, direction)
  }
  
  getDocsStream({ startkey, endkey, descending }) {
    const range = IDBKeyRange.bound(startkey, endkey);
    const direction = descending ? "prev" : "next";
    return this.adapter.getDocsStream(range, direction);
  }
  updateDocs({ startkey, endkey }, fn) {
    const range = IDBKeyRange.bound(startkey, endkey);
    return this.adapter.updateDocs(range, fn);
  }
  getChanges(since, { limit } = {}) {
    const adapter = this.adapter;
    return new ReadableStream({
      async pull(controller) {
        const { results, lastSeq } = await adapter.getChanges(since, { limit });
        since = lastSeq;
        const changes = results.map(({ id, changes: revs }) => ({ id, revs }));
        controller.enqueue({ changes, lastSeq });
        if (results.length < limit) {
          controller.close();
        }
      }
    });
  }
  async getDiff(changes) {
    if (changes.length === 0)
      return [];
    const diff = await this.adapter.getDiff(changes);
    return changes.filter(({ id, revs }) => id in diff).map(({ id, revs }) => ({
      id,
      revs: revs.filter(({ rev }) => diff[id].missing.indexOf(rev) > -1)
    }));
  }
  async getRevs(changes) {
    if (changes.length === 0)
      return changes;
    const missingRevs = changes.filter(({ id, revs }) => revs.find(({ doc }) => !doc));
    if (missingRevs.length === 0)
      return changes;
    const docs = await this.adapter.getRevs(missingRevs);
    for (const { id, revs } of changes) {
      if (!(id in docs))
        continue;
      for (const rev of revs) {
        if (!(rev.rev in docs[id]))
          continue;
        rev.doc = docs[id][rev.rev];
      }
    }
    return changes;
  }
  saveRevs(changes) {
    if (changes.length === 0)
      return changes;
    return this.adapter.saveRevs(changes, { newEdits: false });
  }
}
