import Account from './Account'
import Channel from './Channel'
import EventEmitter from 'events'
import Identity from './Identity'

/**
 * An interface for interacting with an Other Chat user agent.
 * @emits UserAgent#SET_CHAT_COMPLETE_RESULTS
 * @emits UserAgent#UPDATE_STAGED_MESSAGE
 * @listens UserAgent#ACTIVATE_CHAT_COMPLETE_RESULT
 * @listens UserAgent#SET_STAGED_MESSAGE
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
    * Event conveying that the user has activated a chat complete result.
    * @event UserAgent#ACTIVATE_CHAT_COMPLETE_RESULT
    * @mixes event:TAGGED_MESSAGE
    * @type {!Object}
    * @property {!string} action - The action to perform.
    * @property {!UserAgent~ChatCompletion} result - The chat complete result
    *     on which the action is to be performed.
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

export const userAgent = new UserAgent()
