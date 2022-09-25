import SparkMD5 from 'spark-md5'

import { buildEntry, updateEntry, docFromEntry, changeFromEntry } from './datamodel.js'

const DOC_STORE = 'docs'
const META_STORE = 'meta'
var MD5_CHUNK_SIZE = 32768;

var md5FromArrayBuffer = (arrayBuffer, raw) => {
  const chunkSize = Math.min(MD5_CHUNK_SIZE, arrayBuffer.byteLength);
  const chunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
  const md5 = new SparkMD5.ArrayBuffer();
  for (let i = 0; i < chunks; i++) {
    const part = arrayBuffer.slice(i * chunkSize, (i + 1) * chunkSize);
    md5.append(part);
  }
  return md5.end(raw);
};

const calculateDigest = arrayBuffer => {
  const md5 = md5FromArrayBuffer(arrayBuffer, true);
  const md5Base64 = btoa(md5);
  // console.log("calculated digest", md5Base64, arrayBuffer);
  return `md5-${md5Base64}`;
};

export default class IndexedDBAdapter {
  constructor (name) {
    this.name = name
    this.db = null
  }

  async init() {
    if (this.db)
      return;
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open(this.name);
      openReq.onabort = (e) => reject(e);
      openReq.onerror = (e) => reject(e.target.error);
      openReq.onblocked = (e) => reject(e);
      openReq.onupgradeneeded = (e) => {
        const db = e.target.result;
        const keyPath = "id";
        const docStore = db.createObjectStore(DOC_STORE, { keyPath });
        docStore.createIndex("seq", "seq", { unique: true });
        docStore.createIndex("revs", "available", { multiEntry: true });
        db.createObjectStore(META_STORE, { keyPath });
      };
      openReq.onsuccess = (e) => {
        this.db = e.target.result;
        this.db.onabort = () => this.db.close();
        this.db.onversionchange = () => this.db.close();
        const transaction = this.db.transaction(META_STORE, "readwrite");
        transaction.oncomplete = () => resolve();
        const metaStore = transaction.objectStore(META_STORE);
        metaStore.get(META_STORE).onsuccess = (e2) => {
          if (!e2.target.result) {
            const metadata = {
              id: META_STORE,
              doc_count: 0,
              seq: 0,
              db_uuid: crypto.randomUUID()
            };
            metaStore.put(metadata);
          }
        };
      };
    });
  }
  destroy() {
    return new Promise((resolve, reject) => {
      this.db.close();
      const req = indexedDB.deleteDatabase(this.name);
      req.onsuccess = () => {
        this.db = null;
        this.metadata = null;
        resolve();
      };
    });
  }
  getMetadata() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(META_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      transaction.objectStore(META_STORE).get(META_STORE).onsuccess = (e) => resolve(e.target.result);
    });
  }
  getLocalDoc(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      transaction.objectStore(DOC_STORE).get(id).onsuccess = (e) => {
        const entry = e.target.result;
        const doc = entry ? entry.data : { _id: id };
        resolve(doc);
      };
    });
  }
  saveLocalDoc(doc) {
    const entry = {
      id: doc._id,
      data: {
        ...doc,
        _rev: doc._rev ? doc._rev + 1 : 1
      }
    };
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readwrite");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      transaction.objectStore(DOC_STORE).put(entry).onsuccess = () => resolve({ rev: doc._rev });
    });
  }
  async getDiff(batch) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      const index = transaction.objectStore(DOC_STORE).index("revs");
      const diff = {};
      transaction.oncomplete = () => resolve(diff);
      for (const { id, revs } of batch) {
        for (const { rev } of revs) {
          index.getKey([id, rev]).onsuccess = (e) => {
            if (!e.target.result) {
              diff[id] = diff[id] || { missing: [] };
              diff[id].missing.push(rev);
            }
          };
        }
      }
    });
  }
  async getRevs(docs) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      const result = {};
      const store = transaction.objectStore(DOC_STORE);
      transaction.oncomplete = () => resolve(result);
      for (const doc of docs) {
        const { id, revs, attsSince } = doc;
        store.get(id).onsuccess = (e) => {
          const entry = e.target.result;
          if (!entry) {
            throw new Error(`doc not found: '${id}'`);
          }
          result[id] = revs.reduce((memo, { rev }) => {
            memo[rev] = docFromEntry(entry, rev, { attsSince });
            return memo;
          }, {});
        };
      }
    });
  }
  async saveDocs(docs) {
    const docRevs = docs.map((doc) => ({
      id: doc._id,
      revs: [{ doc }]
    }));
    return this.saveRevs(docRevs, { newEdits: true });
  }
  async saveRevs(docRevs, { newEdits }) {
    for (const { id, revs } of docRevs) {
      for (const { doc: { _attachments } } of revs) {
        if (!_attachments)
          continue;
        for (const name in _attachments) {
          const attachment = _attachments[name];
          const { data } = attachment;
          if (!data)
            continue;
          attachment.digest = calculateDigest(data);
        }
      }
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE, META_STORE], "readwrite");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      const result = [];
      transaction.oncomplete = () => resolve(result);
      const docStore = transaction.objectStore(DOC_STORE);
      const metaStore = transaction.objectStore(META_STORE);
      metaStore.get(META_STORE).onsuccess = (e) => {
        const metadata = e.target.result;
        let cnt = docRevs.length;
        for (const { id, revs } of docRevs) {
          docStore.get(id).onsuccess = (e2) => {
            const existingEntry = e2.target.result;
            const isNew = !existingEntry;
            const wasDeleted = existingEntry && existingEntry.deleted;
            const entry = existingEntry || buildEntry(id);
            const updatedEntry = updateEntry(entry, revs, { newEdits });
            updatedEntry.seq = ++metadata.seq;
            const isDeleted = updatedEntry.deleted;
            docStore.put(updatedEntry).onsuccess = () => {
              result.docsWritten++;
              let delta = 0;
              if (isNew) {
                delta = 1;
              } else {
                if (!wasDeleted && isDeleted)
                  delta = -1;
                if (wasDeleted && !isDeleted)
                  delta = 1;
              }
              metadata.doc_count += delta;
              result.push({ id, rev: updatedEntry.rev });
              cnt--;
              if (cnt === 0) {
                metaStore.put(metadata);
              }
            };
          };
        }
      };
    });
  }
  async getChanges(since, { limit } = {}) {
    since = since || -1;
    limit = limit || -1;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      const index = transaction.objectStore(DOC_STORE).index("seq");
      const changes = [];
      let lastSeq = -1;
      let received = 0;
      index.openCursor(IDBKeyRange.lowerBound(since, true)).onsuccess = (e) => {
        if (!e.target.result) {
          return;
        }
        const cursor = e.target.result;
        const entry = cursor.value;
        const change = changeFromEntry(entry);
        changes.push(change);
        lastSeq = change.seq;
        received++;
        if (received !== limit) {
          cursor.continue();
        }
      };
      transaction.oncomplete = () => resolve({ results: changes, lastSeq });
    });
  }
  getDoc(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(DOC_STORE, "readonly");
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      transaction.objectStore(DOC_STORE).get(id).onsuccess = (e) => {
        const entry = e.target.result;
        if (!entry)
          return reject(new Error("not found"));
        const doc = docFromEntry(entry, entry.rev);
        resolve(doc);
      };
    });
  }
  getDocs(range, direction) {
    const db = this.db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(DOC_STORE, "readonly");
      const docs = [];
      transaction.onabort = (e) => reject(e);
      transaction.onerror = (e) => reject(e);
      transaction.oncomplete = () => resolve(docs);
      const store = transaction.objectStore(DOC_STORE);
      store.openCursor(range, direction).onsuccess = (e) => {
        if (!e.target.result) {
          return;
        }
        const cursor = e.target.result;
        const entry = cursor.value;
        const doc = docFromEntry(entry, entry.rev);
        if (!doc._deleted) {
          docs.push(doc);
        }
        cursor.continue();
      };
    });
  }
  getDocsStream(range, direction) {
    const db = this.db;
    return new ReadableStream({
      start(controller) {
        const transaction = db.transaction(DOC_STORE, "readonly");
        transaction.onabort = (e) => {
          console.error("abort getDocs", e);
          controller.error(e);
        };
        transaction.onerror = (e) => {
          console.error("error getDocs", e);
          controller.error(e);
        };
        transaction.oncomplete = () => controller.close();
        const store = transaction.objectStore(DOC_STORE);
        store.openCursor(range, direction).onsuccess = (e) => {
          if (!e.target.result) {
            return;
          }
          const cursor = e.target.result;
          const entry = cursor.value;
          const doc = docFromEntry(entry, entry.rev);
          if (!doc._deleted) {
            controller.enqueue(doc);
          }
          cursor.continue();
        };
      }
    });
  }
  async updateDocs(range, fn) {
    const docs = await this.getDocs(range, "next");
    const newDocs = [];
    for (const doc of docs) {
      const result = await fn(doc);
      if (result)
        newDocs.push(result);
    }
    return this.saveDocs(newDocs);
  }
}
