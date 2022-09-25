# Microcouch JavaScript
A minimal Pouch-like implementation of a CouchDB compatible in-browser couch. Basically this is for educational purpose by now. I already learned a lot.

**Disclaimer:** Microcouch is an absolute beta version, which currently serves more for educational purposes. I'm experimenting with various optimizations here to speed up replication. You probably want to use [PouchDB](https://pouchdb.com/) instead.

Data model is the same as PouchDBs new `indexeddb` adapter.

Microcouch uses PouchDBs [pouchdb-merge](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-merge) module.

Focus is on a small set of functionality:
* plan replication (no filters)
* get/save single docs and in bulk
* get by id range (like allDocs)
* changes feed
* attachment support (array buffer only, no base64)
* modern js standards, es6
* modern browsers (also no node support)
* as few dependencies as possible
* indexeddb and http only
* support latest CouchDB only (3.2)
* streams
* no map/reduce


Microcouch is quiet small, currently less than 30kB minified. It is about five times smaller and replicates almost ten times faster than PouchDB, depending on the document structure.


## State of Work
* Replication (`push` 'n' `pull` 'n' `sync`)
* basic doc (`getDoc`, `saveDoc`, `deleteDoc`, `getLocalDoc`, `saveLocalDoc`)
* bulk docs (`getDocs`, `getDocsStream`, `updateDocs`)


## Usage
Place `dist/Microcouch.js` into your served directory. Then:

```html
<script type=module>
  import Microcouch from './Microcouch.js'

  const mc = new Microcouch(new URL('https://couch.example.com/mydb'), {
    headers: {
      Authorization: 'Basic ' + btoa('username:password')
    }
  })

  mc.sync()
</script>
```


(c) 2022 Johannes J. Schmidt
