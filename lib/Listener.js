import * as Events from './Events'
import {userAgent} from './UserAgent'

/** Base class for Listeners. */
class Listener {
  /**
   * An item to be displayed as a chat completion.
   * @typedef {object} Listener~ChatCompletion
   * @property {string} text Plain text to be displayed to the user.
   */

  /**
   * Resulting action to perform in response to this command.
   * @typedef {object} Listener~Result
   * @property {?Message} stagedMessage Sparse message representating an update
   *     to the staged message, i.e. omitted fields remain unchanged.
   * @property {?Listener~ChatCompletion[]} chatCompletions Array of
   *     items which may be displayed as chat complete results.
   */

  constructor({on}) {
    this._on = on
  }

  _requestResult(args, resultCallback) {
    const resultOrPromise = this._on(args)
    if (resultOrPromise instanceof Promise) {
      resultOrPromise.then(resultCallback)
    } else {
      process.nextTick(resultCallback, resultOrPromise)
    }
  }

  _handleResult(tag, result) {
    if (result.stagedMessage) {
      // TODO: Revert staged message.
      userAgent.emit(Events.UPDATE_STAGED_MESSAGE, {replyTag: tag, message: result.stagedMessage})
    }
    if (result.chatCompletions) {
      userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: tag, results: result.chatCompletions})
    }
  }
}

export default Listener
