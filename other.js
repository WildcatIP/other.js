/** @module other */

const EventEmitter = require('events')

/** @inheritdoc */
class Channel extends EventEmitter {
 // TODO: Implement me.
}

/** @inheritdoc */
class Account extends EventEmitter {
 // TODO: Implement me.
}

/** @inheritdoc */
class Identity extends EventEmitter {
  // TODO: Implement me.
}

/**
 * An interface for Features to interact with the chatternet.
 *
 * @inheritdoc
 */
class Chatternet extends EventEmitter {
  /**
   * @param {Object} args - destructured args.
   * @param {string} args.identity - Scope for chatternet interactions.
   */
  constructor({identity}) {
    super()
  }

  /** @return {Channel} The channel associated witht he given id or else null if it doesn't exist. */
  channel({id}) {
    return new Channel() // TODO: Implement me.
  }

  /** @return {Account} The account associated witht he given id or else null if it doesn't exist. */
  account({id}) {
    return new Account() // TODO: Implement me.
  }

  /** @return {Identity} The identity associated witht he given id or else null if it doesn't exist. */
  identity({id}) {
    return new Identity() // TODO: Implement me.
  }
}

/**
 * An interface for Features to interact with an Other Chat user agent.
 *
 * @inheritdoc
 */
class UserAgent extends EventEmitter {
  constructor() {
    super()
    this.on("SET_STAGED_MESSAGE", event => {
      console.log(`Staged message ${event.text}`)
      // TODO: Implement me
    })
  }

  /** @return {Channel} The currently active channel. */
  channel() {
    return new Channel() // TODO: Implement me.
  }

  /** @return {Account} The currently active account. */
  account() {
    return new Account() // TODO: Implement me.
  }

  /** @return {Identity} The currently active identity. */
  identity() {
    return new Identity() // TODO: Implement me.
  }

  /**
   * Navigates to the given channel id.
   *
   * @param {Object} target - The navigation target.
   * @param {string} target.channelId - The channel identifier to navigate to. May be (1) identityId for identity channels (2) channelId for standard channels or (3) lowerIdentityId:upperIdentityId for whisper channels.
   */
  navigate({channelId}) {
    // TODO: Implement me.
  }
}

/**
 * An item which may be displayed as a chat complete result.
 */
class ChatCompleteResult {
  constructor({text}) {
    this.text = text
  }
}

/**
 * A command which users may run from the input area.
 *
 * TODO: Rationalize this in terms of a UserAgent input area onChange event.
 */
class Command {
  /**
   * @param {Object} args - destructured args.
   * @param {string[]} args.tokens - Keyword tokens which the user may type at the beginning of the input area to invoke this command.
   * @param {onQueryCallback} args.onQuery - Called when one of the tokens is invoked by the user.
   */
  constructor({tokens, onQuery}) {
    this.tokens = tokens
    this._onQuery = onQuery
  }

  /** @param {onQueryCallback} callback - Called when one of the tokens is invoked by the user. */
  onQuery(callback) {
    this._onQuery = callback
    // TODO: Implement me.
  }

  /**
   * @callback onQueryCallback
   * @param {string} token - The token that was invoked.
   * @param {string} query - The user's query (i.e. all text entered after the token).
   * @param {Promise} promise - Resolve this with a list of ChatCompleteResults.
   */
}

/**
 * A package that extends Chatternet and/or Other Chat user agent functionality.
 * This is the base unit of other.js.
 */
class Feature {
  /**
   * @param {Object} metadata - metadata describing the package.
   * @param {string} metadata.name - User facing name.
   * @param {string} metadata.description - User facing, one-line description .
   * @param {string} metadata.version - {@link http://semver.org/|Semantic Version} used for determining compatibility with clients and other features.
   * @param {string} metadata.identity - Feature developer's Chatternet Identity under which all Chatternet operations are performed.
   * @param {Command[]} metadata.commands - Commands to register.
   */
  constructor({name, description, version, identity, commands = []}) {
    // TODO: Validation
    this.name = name
    this.description = description
    this.version = version
    this.identity = identity
    this.commands = commands
    this._chatternet = identity ? new Chatternet({identity}) : null
    this._userAgent = new UserAgent()
  }

  /** @return {Chatternet} The global chatternet as seen by this feature's identity or null if the feature doesn't have access. */
  get chatternet() {
    return this._chatternet
  }

  /** @return {UserAgent} The user agent's current browsing context. */
  get userAgent() {
    return this._userAgent
  }
}

module.exports = {ChatCompleteResult, Command, Feature}
