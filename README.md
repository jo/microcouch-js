# Microcouch
A minimal Pouch-like implementation of a CouchDB compatible in-browser couch. Data model compatible to PouchDBs experimental `indexeddb` adapter.

Basically this is for educational purpose by now. I already learned a lot.

Focus on a small set of functionality:
* replication
* get/save doc
* bulk docs
* all docs
* changes
* no MR
* small attachments
* indexeddb only
* js modules, no build tool
* specific functions, few options only


## State of Work
Basic functionality works

Left to do:
* use md5 for digesting and revs and replication logs
* implement `getDocs` and `saveDocs`

## Usage
Place `microcouch.js` and `pouchdb-merge.js` into your served directory. Then:

```html
<script type=module>
  import Microcouch from './microcouch.js'

  const mc = new Microcouch({
    name: 'rouch-test',
    url: new URL('https://couch.example.com/my-couch-db'),
    headers: {
      Authorization: 'Basic ' + btoa('username:password')
    }
  })

  mc.addEventListener('change', () => console.log('local database changed'))

  const run = async () => {
    await mc.init()
    await mc.pull()
    await mc.saveDoc({ _id: 'mydoc', awesome: '2000' })
    await mc.push()
  }

  run()
</script>
```

## Replication can be so fast

Replicating a 1.5MB database with 2326 tiny docs each with very small attachments:
* PouchDB: 25355.89ms 25.36s, 3.2MB transferred, 2.5MB resources loaded
* Microcouch: 4629.26ms 4.63s, 2.0MB transferred, 1.9MB resources loaded
PouchDB failed to fetch multiple times, after reducing batch size to 64 it worked.

**Diff: 18.26%**

Replicating a big 0.6GB database of 46832 documents with a sec of 53841. Perf test done with a batch size of 512.
* PouchDB:   1333907.96ms 1333.90s 22.23m, 182MB transferred, 4845MB resources loaded 
* Microcouch: 321340.67ms  321.34s  5.36m, 181MB transferred, 4827MB resources loaded

**Diff: 24.09%**

(c) 2022 Johannes J. Schmidt
