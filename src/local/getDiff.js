class GetDiffsTransformStream extends TransformStream {
  constructor (db) {
    super({
      start () {},

      async transform (batch, controller) {
        const revs = {}

        for (const { id, changes } of batch) {
          revs[id] = changes.map(({ rev }) => rev)
        }

        return new Promise((resolve, reject) => {
          const store = db.getDocStore('readonly')

          let cnt = Object.keys(revs).length
          for (const id in revs) {
            store.get(id).onsuccess = e => {
              cnt--
              const entry = e.target.result
              for (const rev of revs[id]) {
                const isPresent = entry && rev in entry.revs
                if (!isPresent) {
                  controller.enqueue({ id, rev })
                }
              }
              if (cnt === 0) {
                resolve()
              }
            }
          }
        })
      },
      
      flush () {}
    })
  }
}

export default function getDiff (db) {
  return new GetDiffsTransformStream(db)
}
