import * as chatternet from '../Chatternet'
import ChatternetRestClient from './ChatternetRestClient'
import FeatureMetadata from '../FeatureMetadata'

/**
 * A host for a single feature.
 *
 * Useful for embedders to discover metadata, enforce
 * permissions and handle certain events.
 */
export default class FeatureHost extends FeatureMetadata {
  /**
   * @param {!Object} module The module exported by the feature.
   * @param {!string} url The feature's URL.
   */
  constructor(module, url) {
    super(Object.assign({url}, module))
    this._client = null
  }

  get client() {
    if (!this._client) this._client = new ChatternetRestClient()
    return this._client
  }

  handleChatternetEvent(type, ...args) {
    switch(type) {
      case chatternet.ADD_MESSAGE: {
        const [channelId, message] = args
        this.client.createMessage(channelId, message)
        break
      }
      case chatternet.INSTALL_FEATURE: {
        const {entityId, featureIdentity, featureUrl} = args[0]
        if (featureIdentity) {
          this.client.putChannelFeature(entityId, featureIdentity)
        } else {
          this.client.putChannelDetails(entityId, {
            experimental: {
              features: [featureUrl],  // Allow multiple features
            },
          })
        }
        break
      }
      case chatternet.REMOVE_MESSAGE: {
        const [channelId, message] = args
        this.client.deleteMessage(channelId, message.id)
        break
      }
      case chatternet.UNINSTALL_FEATURE: {
        const {entityId, featureIdentity} = args[0]
        if (featureIdentity) {
          client.putChannelFeature(entityId, featureIdentity)
        } else {
          client.putChannelDetails(entityId, {
            experimental: {
              features: null,
            },
          })
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
