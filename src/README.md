# Base Database Class
These are classes to be extended in the specific database classes. Consists of

* Database
* Replicator

There are two primary implementations, one for http and one for IndexedDB:

* [http/inline](./http/inline)
* [indexeddb/flat](./indexeddb/flat)

which I am mainly focusing. There is also a fake adapter, to test replication agains:

* [fake](./fake)

as well as experimental and possibly unmaintained versions:

* [http/multipart](./http/multipart)
* [indexeddb/normalized](./indexeddb/normalized)

Those are not exported in the bundle, and are meant for testing and performance checking mainly.


## Objects & Terminology
Replication utilizes Streams, and the stream events are streamlined across the different transform streams.

* `doc` is referred to a couch db document
* `data` is the user data inside a doc (without underscore properties, except attachment stubs) - TBD
* `entry` is the internal representation of a doc and its tree

* `revs` consists of an id and one or more revs
```js
{
  id: `id of the document`,
  revs: [
    {
      rev
      doc // optional
    }
  ]
}
```

## Database

### `init()`
### `destroy()`

### `getChanges()`

### `getDoc(id)`
### `saveDoc(doc)`
### `deleteDoc(doc)`

### `getDocs(range)`

### `pull(other)`
### `push(other)`
### `sync(other)`


## Replicator
API used by push, pull and sync.

Basically, this is how a replication stream works (pseudo code, actually needs to handle async etc):
```js
source.getChanges()
  .pipeThrough(target.getDiff())
  .pipeThrough(source.getRevs())
  .pipeTo(target.saveRevs())
```

### `getInfo()`
Returns information about the database:
```js
{
  uuid: '<database uuid>',
  lastSeq: '<last update sequence>'
}
```

### `getLog(id)`
Retrieves replication log:
```js
{
  _id: '_local/<replication id>',
  _rev: '<revision of the log document>',
  sessionId: '<session id of the last replication session>',
  sourceLastSeq: '<update seq of last replication>',
  // TODO: think about storing targetLastSeq - could it make diff faster?
  history: [] // TODO
}
```

### `saveLog(log)`
Saves the replication log.

### `getChanges()`
Returns a ReadableStream emitting changes:

```js
{
  id: '<id of the document>',
  revs: [
    {
      rev: '<revision of change>'
    }
  ], // array of changed revisions
}
```

### `getDiff()`
Returns a TransformStream filtering revisions which are missing on the target. Input is a batch of changes.

```js
{
  id: `id of the document`,
  revs: [
    {
      rev: '<revision of missing change>'
    }
  ] // array of the revs which are missing on the target
}
```

### `getRevs()`
Returns a TransformStream containing the revisions. Input is a batch of filtered changes.

```js
{
  id: `id of the document`,
  revs: [
    {
      rev: '<revision of missing change>'
      doc: {
        _id,
        _rev,
        _revisions,
        _conflicts // TODO,
        ...data
      }
    }
  ]
}
```

### `saveRevs()`
Returns a WritableStream saving revisions to source. Input is a batch of revisions.
