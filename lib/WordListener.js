import Listener from './Listener'

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
    super()
    this._on = on
    this._wordToRegExp = {}
    // Sort by length descending so that longest word is matched
    words.sort((a, b) => b.length - a.length).forEach(w => {
      // Roughly: (beginning of string | space | newline)(word)(word boundary)
      this._wordToRegExp[w] = new RegExp(`(?:^|[\\s\\n])${w}\\b`)
    })
  }

  onSetStagedMessage(message) {
    const {text} = message
    for (const word of Object.keys(this._wordToRegExp)) {
      if (this._wordToRegExp[word].test(text)) {
        const result = this._on({word, rest: text})
        return result instanceof Promise ? result : Promise.resolve(result)
      }
    }
    return Promise.resolve({chatCompletions: []})
  }
}

export default WordListener
