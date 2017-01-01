import * as chatternet from '../Chatternet'
import ChatternetRestClient from './ChatternetRestClient'
import FeatureMetadata from '../FeatureMetadata'
import {environment} from '../environment'

const client = new ChatternetRestClient()

/**
 * A host for a single feature.
 *
 * Useful for embedders to discover metadata, enforce
 * permissions and handle certain events.
 * @extends FeatureMetadata
 */
class FeatureHost extends FeatureMetadata {
  /**
   * @param {!Object} module The module exported by the feature.
   * @param {!string} url The feature's URL.
   */
  constructor(module, url) {
    super(Object.assign({url}, module))
  }

  get client() {
    return client
  }

  get environment() {
    return environment
  }

  static handleChatternetEvent(type, ...args) {
    switch(type) {
      case chatternet.ADD_MESSAGE: {
        const [channelId, message] = args
        client.createMessage(channelId, message)
        break
      }
      case chatternet.INSTALL_FEATURE: {
        const {entityId, entityType, featureIdentity, featureUrl} = args[0]
        if (entityType === 'channel') {
          client.putChannelFeature(entityId, featureUrl, featureIdentity)
        } else {
          client.putIdentityFeature(entityId, featureUrl)
        }
        break
      }
      case chatternet.REMOVE_MESSAGE: {
        const [channelId, message] = args
        client.deleteMessage(channelId, message.id)
        break
      }
      case chatternet.UNINSTALL_FEATURE: {
        const {entityId, featureId, featureIdentity} = args[0]
        if (featureIdentity) {
          client.deleteChannelFeature(entityId, featureIdentity)
        } else {
          client.deleteIdentityFeature(entityId, featureId)
        }
        break
      }
      case chatternet.UPDATE_ENTITIES:
      case chatternet.UPDATE_MESSAGES:
        break  // Input events
      default:
        throw new Error(`Unexpected chatternet event ${type}`)
    }
  }
}

export default FeatureHost
