/**
 * Encapsulates metadata about a Feature.
 */
class FeatureMetadata {
  /**
   * @param {?string} description - User facing, one-line description.
   * @param {?string} identity - Feature developer's Chatternet identity under
   *     which all Chatternet operations are performed.
   * @param {bool} isUserAgentRequired - Whether the feature requires a user
   *     agent.
   * @param {string} name - User facing name.
   * @param {?string} url - Canonical URL where the feature is hosted.
   * @param {string} version - {@link http://semver.org/|Semantic Version} used
   *     for determining compatibility with clients and other features.
   */
  constructor({description, identity, isUserAgentRequired, name, url, version}) {
    // TODO: Validation
    this.description = description
    this.identity = identity
    this.isUserAgentRequired = Boolean(isUserAgentRequired)
    this.name = name
    this.url = url
    this.version = version
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

  get isCloudEmbeddable() {
    return this.identity && !this.isUserAgentRequired
  }

  get isUserAgentEmbeddable() {
    return !this.identity
  }
}

export default FeatureMetadata
