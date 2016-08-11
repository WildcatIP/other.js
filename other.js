const EventEmitter = require('events')

const ADD_MESSAGE = 'ADD_MESSAGE'
const SET_CHAT_COMPLETE_RESULTS = 'SET_CHAT_COMPLETE_RESULTS'
const UPDATE_MESSAGES = 'UPDATE_MESSAGES'
const UPDATE_STAGED_MESSAGE = 'UPDATE_STAGED_MESSAGE'

/** A message */
class Message {
  constructor({avatarUrl, attachments, format, identityId, text, time}) {
    this.avatarUrl = avatarUrl
    this.attachments = attachments
    this.format = format
    this.identityId = identityId
    this.text = text
    this.time = time
  }
}

/** An interface for interacting with a chatternet channel. */
class Channel {
  /**
   * @callback Channel#onReceiveCallback
   * @param {Message} message - The message that was received.
   */

  /**
   * @param {!string} id - Identifier of the channel.
   * @param {!Chatternet} chatternet - Scope for channel interactions.
   */
  constructor({id, chatternet}) {
    this.id = id
    this._chatternet = chatternet
    this._onReceive = null
  }

  /**
   * @param {Channel#onReceiveCallback} callback - Called when a new message is
   *        received from another identity. Note: {Chatternet.identity}'s own
   *        messages do not invoke this callback.
   */
  onReceive(callback) {
    this._onReceive = callback
    this._chatternet.on(UPDATE_MESSAGES, (channelId, messages) => {
      if (channelId !== this.id) return
      messages.forEach(this._onReceive)
    })
  }

  /**
   * Sends the given message from {Chatternet.identity} to the channel.
   * @param {Message} message - The message to send. Note that
   *        {Message.identity} is replaced with {Chatternet.identity}.
   */
  send(message) {
    this._chatternet.emit(ADD_MESSAGE, this.id, Object.assign({}, message, {identityId: this._chatternet.identity}))
  }
}

/** @inheritdoc */
class Account {
 // TODO: Implement me.
}

/** @inheritdoc */
class Identity {
  // TODO: Implement me.
}

/**
 * An interface for interacting with the global Chatternet.
 * @emits Chatternet#ADD_MESSAGE
 * @listens Chatternet#UPDATE_MESSAGES
 * @inheritdoc
 */
class Chatternet extends EventEmitter {
  /**
   * Event conveying that channel messages have been updated.
   * @event Chatternet#UPDATE_MESSAGES
   * @param {!string} channelId - The channel to update.
   * @param {Message[]} messages - A list of messages to update in the given
   *        channelId. Messages are uniquely identified by their {Message.time}
   *        and the messages in this update may reflect new messages or updates
   *        to existing messages.
   */

  /**
   * Event conveying a message to add to the channel.
   * @event Chatternet#ADD_MESSAGE
   * @param {!string} channelId - The channel to add the message to.
   * @param {!Message} message - The message to add.
   */

  /**
   * @param {string} identity - Scope for Chatternet interactions.
   */
  constructor({identity}) {
    super()
    this.identity = identity
  }

  /**
   * @param {string} id - The id of the channel to lookup.
   * @return {?Channel} The channel associated with the given id or else null if
   *         it wasn't found or the identity cannot access it.
   */
  channel({id}) {
    return new Channel({id, chatternet: this}) // TODO: Implement me.
  }

  /**
   * @param {string} id - The id of the account to lookup.
   * @return {?Account} The account associated with the given id or else null if
   *         it wasn't found or the identity cannot access it.
   */
  account({id}) {
    return new Account({id, chatternet: this}) // TODO: Implement me.
  }

  /**
   * @param {string} id - The id of the identity to lookup.
   * @return {?Identity} The identity associated with the given id or else null
   *         if it wasn't found or the identity cannot access it.
   */
  identity({id}) {
    return new Identity({id, chatternet: this}) // TODO: Implement me.
  }
}

/**
 * An interface for interacting with an Other Chat user agent.
 * @emits UserAgent#SET_CHAT_COMPLETE_RESULTS
 * @emits UserAgent#UPDATE_STAGED_MESSAGE
 * @listens UserAgent#UPDATE_STAGED_MESSAGE
 * @inheritdoc
 */
class UserAgent extends EventEmitter {
  /**
   * Event conveying chat complete results to be displayed to the user.
   * @event UserAgent#SET_CHAT_COMPLETE_RESULTS
   * @type {!Object}
   * @property {!string} replyTo - textual content of the staged message these
   *           results apply to.
   * @property {ChatCompleteResult[]} results - array of results to be displayed
   *           to the user.
   * @property {string} results.text - textual content of the result to display.
   */

  /**
   * Event conveying that the staged message has been updated.
   * @event UserAgent#UPDATE_STAGED_MESSAGE
   * @type {!Object}
   * @property {!Message} message - unsent message input by the user and/or
   *           features. May be sparse, i.e. omitted fields remain unchanged.
   */

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
   * @param {string} channelId - The channel identifier to navigate to. May be:
   *        * An identity id for identity channels
   *        * A channel id for standard channels
   *        * OR lowerIdentityId:upperIdentityId for whisper channels
   */
  navigate({channelId}) {
    // TODO: Implement me.
  }
}

const userAgent = new UserAgent()

/**
 * An item which may be displayed as a chat complete result.
 */
class ChatCompleteResult {
  constructor({text}) {
    this.text = text
  }
}

/**
 * An update to the currently staged message.
 */
class StagedMessageResult {
  /**
   * @param {!Message} message - Sparse message representating an update to the
   *        staged message, i.e. omitted fields remain unchanged.
   */
  constructor(message) {
    this.message = message
  }
}

/**
 * A command which users may run from the input area.
 */
class Command {
  /**
   * @callback Command#onQueryCallback
   * @param {string} token - The token that was invoked.
   * @param {string} query - The user's query (i.e. all text entered after the
   *        token).
   * @return {Promise} - A Promise to either an array of {ChatCompleteResult}s
   *         or a single {StagedMessageResult}.
   */

  /**
   * @param {string[]} tokens - Keyword tokens which the user may type at the
   *        beginning of the input area to invoke this command.
   * @param {Command#onQueryCallback} onQuery - Called when one of the tokens is
   *        invoked by the user.
   */
  constructor({tokens, onQuery}) {
    this._tokens = tokens.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest token is matched
    this._onQuery = onQuery

    userAgent.on(UPDATE_STAGED_MESSAGE, event => {
      const {text} = event.message
      for (const token of this._tokens) {
        if (text.startsWith(token)) {
          const promise = this._onQuery(token, text.substring(token.length))
          // TODO: Revert staged message.
          if (promise instanceof StagedMessageResult) {
            promise.then(message => userAgent.emit(UPDATE_STAGED_MESSAGE, message))
          } else if (promise instanceof Array) {
            promise.then(results => userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTo: text, results}))
          }
          return
        }
      }
      userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTo: text, results: []})
    })
  }

  /**
   * @param {Command#onQueryCallback} callback - Called when one of the tokens
   *        is invoked by the user.
   */
  onQuery(callback) {
    this._onQuery = callback
  }
}

/**
 * A package that extends Chatternet and/or Other Chat user agent functionality.
 * This is the base unit of other.js.
 */
class Feature {
  /**
   * @param {string} name - User facing name.
   * @param {string} description - User facing, one-line description.
   * @param {string} version - {@link http://semver.org/|Semantic Version} used
   *        for determining compatibility with clients and other features.
   * @param {string} identity - Feature developer's Chatternet identity under
   *        which all Chatternet operations are performed.
   * @param {Command[]} commands - Commands to register.
   */
  constructor({name, description, version, identity, commands = []}) {
    // TODO: Validation
    this.name = name
    this.description = description
    this.version = version
    this.identity = identity
    this.commands = commands
    this._chatternet = identity ? new Chatternet({identity}) : null
  }

  /**
   * The global Chatternet as seen by this feature's identity or
   * null if the feature doesn't have a valid identity.
   * @type {?Chatternet}
   */
  get chatternet() {
    return this._chatternet
  }

  /**
   * The user agent's current browsing context.
   * @type {UserAgent}
   */
  get userAgent() {
    return userAgent
  }
}

module.exports = {ChatCompleteResult, Command, Feature, Message, StagedMessageResult}
