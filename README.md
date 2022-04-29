# Microcouch
A minimal Pouch-like implementation of a CouchDB compatible in-browser couch. Basically this is for educational purpose by now. I already learned a lot.

**Disclaimer:** Microcouch is an absolute beta version, which currently serves more for educational purposes. I'm experimenting with various optimizations here to speed up replication.

Data model compatible to PouchDBs experimental `indexeddb` adapter. It uses PouchDBs [pouchdb-merge](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-merge) module.

Focus is on a small set of functionality:
* replication
* get/save single docs and in bulk
* get by id range (like allDocs)
* changes feed
* no map/reduce
* attachment support
* indexeddb only
* modern browsers (also no node support)
* modern web standards
* embrace es6
* as few dependencies as possible


## State of Work
Pull replication works

Left to do:
* push replication
* replication log history
* implement `getDoc(id)`, `saveDoc(doc)`, `getDocs(range)`


## Usage
Place `dist/microcouch.js` into your served directory. Then:

```html
<!-- include a web stream polyfill -->
<script src=//unpkg.com/@stardazed/streams-polyfill@2.4.0/dist/sd-streams-polyfill.min.js></script>
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

Note how you can use a webstream polyfill to make it work in more browsers.


## Replication Performance
I am documenting performance metrics and compare them to PouchDB, while I'm iterating over the code. I am testing on Chrome.

### 1. Using Inline Attachments
At first I implemented replication by fetching attachments as base64 aka inline attachments:

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* PouchDB: 25.36s, 3.2MB transferred, 2.5MB resources loaded
* Microcouch: 4.63s, 2.0MB transferred, 1.9MB resources loaded

**Diff: 18.26%**

PouchDB failed to sync multiple times, after reducing batch size to 64 it worked.

#### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
Perf test done with a batch size of 512:

* PouchDB: 22.23m, 182MB transferred, 4845MB resources loaded 
* Microcouch: 5.36m, 181MB transferred, 4827MB resources loaded

**Diff: 24.09%**


### 2. Using multipart/related
CouchDBs `_bulk_get` API supports fetching docs and their attachments in one go with a `multipart/related` response. I've [written a parser](https://github.com/jo/multipart-related) to handle such responses in the browser in an efficient way. Probably that needs further improvements.

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* Microcouch: 5.48s, 3.0MB transferred, 2.8MB resources loaded

**Diff: 21.61%**

#### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
uuuh oh, that does not seem to work anymore. Performance freaks out as it seems. Probably this is on the indexeddb side. Will investigate.


### 3. Streaming approach
Implemented `multipart/related` replication with a streaming approach. That works like a charm. It is a little slower, probably due to the very small attachment sizes.

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* Microcouch: 5.63s, 3.1MB transferred, 2.9MB resources loaded

**Diff: 22.20%**

#### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
* Microcouch: 7.71m, 4960MB transferred, 4974MB resources loaded

(we see a huge amount of transferred data, which come from the fact that gzip encoding was not configured for multipart/related responses)

**Diff: 34.67%**


### 4. Using Compression
We can improve a little further by sending gzip encoded responses, and configure the server to serve compressed content.

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* Microcouch: 4.42s, 1.1MB transferred, 2.9MB resources loaded

**Diff: 17.42%**

#### Replicating a big 0.6GB database of 46832 documents with a sec of 53841.
* Microcouch: 6.93m, 320MB transferred, 5011MB resources loaded

**Diff: 31.17%**



(c) 2022 Johannes J. Schmidt
