/** @module other */

const EventEmitter = require('events');

/** @inheritdoc */
class Command extends EventEmitter {}

/**
 * A unit of possibly third-party code which extends Other Chat functionality.
 */
class Feature {
  constructor({id}) {
    this._id = id;
    console.log(id);
  }

  command() {
    return new Command();
  }
}

module.exports = Feature;
