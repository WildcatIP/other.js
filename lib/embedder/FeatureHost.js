import * as events from '../Events'
import ChatternetRestClient from './ChatternetRestClient'

/**
 * A host for a single feature.
 *
 * Useful for embedders to discover metadata, enforce
 * permissions and handle certain events.
 */
export default class FeatureHost {
  /**
   * @param {Object} module The module exported by the feature.
   */
  constructor(module) {
    this.module = module
    this._client = null
  }

  get name() {
    return this.module.name
  }

  get version() {
    return this.module.version
  }

  get identity() {
    return this.module.identity
  }

  get isCloudEmbeddable() {
    return !this.module._userAgent
  }

  get isUserAgentEmbeddable() {
    return !this.module.identity
  }

  get client() {
    if (!this._client) this._client = new ChatternetRestClient()
    return this._client
  }

  handleChatternetEvent(type, ...args) {
    switch(type) {
      case events.ADD_MESSAGE: {
        const [channelId, message] = args
        this.client.createMessage(channelId, message)
        return true
      }
      case events.REMOVE_MESSAGE: {
        const [channelId, message] = args
        this.client.deleteMessage(channelId, message)
        return true
      }
      default:
        return false
    }
  }
}
