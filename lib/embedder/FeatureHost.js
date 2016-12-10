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
   * @param {!Object} module The module exported by the feature.
   * @param {!string} url The feature's URL.
   */
  constructor(module, url) {
    this.module = module
    this.url = url
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

  get displayUrl() {
    return this.url
        .replace('https://apps.other.chat/', '')
        .replace('https://gist.githubusercontent.com/', '')
  }

  get icon() {
    if (this.url.startsWith('https://gist.githubusercontent.com/')) {
      return 'https://assets-cdn.github.com/favicon.ico'
    }
    return 'https://other.chat/images/favicon.png'
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
        break
      }
      case events.REMOVE_MESSAGE: {
        const [channelId, message] = args
        this.client.deleteMessage(channelId, message.id)
        break
      }
      case events.UPDATE_ENTITIES:
      case events.UPDATE_MESSAGES:
        break  // Input events
      default:
        throw new Error(`Unexpected chatternet event ${type}`)
    }
  }
}
