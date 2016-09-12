import * as Events from './Events'

/**
 * An interface for interacting with a Chatternet channel. A channel is simply
 * a stream of Chatternet events.
 */
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
    this._chatternet.on(Events.UPDATE_MESSAGES, (channelId, messages) => {
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
    this._chatternet.emit(Events.ADD_MESSAGE, this.id, Object.assign({}, message, {identityId: this._chatternet.identity}))
  }
}

export default Channel
