# Microcouch JavaScript
A minimal Pouch-like implementation of a CouchDB compatible in-browser couch. Basically this is for educational purpose by now. I already learned a lot.

**Disclaimer:** Microcouch is an absolute beta version, which currently serves more for educational purposes. I'm experimenting with various optimizations here to speed up replication. You probably want to use [PoouchDB](https://pouchdb.com/) instead.

This also acts as a design study for the [Rust Microcouch](https://github.com/jo/microcouch-rs).

Data model similar to the one used in PouchDBs new `indexeddb` adapter.

Microcouch uses PouchDBs [pouchdb-merge](https://github.com/pouchdb/pouchdb/tree/master/packages/node_modules/pouchdb-merge) module.

Focus is on a small set of functionality:
* streaming replication
* get/save single docs and in bulk
* get by id range (like allDocs)
* changes feed
* attachment support (blob only, no base64)
* modern web standards,  embrace es6
* modern browsers (also no node support)
* as few dependencies as possible
* indexeddb and http only
* support latest CouchDB only (3.2)
* no map/reduce


## State of Work
* Replication works (push 'n' pull, sync)
* basic doc api (`getDoc`, `saveDoc`, `deleteDoc`)

Left to do:
* replication log history
* implement `getDocs(range)`


Microcouch is quiet small, currently less than 30kB minified.

## Usage
Place `dist/microcouch.js` into your served directory. Then:

```html
<script type=module>
  import { IndexedDbFlatDatabase, HttpInlineDatabase } from './microcouch.js'

  const local = new IndexedDbFlatDatabase({ name: 'mydb' })
  const remote = new HttpInlineDatabase({
    url: new URL('https://couch.example.com/mydb'),
    headers: {
      Authorization: 'Basic ' + btoa('username:password')
    }
  })

  const run = async () => {
    await local.init()
    await local.pull(remote)
  }

  run()
</script>
```

### WebStream Polyfill
It is recommended to polyfill WebStreams as they're not supported fully on all browsers yet.

I'd recommend [Stardazed Web Streams Implementation](https://github.com/stardazed/sd-streams), which also comes with a [CompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream) and DecompressionStream polyfills. This is needed for the (experimental) HttpMultipartDatabase. If you're using HttpInlineDatabase you don't need DecompressionStream and can use a different polyfill.

```html
<script src=//unpkg.com/@stardazed/streams-polyfill@2.4.0/dist/sd-streams-polyfill.min.js></script>
```

### CouchDB CORS Configuration
You'll need to configure CORS headers to allow `Content-Encoding`, which is needed for gzipped requests:
```ini
[cors]
headers = accept, authorization, content-type, origin, referer, content-encoding
```

### Enable gzip Compression on your Proxy
To reduce bandwidth, I'd really recommend to enable gzip compression for all content types, or at least for `application/json` and `multipart/related` requests.

For Nginx you can enable gzip like this:
```
location / {
  proxy_pass http://localhost:5984;

  gzip on;
  gzip_types *;
  gzip_proxied any;

  proxy_redirect off;
  proxy_buffering off;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```


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

Since the compression gain is quiet low I removed it. Therefore you don't need to include the DecompressionStream polyfill.

### 5. Comparing Pouch's `indexeddb` and `idb` Adapter
Enabled gzip compression on the server and ran again. This time it was much slower on Pouch, probably due to changed load on the server (which is a tiny Hetzner CX11 instance).

#### Replicating a 1.5MB database with 2326 tiny docs each with very small attachments
* PouchDB `indexeddb`: 42.71s, 1.6MB transferred, 2.5MB resources loaded, 4591 requests
* PouchDB `idb`: 40.87s, 1.6MB transferred, 2.5MB resources loaded, 4591 requests
* Microcouch: 6.06s, 1.5MB transferred, 2.7MB resources loaded, 14 requests

`indexeddb` is a tiny little bit slower here.

**Diff: 14.19% in Microcouch vs `indexeddb` adapter**

### 6. Back to Inline Attachments
Due to the lack of a multipart `_bulk_docs` api, I switched back to inline attachments, also since this matches the goal of the project (small attachments) and is faster for such. Also, I removed request body zipping, because the performance gain was very low and now you don't have to include a DecompressionStream polyfill anymore.


(c) 2022 Johannes J. Schmidt
