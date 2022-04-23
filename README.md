# Microcouch
A minimal Pouch-like implementation of a CouchDB compatible in-browser couch. Basically this is for educational purpose by now. I already learned a lot.

**Disclaimer:** Microcouch is an absolute beta version, which currently serves more for educational purposes. I'm experimenting with various optimizations here to speed up replication. However, I still dream of developing this further over time to have a lightweight alternative for Pouch.

Data model compatible to PouchDBs experimental `indexeddb` adapter. It uses the great [pouchdb-merge](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-merge) module.

My focus is on a small set of functionality:
* replication
* get/save single doc
* get/save in bulk
* get by id range
* changes feed
* no map reduce
* attachments
* indexeddb only
* modern browsers only (also no node support)


## State of Work
Basic functionality works

Left to do:
* push replication
* replication log history
* use md5 for digesting and revs and replication logs
* implement `getDocs` and `saveDocs`


## Usage
Place `dist/microcouch.js` into your served directory. Then:

```html
<script type=module>
  import Microcouch from './microcouch.js'

  const mc = new Microcouch({
    name: 'microcouch-test',
    url: new URL('https://couch.example.com/my-couch-db'),
    headers: {
      Authorization: 'Basic ' + btoa('username:password')
    }
  })

  const run = async () => {
    await mc.init()
    await mc.pull()
  }

  run()
</script>
```

## Replication can be so fast
Basically due to the use of inline attachment fetching via `_bulk_get` this is about 4-5 times faster than PouchDB:

### 1. Using Inline Attachments
At first I implemented replication by fetching attachments as base64 aka inline attachments:

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* PouchDB: 25.36s, 3.2MB transferred, 2.5MB resources loaded
* Microcouch: 4.63s, 2.0MB transferred, 1.9MB resources loaded

**Diff: 18.26%**

PouchDB failed to sync multiple times, after reducing batch size to 64 it worked.

### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
Perf test done with a batch size of 512:

* PouchDB: 22.23m, 182MB transferred, 4845MB resources loaded 
* Microcouch: 5.36m, 181MB transferred, 4827MB resources loaded

**Diff: 24.09%**

### 2. Using multipart/related
CouchDBs `_bulk_get` API supports fetching docs and their attachments in one go with a `multipart/related` response. I've [written a parser](https://github.com/jo/multipart-related) to handle such responses in the browser in an efficient way. Probably that needs further improvements.

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* PouchDB: 25.36s, 3.2MB transferred, 2.5MB resources loaded
* Microcouch: 5.48s, 3.0MB transferred, 2.8MB resources loaded

**Diff: uses 21.61% of the time PouchDB needs**

### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
uuuh oh, that does not seem to work anymore. Performance freaks out as it seems. Probably this is on the indexeddb side. Will investigate.


## Test
No tests, sorry. I wish we would have a outside couch test suite, where we can test various implementations agains. It could work via replicating a known source db back and forth and checking the result. Maybe also doing some pre-defined doc updates.


(c) 2022 Johannes J. Schmidt
