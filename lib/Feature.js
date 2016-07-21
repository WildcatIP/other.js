const EventEmitter = require('events');

class Command extends EventEmitter {}

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
