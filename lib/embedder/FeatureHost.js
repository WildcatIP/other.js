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
}
