import Chatternet from './Chatternet'
import CommandListener from './CommandListener'
import TokenListener from './TokenListener'
import WordListener from './WordListener'
import {userAgent} from './UserAgent'

/**
 * A package that extends Chatternet and/or Other Chat user agent functionality.
 * This is the base unit of other.js.
 */
class Feature {
  /**
   * @param {string} name - User facing name.
   * @param {string} description - User facing, one-line description.
   * @param {string} version - {@link http://semver.org/|Semantic Version} used
   *     for determining compatibility with clients and other features.
   * @param {string} identity - Feature developer's Chatternet identity under
   *     which all Chatternet operations are performed.
   * @param {Command[]} commands - Commands to register.
   */
  constructor({name, description, version, identity, listeners = []}) {
    // TODO: Validation
    this.name = name
    this.description = description
    this.version = version
    this.identity = identity
    this._chatternet = identity ? new Chatternet({identity}) : null
    this._listeners = []
    listeners.forEach(l => this.listen(l))
  }

  /**
  * The global Chatternet as seen by this feature's identity or
  * null if the feature doesn't have a valid identity.
  * @type {?Chatternet}
  */
  get chatternet() {
    return this._chatternet
  }

  /**
  * The user agent's current browsing context.
  * @type {UserAgent}
  */
  get userAgent() {
    return userAgent
  }

  /**
  * TODO: Return a function that unlistens.
  */
  listen({to, on}) {
    console.assert(to && on, "listen() requires 'to' and 'on' params")
    if (to.commands) {
      this._listeners.push(new CommandListener({commands: to.commands, on}))
    }
    if (to.words) {
      this._listeners.push(new WordListener({words: to.words, on}))
    }
    if (to.tokens) {
      this._listeners.push(new TokenListener({tokens: to.tokens, on}))
    }
  }
}

export default Feature
