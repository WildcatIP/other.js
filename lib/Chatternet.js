import EventEmitter from 'events'

import * as Account from './Account'
import * as Channel from './Channel'
import * as Identity from './Identity'

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
   * @mixes event:TAGGED_MESSAGE
   * @param {!string} channelId - The channel to update.
   * @param {Message[]} messages - A list of messages to update in the given
   *     channelId. The messages in this update may reflect new messages or
   *     updates to existing messages.
   */

  /**
   * Event conveying a message to add to the channel.
   * @event Chatternet#ADD_MESSAGE
   * @mixes event:TAGGED_MESSAGE
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

export default Chatternet
