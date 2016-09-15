import * as Account from './Account'
import * as Channel from './Channel'
import * as Identity from './Identity'
import EventEmitter from 'events'

/**
 * An interface for interacting with an Other Chat user agent.
 * @emits UserAgent#SET_CHAT_COMPLETE_RESULTS
 * @emits UserAgent#UPDATE_STAGED_MESSAGE
 * @listens UserAgent#SET_STAGED_MESSAGE
 * @inheritdoc
 */
class UserAgent extends EventEmitter {
  /**
   * An item to be displayed as a chat completion.
   * @typedef {object} UserAgent~ChatCompletion
   * @property {?string} text Plain text to be displayed to the user.
   * @property {?Media} media Media to be displayed to the user.
   */

  /**
   * Event conveying chat complete results to be displayed to the user.
   * @event UserAgent#SET_CHAT_COMPLETE_RESULTS
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {UserAgent~ChatCompletion[]} results - array of results to be
   *     displayed to the user.
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