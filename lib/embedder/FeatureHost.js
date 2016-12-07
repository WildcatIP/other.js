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
    return module.name
  }

  get version() {
    return module.version
  }

  get identity() {
    return module.identity
  }

  get isCloudEmbeddable() {
    return !module._userAgent
  }

  get isUserAgentEmbeddable() {
    return !module.identity
  }
}
