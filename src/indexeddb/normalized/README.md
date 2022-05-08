# IndexedDB Database
Works against IndexedDB. Normalized schema.

## Tables

* seqs
* docs
* revs
* attachments

## Operations

* revs diff: does an id/rev exist?
get id/rev from revs

* list changes
get seqs

* insert doc normal
build doc, insert rev, insert attachments, insert seq, insert doc

* insert doc replication

* get doc
get doc, get rev/attachment


## Seqs
```js
db.createObjectStore('seqs', { autoIncrement: true })
{
  key: 1,
  value: {
    id: 'mydoc',
    rev: '1-f9f5365ff56c60e1ee990107f4e567c5'
  }
}
```

## Docs
```js
db.createObjectStore('docs', { keyPath : 'id' })
{
  key: 'mydoc',
  value: {
    id: 'mydoc',
    rev: '1-f9f5365ff56c60e1ee990107f4e567c5',
    tree: [],
    // THINK: store revpos here in order to make it better compactable
    attachmentsRevPos: {
      'md5-d2vN4UoU3diP+PsWwm7Zsw==': 1
    }
  }
}
```

## Revs
```js
db.createObjectStore('revs', { keyPath : ['id', 'rev'] })
{
  key: [
    'mydoc',
    '1-f9f5365ff56c60e1ee990107f4e567c5'
  ],
  value: {
    id: 'mydoc',
    rev: '1-f9f5365ff56c60e1ee990107f4e567c5',
    data: {
      _attachments: {
        README: 'md5-d2vN4UoU3diP+PsWwm7Zsw=='
      }
    }
  }
}
```

## Attachments

```js
db.createObjectStore('attachments', { keyPath : ['id', 'name', 'digest'] })
{
  key: [
    'mydoc',
    'README',
    'md5-d2vN4UoU3diP+PsWwm7Zsw=='
  ],
  value: {
    id: 'mydoc',
    name: 'README',
    digest: 'md5-d2vN4UoU3diP+PsWwm7Zsw==',
    blob: Blob
    // THINK: about storing revpos here?
  }
}
```

