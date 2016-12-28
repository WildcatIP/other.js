import './TaggedMessage'
import Account from './Account'
import Channel from './Channel'
import EventEmitter from 'events'
import Identity from './Identity'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const INSTALL_FEATURE = 'INSTALL_FEATURE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'
export const UNINSTALL_FEATURE = 'UNINSTALL_FEATURE'
export const UPDATE_ENTITIES = 'UPDATE_ENTITIES'
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES'

/**
 * An entity identified by a UUID that represents a channel or identity+channel.
 * @typedef {object} Entity
 * @property {!string} name String representing the user-facing name.
 * @property {?bool} isIdentity Whether this entity also corresponds to an
 *     identity.
 * @property {?string} parentId For child entities, UUID of the parent entity.
 * @property {object} features Mapping of feature id to url for all
 *   features installed on this entity.
 */

/**
 * An interface for interacting with the global Chatternet. The Chatternet is a
 * "Turing complete" social network. It's the web on which we surf.
 * @emits Chatternet#ADD_MESSAGE
 * @emits Chatternet#EDIT_MESSAGE
 * @emits Chatternet#INSTALL_FEATURE
 * @emits Chatternet#REMOVE_MESSAGE
 * @emits Chatternet#UNINSTALL_FEATURE
 * @listens Chatternet#UPDATE_ENTITIES
 * @listens Chatternet#UPDATE_MESSAGES
 * @inheritdoc
 */
class Chatternet extends EventEmitter {
  /**
   * Event conveying that entities known to an identity have been updated.
   * @event Chatternet#UPDATE_ENTITIES
   * @mixes event:TAGGED_MESSAGE
   * @param {Object.<string, Entity>} entities - Sparse update dict of uuid to
   *     Entity. Null values represent a delete.
   */

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
   * Event conveying a message to edit.
   * @event Chatternet#EDIT_MESSAGE
   * @mixes event:TAGGED_MESSAGE
   * @param {!string} channelId - The channel to which the message belongs.
   * @param {!string} messageId - The message's identifier.
   * @param {!Message} message - Sparse map of properties to change on
   *     the message.
   */

  /**
   * Event conveying intent to install a feature on an entity.
   * @event Chatternet#INSTALL_FEATURE
   * @mixes event:TAGGED_MESSAGE
   * @param {!string} entityId - The entity on which to install.
   * @param {!string} entityType - The type of entity on which to install. One of
   *     'channel' or 'identity'.
   * @param {string} featureIdentity - The identity ID of the feature to
   *     install. Iff present, the feature is executed in the cloud.
   *     Mutually exclusive with featureUrl.
   * @param {string} featureUrl - The URL of the feature to install. Iff
   *     present, the feature is executed on the user agent. Mutually
   *     exclusive with featureIdentity.
   */

  /**
   * Event conveying a message to remove from the channel.
   * @event Chatternet#REMOVE_MESSAGE
   * @mixes event:TAGGED_MESSAGE
   * @param {!string} channelId - The channel to remove the message from.
   * @param {!Message} message - The message to remove.
   */

  /**
   * Event conveying intent to uninstall a feature from an entity.
   * @event Chatternet#UNINSTALL_FEATURE
   * @mixes event:TAGGED_MESSAGE
   * @param {!string} entityId - The entity from which to uninstall.
   * @param {!string} entityType - The type of entity from which to uninstall. One
   *     of 'channel' or 'identity'.
   * @param {string} featureIdentity - The identity ID of the feature to
   *     install. Mutually exclusive with featureUrl.
   * @param {string} featureUrl - The URL of the feature to install.
   *     Mutually exclusive with featureIdentity.
   */

  /**
   * @callback Channel#onReceiveMessageCallback
   * @param {Message} message - The message that was received.
   * @param {Channel} channel - The receiving channel.
   */

  /**
   * @param {string} identity - Scope for Chatternet interactions.
   */
  constructor({identity}) {
    super()
    this.identity = identity
    this.entities = {}
    this.on(UPDATE_ENTITIES, (event) => {
      Object.keys(event.entities || []).forEach((id) => {
        this.entities[id] = Object.assign({}, this.entities[id], event.entities[id])
      })
    })
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
   * @param {string} id - The id of the channel to lookup.
   * @return {?Channel} The channel associated with the given id or else null if
   *     it wasn't found or the identity cannot access it.
   */
  channel({id}) {
    return new Channel({id, chatternet: this}) // TODO: Implement me.
  }

  /**
   * @param {string} id - The id of the identity to lookup.
   * @return {?Identity} The identity associated with the given id or else null
   *     if it wasn't found or the identity cannot access it.
   */
  identity({id}) {
    return new Identity({id, chatternet: this}) // TODO: Implement me.
  }

  installFeature({entityId, entityType, featureIdentity, featureUrl}) {
    this.emit(INSTALL_FEATURE, {entityId, entityType, featureIdentity, featureUrl})
  }

  /**
   * @param {Chatternet#onReceiveMessageCallback} callback - Called when a new
   *     message is received from another identity. Note:
   *     {Chatternet.identity}'s own messages do not invoke this callback.
   */
  onReceiveMessage(callback) {
    this.on(UPDATE_MESSAGES, (channelId, messages) => {
      messages.filter((m) => m.identityId !== this.identity)
          .forEach((m) => callback(m, new Channel({id: channelId, chatternet: this})))
    })
  }

  uninstallFeature({entityId, entityType, featureId, featureIdentity, featureUrl}) {
    this.emit(UNINSTALL_FEATURE, {entityId, entityType, featureId, featureIdentity, featureUrl})
  }
}

export default Chatternet
