import {ADD_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE} from './Chatternet'

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
    const {entities} = this._chatternet
    if (!entities) return false
    const entity = entities[this.id]
    if (!entity) return false
    const {identities} = entity
    if (!identities) return false
    const identity = identities[identityId]
    if (!identity) return false
    const {roles} = identity
    if (!roles) return false
    return roles.includes('owner')
  }

  /**
   * Sends the given message from {Chatternet.identity} to the channel.
   * @param {Message} message - The message to send. Note that
   *     {Message.identity} is replaced with {Chatternet.identity}.
   */
  send(message) {
    this._chatternet.emit(ADD_MESSAGE, this.id, message)
  }

  /**
   * Edits the given message.
   * @param {Message} message - Sparse map of the new message contents.
   *     Must have an id.
   */
  edit(message) {
    this._chatternet.emit(EDIT_MESSAGE, this.id, message.id, message)
  }

  /**
   * Deletes the given message from the channel.
   * @param {Message} message - The message to delete. Only id is required.
   */
  delete(message) {
    this._chatternet.emit(REMOVE_MESSAGE, this.id, message)
  }
}

export default Channel
