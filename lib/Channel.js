import * as Events from './Events'

/**
 * An interface for interacting with a Chatternet channel. A channel is simply
 * a stream of Chatternet events.
 */
class Channel {
  /**
   * @param {!string} id - Identifier of the channel.
   * @param {!Chatternet} chatternet - Scope for channel interactions.
   */
  constructor({id, chatternet}) {
    this.id = id
    this._chatternet = chatternet
  }

  isOwner(identityId) {
    return false // TODO: Implement me
  }

  /**
   * Sends the given message from {Chatternet.identity} to the channel.
   * @param {Message} message - The message to send. Note that
   *     {Message.identity} is replaced with {Chatternet.identity}.
   */
  send(message) {
    this._chatternet.emit(Events.ADD_MESSAGE, this.id, message)
  }

  /**
   * Deletes the given message from the channel.
   * @param {Message} message - The message to delete. Only id is required.
   */
  delete(message) {
    this._chatternet.emit(Events.REMOVE_MESSAGE, this.id, message)
  }
}

export default Channel
