import Listener from './Listener'

const nonWhitespaceOrColon = '[^: \\f\\n\\r\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]'
const partialTokenRegExp = new RegExp(`(?:^|[\\s\\n]):(${nonWhitespaceOrColon}+)$`, 'im')
const fullTokenRegExp = new RegExp(`(?:^|[\\s\\n])(:(${nonWhitespaceOrColon}+):)(?=$|[\\s\\n])`, 'im')

/**
 * Listens for tokens entered by the user.
 *
 * Tokens consist of " :token: " and may appear anywhere in a message.
 * @inheritdoc
 */
class TokenListener extends Listener {
  /**
   * @callback TokenListener#onCallback
   * @param {string} token - The token that was invoked.
   * @return {?(Promise|Listener~ChatCompletion)} - The chat completion content
   *     which should replace this token.
   */

  /**
   * @param {string[]} tokens - Tokens which invoke this listener if typed
   *     anywhere in the message (ie. " :{TOKEN}: ").
   * @param {TokenListener#onCallback} on - Called when one of the tokens is
   *     typed by the user.
   */
  constructor({tokens, on}) {
    super()
    this._on = on
    // Sort by length descending so that longest token is matched.
    this._tokens = tokens.sort((a, b) => b.length - a.length)
  }

  onSetStagedMessage(message) {
    const {text} = message
    const partialMatch = partialTokenRegExp.exec(text)
    if (partialMatch) {
      const partialToken = partialMatch[1]
      const partialTokenMatches = this._tokens.filter(t => t.startsWith(partialToken))
      if (!partialTokenMatches.length) return Promise.resolve({chatCompletions: []})
      return Promise.all(partialTokenMatches.map(token => {
        let result = this._on({token})
        if (!(result instanceof Promise)) result = Promise.resolve(result)
        return result
      })).then(chatCompletions => ({chatCompletions}))
    }

    const fullMatch = fullTokenRegExp.exec(text)
    if (!fullMatch) return Promise.resolve({chatCompletions: []})

    const toReplace = fullMatch[1]
    const token = fullMatch[2]
    if (!this._tokens.includes(token)) return Promise.resolve({chatCompletions: []})

    let result = this._on({token})
    if (!(result instanceof Promise)) result = Promise.resolve(result)
    return result.then(result => {
      return {chatCompletions: [], stagedMessage: {text: text.replace(toReplace, result.text)}}
    })
  }
}

export default TokenListener