const EventEmitter = require('events')

const ADD_MESSAGE = 'ADD_MESSAGE'
const SET_CHAT_COMPLETE_RESULTS = 'SET_CHAT_COMPLETE_RESULTS'
const SET_STAGED_MESSAGE = 'SET_STAGED_MESSAGE'
const UPDATE_MESSAGES = 'UPDATE_MESSAGES'
const UPDATE_STAGED_MESSAGE = 'UPDATE_STAGED_MESSAGE'

/**
 * An attachment.
 * TODO: Define fields
 * @typedef {object} Attachment
 */

/**
 * A message.
 * @typedef {object} Message
 * @property {?string} avatarUrl URL of the avatar image.
 * @property {?Attachment[]} attachments Array of attachments objects.
 * @property {?string} format String indicating message format (e.g. "markdown").
 * @property {?string} identityId UUID of the sender's identity encoded as a
 *     base-16 string.
 * @property {?string} text Plain text of the message.
 * @property {?double} time Sent timestamp. Used as a unique identifier.
 */

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
   *     received from another identity. Note: {Chatternet.identity}'s own
   *     messages do not invoke this callback.
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
   *     {Message.identity} is replaced with {Chatternet.identity}.
   */
  send(message) {
    this._chatternet.emit(ADD_MESSAGE, this.id, Object.assign({}, message, {identityId: this._chatternet.identity}))
  }
}

class Account {
 // TODO: Implement me.
}

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
   *     channelId. The messages in this update may reflect new messages or
   *     updates to existing messages.
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
   *     it wasn't found or the identity cannot access it.
   */
  channel({id}) {
    return new Channel({id, chatternet: this}) // TODO: Implement me.
  }

  /**
   * @param {string} id - The id of the account to lookup.
   * @return {?Account} The account associated with the given id or else null if
   *     it wasn't found or the identity cannot access it.
   */
  account({id}) {
    return new Account({id, chatternet: this}) // TODO: Implement me.
  }

  /**
   * @param {string} id - The id of the identity to lookup.
   * @return {?Identity} The identity associated with the given id or else null
   *     if it wasn't found or the identity cannot access it.
   */
  identity({id}) {
    return new Identity({id, chatternet: this}) // TODO: Implement me.
  }
}

/**
 * An interface for interacting with an Other Chat user agent.
 * @emits UserAgent#SET_CHAT_COMPLETE_RESULTS
 * @emits UserAgent#UPDATE_STAGED_MESSAGE
 * @listens UserAgent#SET_STAGED_MESSAGE
 * @inheritdoc
 */
class UserAgent extends EventEmitter {
  /**
   * Event conveying chat complete results to be displayed to the user.
   * @event UserAgent#SET_CHAT_COMPLETE_RESULTS
   * @type {!Object}
   * @property {!string} replyTo - textual content of the staged message these
   *     results apply to.
   * @property {ChatCompleteResult[]} results - array of results to be displayed
   *     to the user.
   * @property {string} results.text - textual content of the result to display.
   */

  /**
   * Event conveying that the staged message has been set.
   * @event UserAgent#SET_STAGED_MESSAGE
   * @type {!Object}
   * @property {!Message} message - unsent message input by the user and/or
   *     features. Replaces the staged message entirely.
   */

  /**
   * Event conveying that the staged message has been updated.
   * @event UserAgent#UPDATE_STAGED_MESSAGE
   * @type {!Object}
   * @property {!Message} message - Sparse representation of an update to
   *     make to the staged message, i.e. omitted fields remain unchanged.
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
   *     * An identity id for identity channels
   *     * A channel id for standard channels
   *     * OR lowerIdentityId:upperIdentityId for whisper channels
   */
  navigate({channelId}) {
    // TODO: Implement me.
  }
}

const userAgent = new UserAgent()

/** Base class for Listeners. */
class Listener {
  /**
   * An item to be displayed as a chat completion.
   * @typedef {object} Listener~ChatCompletion
   * @property {string} text Plain text to be displayed to the user.
   */

  /**
   * Resulting action to perform in response to this command.
   * @typedef {object} Listener~Result
   * @property {?Message} stagedMessage Sparse message representating an update
   *     to the staged message, i.e. omitted fields remain unchanged.
   * @property {?Listener~ChatCompletion[]} chatCompletions Array of
   *     items which may be displayed as chat complete results.
   */

  constructor({on}) {
    this._on = on
  }

  _handleResult(text, result) {
    if (result.stagedMessage) {
      // TODO: Revert staged message.
      userAgent.emit(UPDATE_STAGED_MESSAGE, {replyTo: text, message: result.stagedMessage})
    }
    if (result.chatCompletions) {
      userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTo: text, results: result.chatCompletions})
    }
  }
}

/**
 * Listens for commands entered by the user.
 *
 * Commands are invoked by a "/", followed by the command, then a space. A
 * command's arguments consist of everything following the space.
 * @inheritdoc
 */
class CommandListener extends Listener {
  /**
   * @callback CommandListener#onCallback
   * @param {string} command - The command that was invoked.
   * @param {string} args - All text entered after the command.
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this command.
   */

  /**
   * @param {string[]} commands - Keyword commands which the user may invoke by
   *     typing a "/{COMMAND} " at the beginning of the input area.
   * @param {CommandListener#onCallback} on - Called when one of the commands is
   *     invoked by the user.
   */
  constructor({commands, on}) {
    super({on})
    this._commands = commands.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest command is matched
    userAgent.on(SET_STAGED_MESSAGE, event => {
      const {text} = event.message
      const chatCompleteResults = []
      if (text && text.startsWith('/')) {
        const command = text.substring(1).split(' ')[0]
        const potentialCommands = this._commands.filter(c => c.startsWith(command))
        chatCompleteResults.push(...potentialCommands.map(c => ({text: `/${c} `})))
        if (potentialCommands.includes(command) && text.length >= command.length + 2) {
          const args = text.substring(command.length + 2)
          const result = this._on({command, args})
          const promise = result instanceof Promise ? result : Promise.resolve(result)
          promise.then(result => {
            if (!result.stagedMessage || !result.stagedMessage.text) result.stagedMessage.text = args
            super._handleResult(text, result)
          })
        }
      }
      // TODO: This works, but emits way too often.
      userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTo: text, results: chatCompleteResults})
    })
  }
}

/**
 * Listens for words entered by the user.
 *
 * Words are space delimited and may appear anywhere in a message.
 * @inheritdoc
 */
class WordListener extends Listener {
  /**
   * @callback WordListener#onCallback
   * @param {string} word - The word that was invoked.
   * @param {string} rest - All text of the message.
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this word.
   */

  /**
   * @param {string[]} words - Words which invoke this listener if typed
   *     anywhere in the message (ie. " {WORD} ").
   * @param {WordListener#onCallback} on - Called when one of the words is
   *     typed by the user.
   */
  constructor({words, on}) {
    super({on})
    this._words = words.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest word is matched
    userAgent.on(SET_STAGED_MESSAGE, event => {
      const {text} = event.message
      for (const word of this._words) {
        if (text && new RegExp(`\\b${word}\\b`).test(text)) {
          const result = this._on({word, rest: text})
          const promise = result instanceof Promise ? result : Promise.resolve(result)
          promise.then(result => this._handleResult(text, result))
          return
        }
      }
      // TODO: This works, but emits way too often.
      userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTo: text, results: []})
    })
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
   *     for determining compatibility with clients and other features.
   * @param {string} identity - Feature developer's Chatternet identity under
   *     which all Chatternet operations are performed.
   * @param {Command[]} commands - Commands to register.
   */
  constructor({name, description, version, identity, listeners = []}) {
    // TODO: Validation
    this.name = name
    this.description = description
    this.version = version
    this.identity = identity
    this._chatternet = identity ? new Chatternet({identity}) : null
    this._listeners = []
    listeners.forEach(l => this.listen(l))
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

  /**
   * TODO: Return a function that unlistens.
   */
  listen({to, on}) {
    console.assert(to && on, "listen() requires 'to' and 'on' params")
    if (to.commands) {
      this._listeners.push(new CommandListener({commands: to.commands, on}))
    }
    if (to.words) {
      this._listeners.push(new WordListener({words: to.words, on}))
    }
    // TODO: Support tokens (e.g. :emoji:)
    // if (to.tokens) {
    //  this._listeners.push(new TokenListener({tokens: to.tokens, on}))
    // }
  }
}

module.exports = {Chatternet, CommandListener, Feature, WordListener, UserAgent}
