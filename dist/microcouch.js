// src/utils.js
var makeUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
};
var encodeHex = (data) => Array.from(new Uint8Array(data)).map((x) => ("00" + x.toString(16)).slice(-2)).join("");
var calculateSha1 = async (text) => {
  const enc = new TextEncoder();
  const bits = enc.encode(text);
  const data = await crypto.subtle.digest("SHA-1", bits);
  return encodeHex(data);
};
var base64ToBlob = (data, type) => {
  const raw = atob(data);
  const length = raw.length;
  const uInt8Array = new Uint8Array(length);
  for (let i = 0; i < length; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type });
};
var blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dec = `data:${blob.type};base64,`;
      const data = reader.result.slice(dec.length);
      resolve(data);
    };
    reader.readAsDataURL(blob);
  });
};

// node_modules/pouchdb-merge/lib/index.es.js
function winningRev(metadata) {
  var winningId;
  var winningPos;
  var winningDeleted;
  var toVisit = metadata.rev_tree.slice();
  var node;
  while (node = toVisit.pop()) {
    var tree = node.ids;
    var branches = tree[2];
    var pos = node.pos;
    if (branches.length) {
      for (var i = 0, len = branches.length; i < len; i++) {
        toVisit.push({ pos: pos + 1, ids: branches[i] });
      }
      continue;
    }
    var deleted = !!tree[1].deleted;
    var id = tree[0];
    if (!winningId || (winningDeleted !== deleted ? winningDeleted : winningPos !== pos ? winningPos < pos : winningId < id)) {
      winningId = id;
      winningPos = pos;
      winningDeleted = deleted;
    }
  }
  return winningPos + "-" + winningId;
}
function traverseRevTree(revs, callback) {
  var toVisit = revs.slice();
  var node;
  while (node = toVisit.pop()) {
    var pos = node.pos;
    var tree = node.ids;
    var branches = tree[2];
    var newCtx = callback(branches.length === 0, pos, tree[0], node.ctx, tree[1]);
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({ pos: pos + 1, ids: branches[i], ctx: newCtx });
    }
  }
}
function compactTree(metadata) {
  var revs = [];
  traverseRevTree(metadata.rev_tree, function(isLeaf, pos, revHash, ctx, opts) {
    if (opts.status === "available" && !isLeaf) {
      revs.push(pos + "-" + revHash);
      opts.status = "missing";
    }
  });
  return revs;
}
function rootToLeaf(revs) {
  var paths = [];
  var toVisit = revs.slice();
  var node;
  while (node = toVisit.pop()) {
    var pos = node.pos;
    var tree = node.ids;
    var id = tree[0];
    var opts = tree[1];
    var branches = tree[2];
    var isLeaf = branches.length === 0;
    var history = node.history ? node.history.slice() : [];
    history.push({ id, opts });
    if (isLeaf) {
      paths.push({ pos: pos + 1 - history.length, ids: history });
    }
    for (var i = 0, len = branches.length; i < len; i++) {
      toVisit.push({ pos: pos + 1, ids: branches[i], history });
    }
  }
  return paths.reverse();
}
function sortByPos$1(a, b) {
  return a.pos - b.pos;
}
function binarySearch(arr, item, comparator) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = low + high >>> 1;
    if (comparator(arr[mid], item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function insertSorted(arr, item, comparator) {
  var idx = binarySearch(arr, item, comparator);
  arr.splice(idx, 0, item);
}
function pathToTree(path, numStemmed) {
  var root;
  var leaf;
  for (var i = numStemmed, len = path.length; i < len; i++) {
    var node = path[i];
    var currentLeaf = [node.id, node.opts, []];
    if (leaf) {
      leaf[2].push(currentLeaf);
      leaf = currentLeaf;
    } else {
      root = leaf = currentLeaf;
    }
  }
  return root;
}
function compareTree(a, b) {
  return a[0] < b[0] ? -1 : 1;
}
function mergeTree(in_tree1, in_tree2) {
  var queue = [{ tree1: in_tree1, tree2: in_tree2 }];
  var conflicts = false;
  while (queue.length > 0) {
    var item = queue.pop();
    var tree1 = item.tree1;
    var tree2 = item.tree2;
    if (tree1[1].status || tree2[1].status) {
      tree1[1].status = tree1[1].status === "available" || tree2[1].status === "available" ? "available" : "missing";
    }
    for (var i = 0; i < tree2[2].length; i++) {
      if (!tree1[2][0]) {
        conflicts = "new_leaf";
        tree1[2][0] = tree2[2][i];
        continue;
      }
      var merged = false;
      for (var j = 0; j < tree1[2].length; j++) {
        if (tree1[2][j][0] === tree2[2][i][0]) {
          queue.push({ tree1: tree1[2][j], tree2: tree2[2][i] });
          merged = true;
        }
      }
      if (!merged) {
        conflicts = "new_branch";
        insertSorted(tree1[2], tree2[2][i], compareTree);
      }
    }
  }
  return { conflicts, tree: in_tree1 };
}
function doMerge(tree, path, dontExpand) {
  var restree = [];
  var conflicts = false;
  var merged = false;
  var res;
  if (!tree.length) {
    return { tree: [path], conflicts: "new_leaf" };
  }
  for (var i = 0, len = tree.length; i < len; i++) {
    var branch = tree[i];
    if (branch.pos === path.pos && branch.ids[0] === path.ids[0]) {
      res = mergeTree(branch.ids, path.ids);
      restree.push({ pos: branch.pos, ids: res.tree });
      conflicts = conflicts || res.conflicts;
      merged = true;
    } else if (dontExpand !== true) {
      var t1 = branch.pos < path.pos ? branch : path;
      var t2 = branch.pos < path.pos ? path : branch;
      var diff = t2.pos - t1.pos;
      var candidateParents = [];
      var trees = [];
      trees.push({ ids: t1.ids, diff, parent: null, parentIdx: null });
      while (trees.length > 0) {
        var item = trees.pop();
        if (item.diff === 0) {
          if (item.ids[0] === t2.ids[0]) {
            candidateParents.push(item);
          }
          continue;
        }
        var elements = item.ids[2];
        for (var j = 0, elementsLen = elements.length; j < elementsLen; j++) {
          trees.push({
            ids: elements[j],
            diff: item.diff - 1,
            parent: item.ids,
            parentIdx: j
          });
        }
      }
      var el = candidateParents[0];
      if (!el) {
        restree.push(branch);
      } else {
        res = mergeTree(el.ids, t2.ids);
        el.parent[2][el.parentIdx] = res.tree;
        restree.push({ pos: t1.pos, ids: t1.ids });
        conflicts = conflicts || res.conflicts;
        merged = true;
      }
    } else {
      restree.push(branch);
    }
  }
  if (!merged) {
    restree.push(path);
  }
  restree.sort(sortByPos$1);
  return {
    tree: restree,
    conflicts: conflicts || "internal_node"
  };
}
function stem(tree, depth) {
  var paths = rootToLeaf(tree);
  var stemmedRevs;
  var result;
  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    var stemmed = path.ids;
    var node;
    if (stemmed.length > depth) {
      if (!stemmedRevs) {
        stemmedRevs = {};
      }
      var numStemmed = stemmed.length - depth;
      node = {
        pos: path.pos + numStemmed,
        ids: pathToTree(stemmed, numStemmed)
      };
      for (var s = 0; s < numStemmed; s++) {
        var rev = path.pos + s + "-" + stemmed[s].id;
        stemmedRevs[rev] = true;
      }
    } else {
      node = {
        pos: path.pos,
        ids: pathToTree(stemmed, 0)
      };
    }
    if (result) {
      result = doMerge(result, node, true).tree;
    } else {
      result = [node];
    }
  }
  if (stemmedRevs) {
    traverseRevTree(result, function(isLeaf, pos, revHash) {
      delete stemmedRevs[pos + "-" + revHash];
    });
  }
  return {
    tree: result,
    revs: stemmedRevs ? Object.keys(stemmedRevs) : []
  };
}
function merge(tree, path, depth) {
  var newTree = doMerge(tree, path);
  var stemmed = stem(newTree.tree, depth);
  return {
    tree: stemmed.tree,
    stemmedRevs: stemmed.revs,
    conflicts: newTree.conflicts
  };
}

// src/Local.js
var DOC_STORE = "docs";
var META_STORE = "meta";
var REVS_LIMIT = 1e3;
var STATUS_AVAILABLE = { status: "available" };
var STATUS_MISSING = { status: "missing" };
var encodeBase64 = (data) => btoa(String.fromCharCode(...new Uint8Array(data)));
var makeRev = (doc) => {
  const data = {};
  for (const key in doc) {
    if (key !== "_attachments" && key.startsWith("_"))
      continue;
    data[key] = doc[key];
  }
  return calculateSha1(JSON.stringify(data));
};
var calculateDigest = async (blob) => {
  const bits = await blob.arrayBuffer();
  const data = await crypto.subtle.digest("SHA-1", bits);
  const sha1 = encodeBase64(data);
  return `sha1-${sha1}`;
};
var parseRev = (rev) => {
  const [prefix, id] = rev.split("-");
  return [
    parseInt(prefix, 10),
    id
  ];
};
var revisionsToRevTree = (revisions) => {
  const pos = revisions.start - revisions.ids.length + 1;
  const revisionIds = revisions.ids;
  let ids = [
    revisionIds[0],
    STATUS_AVAILABLE,
    []
  ];
  for (let i = 1, len = revisionIds.length; i < len; i++) {
    ids = [
      revisionIds[i],
      STATUS_MISSING,
      [ids]
    ];
  }
  return [{
    pos,
    ids
  }];
};
var revTreeToRevisions = (revTree) => {
  const [{ pos, ids }] = revTree;
  const revisions = { start: pos - 1, ids: [] };
  let [id, status, childs] = ids;
  while (childs) {
    revisions.start += 1;
    revisions.ids.unshift(id);
    const child = childs[0] || [];
    id = child[0];
    status = child[1];
    childs = child[2];
  }
  return revisions;
};
var docToData = (doc) => {
  const data = {};
  for (const key in doc) {
    if (key.startsWith("_"))
      continue;
    data[key] = doc[key];
  }
  if (doc._attachments) {
    data._attachments = {};
    for (const name in doc._attachments) {
      const {
        digest,
        revpos
      } = doc._attachments[name];
      data._attachments[name] = {
        digest,
        revpos
      };
    }
  }
  return data;
};
var updateAttachmentsEntry = async (newAttachments, attachments, rev) => {
  if (!newAttachments)
    return attachments;
  for (const name in newAttachments) {
    const attachment = newAttachments[name];
    const { stub } = attachment;
    if (stub) {
      const { digest: stubDigest } = attachment;
      attachments[stubDigest].revs[rev] = true;
    } else {
      const {
        content_type,
        data
      } = attachment;
      const blob = typeof data === "string" ? base64ToBlob(data, content_type) : data;
      const digest = attachment.digest || await calculateDigest(blob);
      attachment.digest = digest;
      attachment.revpos = parseInt(rev, 10);
      attachments[digest] = {
        data: blob,
        revs: {
          [rev]: true
        }
      };
    }
  }
  return attachments;
};
var docToEntry = async (seq, doc, existingEntry, { newEdits } = { newEdits: true }) => {
  let newRevTree;
  if (newEdits) {
    const newRevId = await makeRev(doc);
    let newRevNum;
    if (doc._rev) {
      const [currentRevPos, currentRevId] = parseRev(doc._rev);
      newRevNum = currentRevPos + 1;
      newRevTree = [{
        pos: currentRevPos,
        ids: [
          currentRevId,
          STATUS_MISSING,
          [
            [
              newRevId,
              STATUS_AVAILABLE,
              []
            ]
          ]
        ]
      }];
    } else {
      newRevNum = 1;
      newRevTree = [{
        pos: 1,
        ids: [
          newRevId,
          STATUS_AVAILABLE,
          []
        ]
      }];
    }
    doc._rev = `${newRevNum}-${newRevId}`;
  } else {
    newRevTree = revisionsToRevTree(doc._revisions);
  }
  const { _id, _rev, _deleted, _attachments } = doc;
  const existingAttachments = existingEntry ? existingEntry.attachments : {};
  const attachments = await updateAttachmentsEntry(_attachments, existingAttachments, _rev);
  const data = docToData(doc);
  const existingRevTree = existingEntry ? existingEntry.rev_tree : [];
  const { tree: revTree, stemmedRevs } = merge(existingRevTree, newRevTree[0], REVS_LIMIT);
  const winningRev2 = winningRev({ rev_tree: revTree });
  const existingRevs = existingEntry ? existingEntry.revs : null;
  const revs = {
    ...existingRevs,
    [_rev]: {
      data,
      deleted: !!_deleted
    }
  };
  const deleted = revs[winningRev2].deleted;
  const revsToCompact = compactTree({ rev_tree: revTree });
  const revsToDelete = revsToCompact.concat(stemmedRevs);
  for (const rev of revsToDelete) {
    delete revs[rev];
  }
  return {
    attachments,
    deleted,
    id: _id,
    rev: winningRev2,
    rev_tree: revTree,
    revs,
    seq
  };
};
var entryToDoc = async (entry, rev, { base64 } = {}) => {
  const { id, attachments, revs, rev_tree } = entry;
  const { data } = revs[rev];
  const { _attachments } = data;
  const revisions = revTreeToRevisions(rev_tree);
  if (_attachments) {
    for (const name in _attachments) {
      const attachment = _attachments[name];
      const { digest } = attachment;
      const { data: data2 } = attachments[digest];
      attachment.content_type = data2.type;
      if (base64) {
        attachment.data = await blobToBase64(data2);
      } else {
        attachment.data = data2;
      }
      attachment.length = data2.size;
    }
  }
  return {
    _id: id,
    _rev: rev,
    _revisions: revisions,
    ...data
  };
};
var openDatabase = (id) => new Promise((resolve, reject) => {
  const openReq = indexedDB.open(id);
  openReq.onupgradeneeded = (e) => {
    const db = e.target.result;
    const keyPath = "id";
    const docStore = db.createObjectStore(DOC_STORE, { keyPath });
    docStore.createIndex("seq", "seq", { unique: true });
    db.createObjectStore(META_STORE, { keyPath });
  };
  openReq.onsuccess = (e) => {
    const db = e.target.result;
    db.onabort = () => db.close();
    db.onversionchange = () => db.close();
    let metadata;
    const transaction = db.transaction([META_STORE], "readwrite");
    transaction.oncomplete = () => resolve({ db, metadata });
    const metaStore = transaction.objectStore(META_STORE);
    metaStore.get(META_STORE).onsuccess = (e2) => {
      metadata = e2.target.result || { id: META_STORE };
      let changed = false;
      if (!("doc_count" in metadata)) {
        changed = true;
        metadata.doc_count = 0;
      }
      if (!("seq" in metadata)) {
        changed = true;
        metadata.seq = 0;
      }
      if (!("db_uuid" in metadata)) {
        changed = true;
        metadata.db_uuid = makeUuid();
      }
      if (changed) {
        metaStore.put(metadata);
      }
    };
  };
  openReq.onerror = (e) => reject(e.target.error);
  openReq.onblocked = (e) => reject(e);
});
var getEntry = (transaction, id) => new Promise((resolve, reject) => {
  transaction.objectStore(DOC_STORE).get(id).onsuccess = (e) => {
    const doc = e.target.result;
    resolve(doc);
  };
});
var getEntries = async (transaction, ids) => {
  const result = await Promise.all(ids.map((id) => getEntry(transaction, id)));
  const docs = {};
  for (const doc of result) {
    if (doc) {
      docs[doc.id] = doc;
    }
  }
  return docs;
};
var saveEntry = (transaction, doc) => new Promise((resolve, reject) => {
  transaction.objectStore(DOC_STORE).put(doc).onsuccess = () => resolve();
});
var saveEntries = (transaction, docs) => Promise.all(docs.map((doc) => saveEntry(transaction, doc)));
var saveMetadata = (transaction, metadata) => new Promise((resolve, reject) => {
  transaction.objectStore(META_STORE).put(metadata).onsuccess = () => resolve();
});
var Local = class {
  constructor({ name }) {
    this.name = name;
    this.db = null;
    this.metadata = null;
  }
  async init() {
    const { db, metadata } = await openDatabase(this.name);
    this.db = db;
    this.metadata = metadata;
  }
  getUuid() {
    const { db_uuid } = this.metadata;
    return db_uuid;
  }
  getUpdateSeq() {
    const { seq } = this.metadata;
    return seq;
  }
  async getEntry(id) {
    const transaction = this.db.transaction([DOC_STORE], "readonly");
    return getEntry(transaction, id);
  }
  async getDoc(id) {
    const transaction = this.db.transaction([DOC_STORE], "readonly");
    const entry = await getEntry(transaction, id);
    if (!entry) {
      throw new Error(`Could not find doc with id '${id}'`);
    }
    const { deleted, rev } = entry;
    if (deleted) {
      throw new Error(`Doc with id '${id}' has been deleted`);
    }
    return entryToDoc(entry, rev);
  }
  async saveDoc(doc) {
    const { _id: id } = doc;
    const getEntriesTransaction = this.db.transaction([DOC_STORE], "readonly");
    const existingEntry = await getEntry(getEntriesTransaction, id);
    const seq = ++this.metadata.seq;
    let delta;
    const entry = await docToEntry(seq, doc, existingEntry);
    if (existingEntry) {
      if (existingEntry.deleted) {
        delta = entry.deleted ? 0 : 1;
      } else {
        delta = entry.deleted ? -1 : 0;
      }
    } else {
      delta = entry.deleted ? 0 : 1;
    }
    this.metadata.doc_count += delta;
    const transaction = this.db.transaction([DOC_STORE, META_STORE], "readwrite");
    await saveEntry(transaction, entry);
    await saveMetadata(transaction, this.metadata);
  }
  async getReplicationLog(id) {
    const transaction = this.db.transaction([DOC_STORE], "readonly");
    const log = await getEntry(transaction, `_local/${id}`);
    if (log) {
      return log.data;
    }
    return {
      _id: `_local/${id}`
    };
  }
  async saveReplicationLog(log) {
    const transaction = this.db.transaction([DOC_STORE], "readwrite");
    const doc = {
      id: log._id,
      data: log
    };
    return saveEntry(transaction, doc);
  }
  async getChanges({ since, limit } = {}) {
    since = since || -1;
    limit = limit || -1;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([DOC_STORE], "readonly");
      const store = transaction.objectStore(DOC_STORE).index("seq");
      const req = store.openCursor(IDBKeyRange.lowerBound(since, true));
      const changes = [];
      let lastSeq = -1;
      let received = 0;
      req.onsuccess = (e) => {
        if (!e.target.result) {
          return;
        }
        const cursor = e.target.result;
        const doc = cursor.value;
        const { id, rev, seq, deleted } = doc;
        const change = { seq, id, changes: [{ rev }], deleted };
        changes.push(change);
        lastSeq = seq;
        received++;
        if (received !== limit) {
          cursor.continue();
        }
      };
      transaction.oncomplete = () => resolve({ changes, lastSeq });
    });
  }
  async getRevsDiff(changes) {
    const ids = Object.keys(changes);
    const transaction = this.db.transaction([DOC_STORE], "readonly");
    const existingEntries = await getEntries(transaction, ids);
    const revs = [];
    for (const id in changes) {
      for (const rev of changes[id]) {
        const existingEntry = existingEntries[id];
        const existingRev = existingEntry && rev in existingEntry.revs;
        if (existingRev)
          continue;
        revs.push({ id, rev });
      }
    }
    return revs;
  }
  async getRevs(revs) {
    const ids = revs.map(({ id }) => id);
    const transaction = this.db.transaction([DOC_STORE], "readonly");
    const existingEntries = await getEntries(transaction, ids);
    const foundRevs = [];
    for (const { id, rev } of revs) {
      if (id in existingEntries) {
        const entry = existingEntries[id];
        if (rev in entry.revs) {
          const doc = await entryToDoc(entry, rev, { base64: true });
          foundRevs.push(doc);
        }
      }
    }
    return foundRevs;
  }
  async saveRevs(revs) {
    const entries = [];
    const ids = revs.map(({ _id }) => _id);
    const getEntriesTransaction = this.db.transaction([DOC_STORE], "readonly");
    const existingEntries = await getEntries(getEntriesTransaction, ids);
    for (const rev of revs) {
      const seq = ++this.metadata.seq;
      let delta;
      const existingEntry = existingEntries[rev._id];
      const entry = await docToEntry(seq, rev, existingEntry, { newEdits: false });
      entries.push(entry);
      if (existingEntry) {
        if (existingEntry.deleted) {
          delta = entry.deleted ? 0 : 1;
        } else {
          delta = entry.deleted ? -1 : 0;
        }
      } else {
        delta = entry.deleted ? 0 : 1;
      }
      this.metadata.doc_count += delta;
    }
    const transaction = this.db.transaction([DOC_STORE, META_STORE], "readwrite");
    await saveEntries(transaction, entries);
    await saveMetadata(transaction, this.metadata);
  }
  async saveRev(rev) {
    const { _id } = rev;
    const getEntryTransaction = this.db.transaction([DOC_STORE], "readonly");
    const existingEntry = await getEntry(getEntryTransaction, _id);
    const seq = ++this.metadata.seq;
    let delta;
    const entry = await docToEntry(seq, rev, existingEntry, { newEdits: false });
    if (existingEntry) {
      if (existingEntry.deleted) {
        delta = entry.deleted ? 0 : 1;
      } else {
        delta = entry.deleted ? -1 : 0;
      }
    } else {
      delta = entry.deleted ? 0 : 1;
    }
    this.metadata.doc_count += delta;
    const transaction = this.db.transaction([DOC_STORE, META_STORE], "readwrite");
    await saveEntry(transaction, entry);
    await saveMetadata(transaction, this.metadata);
  }
};

// node_modules/multipart-related/src/first-boundary-position.js
function firstBoundaryPosition(data, boundary, offset = 0) {
  if (offset > data.length + boundary.length + 2) {
    return -1;
  }
  for (let i = offset; i < data.length; i++) {
    if (data[i] === 45 && data[i + 1] === 45) {
      let fullMatch, k;
      for (k = 0; k < boundary.length; k++) {
        fullMatch = true;
        if (data[k + i + 2] !== boundary[k]) {
          fullMatch = false;
          break;
        }
      }
      if (fullMatch)
        return i;
    }
  }
  return -1;
}

// node_modules/multipart-related/src/first-header-separator-position.js
function firstHeaderSeparatorPosition(data, offset = 0) {
  if (offset > data.length + 4) {
    return -1;
  }
  for (let i = offset; i < data.length; i++) {
    if (data[i] === 13 && data[i + 1] === 10 && data[i + 2] === 13 && data[i + 3] === 10) {
      return i;
    }
  }
  return -1;
}

// node_modules/multipart-related/src/starts-with-boundary-end.js
function startsWithBoundaryEnd(data, boundary, offset = 0) {
  if (offset > data.length + boundary.length + 4) {
    return false;
  }
  if (data[offset] !== 45)
    return false;
  if (data[offset + 1] !== 45)
    return false;
  if (data[offset + boundary.length + 2] !== 45)
    return false;
  if (data[offset + boundary.length + 3] !== 45)
    return false;
  for (let i = 0; i < boundary.length; i++) {
    if (data[i + offset + 2] !== boundary[i]) {
      return false;
    }
  }
  return true;
}

// node_modules/multipart-related/src/multipart-related-parser.js
var MultipartRelatedParser = class {
  constructor(contentType) {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    this.boundaries = [
      this.parseContentType(contentType)
    ];
  }
  parseContentType(contentType) {
    const [_, type, boundaryString] = contentType.match(/^([^;]+);\s*boundary="?([^="]+)"?/) || [];
    if (type !== "multipart/related")
      return;
    const boundary = this.encoder.encode(boundaryString);
    return {
      id: boundaryString,
      boundary
    };
  }
  parsePart(data) {
    if (this.boundaries.length === 0)
      return null;
    const { id, boundary } = this.boundaries[this.boundaries.length - 1];
    const startPosition = firstBoundaryPosition(data, boundary);
    if (startPosition === -1)
      return null;
    const contentPosition = firstHeaderSeparatorPosition(data, startPosition);
    if (contentPosition === -1)
      return null;
    const headerData = data.slice(boundary.length + 4, contentPosition);
    const header = this.decoder.decode(headerData);
    const headers = header.split("\r\n").reduce((memo, line) => {
      const [name, value] = line.split(/:\s*/);
      memo[name] = name === "Content-Length" ? parseInt(value, 10) : value;
      return memo;
    }, {});
    const { "Content-Type": contentType } = headers;
    if (!contentType)
      return null;
    const childBoundary = this.parseContentType(contentType);
    if (childBoundary) {
      this.boundaries.push(childBoundary);
      return this.parsePart(data.slice(contentPosition + 4));
    }
    const { "Content-Length": contentLength } = headers;
    const contentEndPosition = contentLength ? firstBoundaryPosition(data, boundary, contentLength + contentPosition + 6) : firstBoundaryPosition(data, boundary, contentPosition + 4);
    if (contentEndPosition === -1)
      return null;
    if (data.length < contentEndPosition - 2)
      return null;
    const isBoundaryEnd = startsWithBoundaryEnd(data, boundary, contentEndPosition);
    const endPosition = isBoundaryEnd ? contentEndPosition + boundary.length + 6 : contentEndPosition;
    const related = this.boundaries.length > 1 ? id : null;
    if (isBoundaryEnd)
      this.boundaries.pop();
    const partData = data.slice(contentPosition + 4, contentEndPosition - 2);
    const rest = data.slice(endPosition);
    return {
      related,
      headers,
      data: partData,
      rest
    };
  }
};

// node_modules/multipart-related/src/index.js
var MultipartRelated = class {
  constructor(contentType) {
    this.parser = new MultipartRelatedParser(contentType);
    this.data = new Uint8Array(0);
  }
  read(chunk) {
    if (chunk) {
      const newData = new Uint8Array(this.data.length + chunk.length);
      newData.set(this.data, 0);
      newData.set(chunk, this.data.length);
      this.data = newData;
    }
    const parts = [];
    let part;
    do {
      part = this.parser.parsePart(this.data);
      if (part) {
        const { related, headers, data, rest } = part;
        this.data = rest;
        parts.push({
          related,
          headers,
          data
        });
      }
    } while (part);
    return parts;
  }
};

// src/Remote.js
var Remote = class {
  constructor({ url, headers }) {
    this.url = url;
    this.root = url.pathname;
    this.headers = headers;
  }
  async getUuid() {
    const url = new URL(this.url);
    url.pathname = "/";
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote server not reachable");
    }
    const { uuid } = await response.json();
    return uuid;
  }
  async getUpdateSeq() {
    const url = new URL(this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Remote database not reachable");
    }
    const { update_seq } = await response.json();
    return update_seq;
  }
  async getDoc(id) {
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url);
    url.searchParams.set("attachments", "true");
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        Accept: "application/json"
      }
    });
    if (response.status !== 200) {
      throw new Error(`Could not find doc with id '${id}'`);
    }
    const doc = await response.json();
    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          content_type,
          data: data64
        } = doc._attachments[name];
        doc._attachments[name].data = base64ToBlob(data64, content_type);
      }
    }
    return doc;
  }
  async saveDoc(doc) {
    const { _id: id } = doc;
    const url = new URL(`${this.root}/${encodeURIComponent(id)}`, this.url);
    if (doc._attachments) {
      for (const name in doc._attachments) {
        const {
          data: blob
        } = doc._attachments[name];
        doc._attachments[name].data = await blobToBase64(blob);
      }
    }
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(doc)
    });
    if (response.status !== 201) {
      throw new Error(`Could not save doc '${id}'`);
    }
    return response.json();
  }
  async getReplicationLog(id) {
    const url = new URL(`${this.root}/_local/${id}`, this.url);
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status === 200) {
      return response.json();
    }
    return {
      _id: `_local/${id}`
    };
  }
  async saveReplicationLog(log) {
    const url = new URL(`${this.root}/${log._id}`, this.url);
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(log)
    });
    if (response.status !== 201) {
      throw new Error("Could not save replication log");
    }
  }
  async getChanges({ since, limit } = {}) {
    const url = new URL(`${this.root}/_changes`, this.url);
    url.searchParams.set("feed", "normal");
    url.searchParams.set("style", "all_docs");
    if (limit) {
      url.searchParams.set("limit", limit);
      url.searchParams.set("seq_interval", limit);
    }
    if (since) {
      url.searchParams.set("since", since);
    }
    const response = await fetch(url, {
      headers: this.headers
    });
    if (response.status !== 200) {
      throw new Error("Could not get changes");
    }
    const {
      results,
      last_seq: lastSeq
    } = await response.json();
    return {
      changes: results,
      lastSeq
    };
  }
  async getRevsDiff(changes) {
    const url = new URL(`${this.root}/_revs_diff`, this.url);
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(changes)
    });
    if (response.status !== 200) {
      throw new Error("Could not get revs diff");
    }
    const diff = await response.json();
    const revs = [];
    for (const id in diff) {
      const { missing } = diff[id];
      for (const rev of missing) {
        revs.push({ id, rev });
      }
    }
    return revs;
  }
  async getRevsMultipart(revs, ondoc) {
    const url = new URL(`${this.root}/_bulk_get`, this.url);
    url.searchParams.set("revs", "true");
    url.searchParams.set("attachments", "true");
    const payload = { docs: revs };
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
        "Accept": "multipart/related"
      },
      method: "post",
      body: JSON.stringify(payload)
    });
    if (response.status !== 200) {
      throw new Error("Could not get revs");
    }
    const contentType = response.headers.get("Content-Type");
    const multipart = new MultipartRelated(contentType);
    const reader = response.body.getReader();
    let currentBoundary;
    let currentParts = [];
    const decoder = new TextDecoder();
    const process = ({ value, done }) => {
      const parts = multipart.read(value);
      for (const part of parts) {
        if (!part.related) {
          const { headers, data } = part;
          const json = decoder.decode(data);
          const doc = JSON.parse(json);
          ondoc(doc);
          currentParts = [];
          currentBoundary = null;
        } else {
          if (currentBoundary && currentBoundary !== part.related) {
            const { headers, data } = currentParts.shift();
            const json = decoder.decode(data);
            const doc = JSON.parse(json);
            for (const { headers: headers2, data: data2 } of currentParts) {
              const contentDisposition = headers2["Content-Disposition"];
              if (!contentDisposition) {
                console.warn("unparsed attachment", headers2, doc, currentParts);
                continue;
              }
              const [_, filename] = contentDisposition.match(/filename="([^"]+)"/);
              const type = headers2["Content-Type"];
              const blob = new Blob([data2], { type });
              doc._attachments[filename].data = blob;
              delete doc._attachments[filename].follows;
            }
            ondoc(doc);
            currentParts = [];
          }
          currentBoundary = part.related;
          currentParts.push(part);
        }
      }
      return done || reader.read().then(process);
    };
    return reader.read().then(process);
  }
  async getRevs(revs) {
    const url = new URL(`${this.root}/_bulk_get`, this.url);
    url.searchParams.set("revs", "true");
    url.searchParams.set("attachments", "true");
    const payload = { docs: revs };
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(payload)
    });
    if (response.status !== 200) {
      throw new Error("Could not get revs");
    }
    const { results } = await response.json();
    const foundRevs = [];
    for (const { docs } of results) {
      for (const { ok } of docs) {
        foundRevs.push(ok);
      }
    }
    return foundRevs;
  }
  async saveRevs(revs) {
    const url = new URL(`${this.root}/_bulk_docs`, this.url);
    const payload = { docs: revs, new_edits: false };
    const response = await fetch(url, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(payload)
    });
    if (response.status !== 201) {
      throw new Error("Could not save revs");
    }
  }
};

// src/Replication.js
var INITIAL_CHANGES_LIMIT = 128;
var CHANGES_LIMIT = 1024;
var DATA_BATCH_SIZE = 1024;
var generateReplicationLogId = async (localId, remoteId) => {
  const text = localId + remoteId;
  return await calculateSha1(text);
};
var findCommonAncestor = (localLog, remoteLog) => {
  return localLog.session_id && localLog.session_id === remoteLog.session_id && localLog.source_last_seq && localLog.source_last_seq === remoteLog.source_last_seq ? localLog.source_last_seq : null;
};
var compareSeqs = (a, b) => {
  if (!a)
    return -1;
  if (!b)
    return 1;
  if (a === b)
    return 0;
  const aInt = parseInt(a, 10);
  const bInt = parseInt(b, 10);
  return aInt - bInt;
};
var Replication = class {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.sessionId = makeUuid();
    this.changes = [];
    this.docsWritten = 0;
    this.targetLog = null;
    this.sourceLog = null;
    this.remoteSeq = null;
    this.startSeq = null;
    this.lastSeq = null;
  }
  get name() {
    return `Replication#${this.sessionId}(${this.source.constructor.name}\u2192${this.target.constructor.name})`;
  }
  async replicate() {
    console.time(this.name);
    await this.getInfos();
    if (compareSeqs(this.startSeq, this.remoteSeq) < 0) {
      const done = await this.getChangesBatch(INITIAL_CHANGES_LIMIT);
      if (done) {
        await this.processChanges();
      } else {
        await Promise.all([
          this.getChanges(),
          this.processChanges()
        ]);
      }
      await this.storeCheckpoints();
    }
    console.timeEnd(this.name);
  }
  async getInfos() {
    const [
      localUuid,
      remoteUuid,
      remoteSeq
    ] = await Promise.all([
      this.target.getUuid(),
      this.source.getUuid(),
      this.source.getUpdateSeq()
    ]);
    this.remoteSeq = remoteSeq;
    const replicationLogId = await generateReplicationLogId(localUuid, remoteUuid);
    const [
      targetLog,
      sourceLog
    ] = await Promise.all([
      this.target.getReplicationLog(replicationLogId),
      this.source.getReplicationLog(replicationLogId)
    ]);
    this.targetLog = targetLog;
    this.sourceLog = sourceLog;
    this.startSeq = findCommonAncestor(targetLog, sourceLog);
  }
  async storeCheckpoints() {
    if (this.lastSeq !== this.startSeq) {
      this.sourceLog.session_id = this.sessionId;
      this.sourceLog.source_last_seq = this.lastSeq;
      this.targetLog.session_id = this.sessionId;
      this.targetLog.source_last_seq = this.lastSeq;
      await Promise.all([
        this.target.saveReplicationLog(this.targetLog),
        this.source.saveReplicationLog(this.sourceLog)
      ]);
    }
  }
  async getChanges() {
    let done;
    do {
      done = await this.getChangesBatch();
    } while (!done);
  }
  async getChangesBatch(limit = CHANGES_LIMIT) {
    const { changes, lastSeq } = await this.source.getChanges({
      since: this.lastSeq || this.startSeq,
      limit
    });
    this.lastSeq = lastSeq;
    this.changes.push(...changes);
    return compareSeqs(lastSeq, this.remoteSeq) >= 0 || changes.length < limit;
  }
  async processChanges() {
    let done;
    do {
      done = await this.processChangesBatch();
    } while (!done);
  }
  async processChangesBatch(batchSize = DATA_BATCH_SIZE) {
    const batchOfChanges = this.changes.splice(0, batchSize);
    const revs = {};
    for (const { id, changes } of batchOfChanges) {
      revs[id] = changes.map(({ rev }) => rev);
    }
    const diffs = await this.target.getRevsDiff(revs);
    if (diffs.length > 0) {
      await this.source.getRevsMultipart(diffs, async (doc) => {
        await this.target.saveRev(doc);
        this.docsWritten++;
      });
    }
    return this.changes.length === 0;
  }
};

// src/Microcouch.js
var Microcouch = class extends EventTarget {
  constructor({ name, url, headers }) {
    super();
    this.local = new Local({ name });
    this.remote = new Remote({ url, headers });
    this.changeEvent = new Event("change");
  }
  init() {
    return this.local.init();
  }
  getChanges({ since, limit } = {}) {
    return this.local.getChanges({ since, limit });
  }
  getDoc(id) {
    return this.local.getDoc(id);
  }
  async saveDoc(doc) {
    const response = await this.local.saveDoc(doc);
    this.push();
    this.dispatchEvent(this.changeEvent);
    return response;
  }
  async pull() {
    const replication = new Replication(this.remote, this.local);
    await replication.replicate();
    if (replication.docsWritten > 0) {
      this.dispatchEvent(this.changeEvent);
    }
  }
};
export {
  Microcouch as default
};
