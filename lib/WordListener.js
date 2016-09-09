import * as Events from './Events'
import Listener from './Listener'
import {userAgent} from './UserAgent'

/**
 * Listens for words entered by the user.
 *
 * Words are space delimited and may appear anywhere in a message.
 * @inheritdoc
 */
class WordListener extends Listener {
  /**
   * @callback WordListener#onCallback
   * @param {string} word - The word that was invoked.
   * @param {string} rest - All text of the message.
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this word.
   */

  /**
   * @param {string[]} words - Words which invoke this listener if typed
   *     anywhere in the message (ie. " {WORD} ").
   * @param {WordListener#onCallback} on - Called when one of the words is
   *     typed by the user.
   */
  constructor({words, on}) {
    super({on})
    this._words = words.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest word is matched
    userAgent.on(Events.SET_STAGED_MESSAGE, event => {
      const {text} = event.message
      for (const word of this._words) {
        if (text && new RegExp(`\\b${word}\\b`).test(text)) {
          super._requestResult({word, rest: text}, result => super._handleResult(event.tag, result))
          return
        }
      }
      // TODO: This works, but emits way too often.
      userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: event.tag, results: []})
    })
  }
}

export default WordListener
