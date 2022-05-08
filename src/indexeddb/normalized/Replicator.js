import FlatReplicator from '../flat/Replicator.js'

export default class Replicator extends FlatReplicator {
  getInfo () {
    const { uuid } = this.adapter.metadata
    // TODO: return update seq
    return {
      uuid
    }
  }
}
