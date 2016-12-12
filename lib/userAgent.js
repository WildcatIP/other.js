import * as Events from './Events'
import Account from './Account'
import Channel from './Channel'
import EventEmitter from 'events'

/**
 * An interface for interacting with an Other Chat user agent.
 * @emits UserAgent#NAVIGATE
 * @emits UserAgent#SET_CHAT_COMPLETE_RESULTS
 * @emits UserAgent#SET_MESSAGE_ACTIONS
 * @emits UserAgent#UPDATE_STAGED_MESSAGE
 * @listens UserAgent#ACTIVATE_CHAT_COMPLETE_RESULT
 * @listens UserAgent#ACTIVATE_MESSAGE_ACTION
 * @listens UserAgent#SET_ACTIVE_IDENTITY
 * @listens UserAgent#SET_SELECTED_MESSAGES
 * @listens UserAgent#SET_STAGED_MESSAGE
 * @listens UserAgent#UPDATE_FEATURE_METADATA
 * @inheritdoc
 */
class UserAgent extends EventEmitter {
  /**
   * An item to be displayed as a chat completion.
   * @typedef {object} UserAgent~ChatCompletion
   * @property {?string} id The uuid of the chatternet entity (channel or
   *     identity) corresponding to this result.
   * @property {?string} text Plain text to be displayed to the user.
   * @property {?Media} media Media to be displayed to the user.
   * @property {?string[]} actions A set of action names that may be invoked.
   */

   /**
    * Event conveying the currently active identity.
    * @event UserAgent#SET_ACTIVE_IDENTITY
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {Identity} identity - the currently active identity.
    */

  /**
   * Event conveying chat complete results to be displayed to the user.
   * @event UserAgent#SET_CHAT_COMPLETE_RESULTS
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {string} layout - how to layout the results: "column" (a single
   *     column of results, scrolling vertically if needed), "row" (a single
   *     row of results, scrolling horizontally as needed) or "tile" (as many
   *     per row as fit, wrapping to additional rows as needed). Defaults to
   *     row.
   * @property {UserAgent~ChatCompletion[]} results - array of results to be
   *     displayed to the user.
   */

   /**
    * Event conveying message actions to be displayed to the user.
    * @event UserAgent#SET_MESSAGE_ACTIONS
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {!string[]} actions - list of actions which may be performed,
    *     uniquely identified by their display string.
    */

   /**
    * Event conveying request to navigate to a channel or URL.
    * @event UserAgent#NAVIGATE
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {!string} to - The destination. May be:
    *     * An identity id for identity channels
    *     * A channel id for standard channels
    *     * lowerIdentityId:upperIdentityId for whisper channels OR
    *     * An arbitrary http:// or https:// URI.
    */

   /**
    * Event conveying that the user has activated a chat complete result.
    * @event UserAgent#ACTIVATE_CHAT_COMPLETE_RESULT
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {!string} action - The action to perform.
    * @property {!UserAgent~ChatCompletion} result - The chat complete result
    *     on which the action is to be performed.
    */

   /**
    * Event conveying that the user has activated a message action.
    * @event UserAgent#ACTIVATE_MESSAGE_ACTION
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {!string} action - The action to perform.
    * @property {!Message[]} messages - The list of messages to which
    *     this action applies.
    */

  /**
   * Event conveying that the list of selected messages has chaned.
   * @event UserAgent#SET_SELECTED_MESSAGES
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!Message[]} messages - The list of selected messages.
   */

  /**
   * Event conveying that the staged message has been set.
   * @event UserAgent#SET_STAGED_MESSAGE
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!Message} message - unsent message input by the user and/or
   *     features. Replaces the staged message entirely.
   */

  /**
   * Event conveying that the staged message has been updated.
   * @event UserAgent#UPDATE_STAGED_MESSAGE
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!Message} message - Sparse representation of an update to
   *     make to the staged message, i.e. omitted fields remain unchanged.
   */

  /**
   * Event conveying that known feature metadata has been updated.
   * @event UserAgent#UPDATE_FEATURE_METADATA
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object} metadata - Sparse update dict of URL to metadata.
   *     Null values represent a delete.
   */
  constructor() {
    super()
    this._identity = null
    this.featureMetadata = {}
    this.on(Events.SET_ACTIVE_IDENTITY, (event) => {
      this._identity = event.identity
    })
    this.on(Events.UPDATE_FEATURE_METADATA, (event) => {
      this.featureMetadata = Object.assign(this.featureMetadata, event.metadata)
    })
  }

  /** @return {Channel} The currently active channel. */
  get channel() {
    return new Channel() // TODO: Implement me.
  }

  /** @return {Account} The currently active account. */
  get account() {
    return new Account() // TODO: Implement me.
  }

  /** @return {Identity} The currently active identity. */
  get identity() {
    return this._identity
  }

  /**
   * Navigates to the given destination.
   * @param {!string} to - The destination. May be:
   *     * An identity id for identity channels
   *     * A channel id for standard channels
   *     * lowerIdentityId:upperIdentityId for whisper channels OR
   *     * An arbitrary http:// or https:// URI.
   */
  navigate({to}) {
    this.emit(Events.NAVIGATE, {to})
  }
}

export const userAgent = new UserAgent()
