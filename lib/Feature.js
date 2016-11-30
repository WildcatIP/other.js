import * as Events from './Events'
import Chatternet from './Chatternet'
import CommandListener from './CommandListener'
import MentionListener from './MentionListener'
import TokenListener from './TokenListener'
import WordListener from './WordListener'
import {environment} from './environment'
import {userAgent} from './userAgent'

/**
 * A package that extends Chatternet and/or Other Chat user agent functionality.
 * This is the base unit of other.js.
 *
 * Features may be installed on accounts, identities or channels. In the first
 * two cases, those features are carried by a user into any channel they visit.
 * In the later case, the feature is available for any user visiting the
 * channel.
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
    this._chatternet = new Chatternet({identity})
    this._userAgent = null
    this._listeners = []
    listeners.forEach((l) => this.listen(l))
  }

  /**
   * The global Chatternet as seen by this feature's identity.
   * @type {?Chatternet}
   */
  get chatternet() {
    return this._chatternet
  }

  /**
   * The embedding environment's current context.
   */
  get environment() {
    return environment
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
    console.assert(to && on, 'listen() requires \'to\' and \'on\' params')
    if (to === 'message') {
      this._chatternet.onReceiveMessage(on)
      return
    }

    if (to === 'mention') this._listeners.push(new MentionListener({on}))
    if (to.commands) this._listeners.push(new CommandListener({commands: to.commands, on}))
    if (to.words) this._listeners.push(new WordListener({words: to.words, on}))
    if (to.tokens) this._listeners.push(new TokenListener({tokens: to.tokens, on}))
    if (!this._userAgent) {
      this._userAgent = userAgent
      this._userAgent.on(Events.ACTIVATE_CHAT_COMPLETE_RESULT, (event) => {
        const {action, message, result, tag} = event
        const results = this._listeners.map((l) => l.onActivateChatCompleteResult(action, result, message))
        // TODO: Accept the first results. Need to figure out how to handle conficts
        const navigateResult = results.find((r) => r && r.navigate)
        if (navigateResult) {
          const {to} = navigateResult.navigate
          this._userAgent.emit(Events.NAVIGATE, {replyTag: tag, to})
          return
        }
        const stagedMessageResults = results.filter((r) => r && r.stagedMessage)
        if (!stagedMessageResults.length) return
        this._userAgent.emit(Events.UPDATE_STAGED_MESSAGE, {replyTag: tag, message: stagedMessageResults[0].stagedMessage})
        this._userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: tag, results: []})
      })
      this._userAgent.on(Events.SET_STAGED_MESSAGE, (event) => {
        const {message, tag} = event
        if (!message.text) {
          this._userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: tag, results: []})
          return
        }
        // TODO: This waits for all results. We probably want to return partial results after a timeout.
        Promise.all(this._listeners.map((l) => l.onSetStagedMessage(message))).then((results) => {
          const chatCompletions = results.filter((r) => r && r.chatCompletions)
          if (chatCompletions.length) {
            // TODO: The order of results is unstable. Come up w/ a merge strategy.
            const results = chatCompletions.reduce((total, current) => {
              if (!current.chatCompletions) return total
              return total.concat(current.chatCompletions)
            }, [])
            const layout = getChatCompleteLayout(results)
            this._userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: tag, layout, results})
          }

          const stagedMessages = results.filter((r) => r && r.stagedMessage)
          if (stagedMessages.length) {
            const message = stagedMessages[0].stagedMessage
            // TODO: Revert staged message.
            this._userAgent.emit(Events.UPDATE_STAGED_MESSAGE, {replyTag: tag, message})
          }
        })
      })
    }
  }
}

// TODO: Get this from the features rather than a heuristic.
function getChatCompleteLayout(chatCompletions) {
  if (!chatCompletions || !chatCompletions.length) return undefined
  if (chatCompletions.every((c) => c.media)) return 'row'
  if (chatCompletions.every((c) => c.id)) return 'column'
  return 'tile'
}

export default Feature
