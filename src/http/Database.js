import HttpAdapter from './Adapter.js'

const decodeBase64 = (base64) => {
  var i, d = atob(base64.trim()), b = new Uint8Array(d.length);
  for (i = 0; i < d.length; i++)
    b[i] = d.charCodeAt(i);
  return b.buffer;
}

const encodeBase64 = (data) => btoa(String.fromCharCode(...new Uint8Array(data)))

export default class HttpDatabase {
  constructor(url, { headers } = {}) {
    this.adapter = new HttpAdapter(url, { headers })
  }

  async getUuid() {
    const { uuid } = await this.adapter.getServerInfo()
    return uuid
  }

  getChangesStream(since, { limit } = {}, stats = {}) {
    const adapter = this.adapter
    return new ReadableStream({
      async pull(controller) {
        const response = await adapter.getChanges(since, { limit });
        const { results, last_seq: lastSeq, pending } = await response.json();
        since = lastSeq;
        const changes = [];
        for (const { id, doc, changes: revs } of results) {
          const revisionOneDoc = doc && parseInt(doc._rev, 10) === 1 ? doc : null;
          if (revisionOneDoc) {
            revisionOneDoc._revisions = {
              start: 1,
              ids: [doc._rev.split("-")[1]]
            };
            if (revisionOneDoc._attachments) {
              for (const name in revisionOneDoc._attachments) {
                const attachment = revisionOneDoc._attachments[name];
                const { data } = attachment;
                attachment.data = decodeBase64(data);
              }
            }
          }
          changes.push({
            id,
            revs: revs.map(({ rev }) => {
              const doc2 = revisionOneDoc && revisionOneDoc._rev === rev ? revisionOneDoc : null;
              return {
                rev,
                doc: doc2
              };
            })
          });
        }
        controller.enqueue({ changes, lastSeq });
        if (pending === 0) {
          controller.close();
        }
      }
    });
  }
  async getDiff(changes) {
    if (changes.length === 0)
      return [];
    const payload = {};
    for (const { id, revs } of changes) {
      payload[id] = revs.map(({ rev }) => rev);
    }
    if (Object.keys(payload).length === 0)
      return [];
    const response = await this.adapter.revsDiff(payload);
    const diff = await response.json();
    return changes.filter(({ id, revs }) => id in diff).map(({ id, revs }) => ({
      id,
      revs: revs.filter(({ rev }) => diff[id].missing.indexOf(rev) > -1),
      attsSince: diff[id].possible_ancestors
    }));
  }
  async getRevs(changes) {
    if (changes.length === 0)
      return changes;
    const docs = [];
    const changesById = {};
    for (const row of changes) {
      const { id, revs, attsSince } = row;
      changesById[id] = row;
      for (const { rev, doc } of revs) {
        if (!doc) {
          docs.push({ id, rev, atts_since: attsSince });
        }
      }
    }
    if (docs.length === 0)
      return changes;
    const response = await this.adapter.bulkGet(docs);
    const { results } = await response.json();
    for (const { id, docs: docs2 } of results) {
      if (!(id in changesById)) {
        console.log(r);
        throw new Error("recived doc which we did not ask for");
      }
      const byRev = {};
      for (const { ok: doc } of docs2) {
        byRev[doc._rev] = doc;
        if (doc._attachments) {
          for (const name in doc._attachments) {
            const attachment = doc._attachments[name];
            const { data } = attachment;
            if (data) {
              attachment.data = decodeBase64(data);
            }
          }
        }
      }
      const row = changesById[id];
      for (const rev of row.revs) {
        if (rev.rev in byRev) {
          rev.doc = byRev[rev.rev];
        }
      }
    }
    return changes;
  }
  async saveRevs(changes) {
    if (changes.length === 0)
      return changes;
    const revs = changes.reduce((memo, { revs: revs2 }) => memo.concat(revs2.map(({ doc }) => doc)), []);
    if (revs.length === 0)
      return changes;
    for (const doc of revs) {
      if (doc._attachments) {
        for (const name in doc._attachments) {
          const attachment = doc._attachments[name];
          const { data } = attachment;
          if (!data)
            continue;
          attachment.data = encodeBase64(data);
        }
      }
    }
    const response = await this.adapter.bulkDocs(revs);
    return response.json();
  }
}
