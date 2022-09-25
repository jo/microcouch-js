import { winningRev as calculateWinningRev, merge, compactTree, rootToLeaf } from 'pouchdb-merge'

import SparkMD5 from 'spark-md5'

const REVS_LIMIT = 1000
const STATUS_AVAILABLE = { status: 'available' }
const STATUS_MISSING = { status: 'missing' }

const makeRev = data => SparkMD5.hash(JSON.stringify(data))

const parseRev = rev => {
  const [prefix, id] = rev.split('-')
  return [
    parseInt(prefix, 10),
    id
  ]
}

const extractData = doc => {
  const data = {}
  for (const key in doc) {
    if (key.startsWith('_')) continue
    data[key] = doc[key]
  }
  if (doc._attachments) {
    data._attachments = {}
    for (const name in doc._attachments) {
      const { digest, revpos } = doc._attachments[name]
      data._attachments[name] = {
        digest,
        revpos
      }
    }
  }
  return data
}

const revisionsFromRevTree = (rev, tree) => {
  const splittedRev = rev.split('-')
  const revNo = parseInt(splittedRev[0], 10)
  const revHash = splittedRev[1]

  const paths = rootToLeaf(tree)
  let path = null

  for (var i = 0; i < paths.length; i++) {
    const currentPath = paths[i]
    const hashIndex = currentPath.ids.map(({ id }) => id)
      .indexOf(revHash)
    const hashFoundAtRevPos = hashIndex === (revNo - 1)

    if (hashFoundAtRevPos || (!path && hashIndex !== -1)) {
      path = currentPath
    }
  }

  if (!path) {
    throw new Error('invalid rev tree')
  }

  const indexOfRev = path.ids.map(({ id }) => id).indexOf(revHash) + 1
  const howMany = path.ids.length - indexOfRev
  path.ids.splice(indexOfRev, howMany)
  path.ids.reverse()


  return {
    start: (path.pos + path.ids.length) - 1,
    ids: path.ids.map(({ id }) => id)
  }
}


export const buildEntry = id => ({
  id,
  tree: [],
  attachments: {},
  revs: {}
})

export const updateEntry = (entry, revs, { newEdits }) => {
  for (const { doc } of revs ) {
    const { _id, _rev, _deleted, _attachments, _revisions } = doc

    // extract pure doc data
    const data = extractData(doc)

    // build new revision tree
    let newRev
    let newRevPos
    let newRevTree
    if (!newEdits) {
      if (!_revisions) {
        throw new Error('missing _revisions')
      }

      newRevPos = _revisions.start
      const pos = newRevPos - _revisions.ids.length + 1
      let ids = [
        _revisions.ids[0],
        STATUS_AVAILABLE,
        []
      ]
      for (let i = 1, len = _revisions.ids.length; i < len; i++) {
        ids = [
          _revisions.ids[i],
          STATUS_MISSING,
          [ids]
        ]
      }

      newRev = _rev
      newRevTree = [{
        pos,
        ids
      }]
    } else {
      // create a new revision
      const newRevId = makeRev({ ...data, _id, _rev, _deleted })

      // first writes after a deletion gets reattached to last deleted tree
      const shouldReattach = newEdits && entry.deleted
      if (_rev || shouldReattach) {
        const baseRev = shouldReattach ? entry.rev : _rev
        const [currentRevPos, currentRevId] = parseRev(baseRev)
        newRevPos = currentRevPos + 1
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
        }]
      } else {
        newRevPos = 1
        newRevTree = [{
          pos: 1,
          ids : [
            newRevId,
            STATUS_AVAILABLE,
            []
          ]
        }]
      }
      
      newRev = `${newRevPos}-${newRevId}`
    }

    // merge tree
    const { tree, stemmedRevs } = merge(entry.tree, newRevTree[0], REVS_LIMIT)
    entry.tree = tree

    // store rev
    entry.revs[newRev] = {
      data,
      deleted: !!_deleted
    }
    
    // calculate winning rev
    const winningRev = calculateWinningRev({ rev_tree: tree })
    entry.rev = winningRev
    entry.deleted = entry.revs[winningRev].deleted

    // store new attachments
    if (_attachments) {
      for (const name in _attachments) {
        const attachment = _attachments[name]
        const {
          stub,
          data: arrayBuffer,
          content_type: contentType,
          digest
        } = attachment
        if (!digest) {
          throw new Error('missing attachment digest')
        }
        if (stub) {
          if (!(digest in entry.attachments)) {
            throw new Error('missing attachment data for stub')
          }
          entry.attachments[digest].revs[newRev] = true
          // TODO: if attachment is saved with stubs true
          // the revpos can be undefined :/
        } else {
          if (digest in entry.attachments) {
            entry.attachments[digest].revs[newRev] = true
          } else {
            data._attachments[name].revpos = newRevPos
            entry.attachments[digest] = {
              data: arrayBuffer,
              contentType,
              revs: {
                [newRev]: true
              }
            }
          }
        }
      }
    }

    // compact revs
    const revsToCompact = compactTree({ rev_tree: tree })
    const revsToDelete = revsToCompact.concat(stemmedRevs)
    for (const rev of revsToDelete) {
      delete entry.revs[rev]
      // compact attachments
      // TODO
      // for (const digest in entry.attachments) {
      //   const revs = entry.attachments[digest].revs
      //   delete revs[rev]
      //   if (Object.keys(revs).length === 0) {
      //     delete entry.attachments[digest]
      //   }
      // }
    }
  }

  // store available revs for revs index
  entry.available = Object.keys(entry.revs).map(rev => [entry.id, rev])

  return entry
}

export const docFromEntry = ({ id, tree, revs, attachments }, rev, { attsSince } = {}) => {
  if (!(rev in revs)) {
    throw new Error(`rev not found: '${id}@${rev.rev}'`)
  }

  const { data, deleted } = revs[rev]

  // build _revisions
  const _revisions = revisionsFromRevTree(rev, tree)

  // attachments
  if (data._attachments) {
    for (const name in data._attachments) {
      const attachment = data._attachments[name]

      const { revs } = attachments[attachment.digest];
      const includeAttachment = !attsSince || attsSince.find(rev => !(rev in revs));
      if (includeAttachment) {
        const { data: arrayBuffer, contentType } = attachments[attachment.digest];
        attachment.data = arrayBuffer;
        attachment.content_type = contentType;
        attachment.length = arrayBuffer.length;
      } else {
        attachment.stub = true;
      }
    }
  }

  return {
    ...data,
    _id: id,
    _rev: rev,
    _deleted: deleted,
    _revisions
  }
}

export const changeFromEntry = ({ id, tree, revs, attachments, rev, seq, deleted }) => {
  const paths = rootToLeaf(tree)
  const changes = paths
    .map(({ pos, ids }) => {
      const rev = `${pos + ids.length - 1}-${ids.pop().id}`
      return {
        rev
      }
    })

  return {
    seq,
    id,
    changes,
    deleted
  }
}
