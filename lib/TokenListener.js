import * as Events from './Events'
import Listener from './Listener'
import {userAgent} from './UserAgent'

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
    super({on})
    // Sort by length descending so that longest token is matched.
    const sortedTokens = tokens.sort((a, b) => b.length - a.length)
    const nonWhitespaceOrColon = '[^: \\f\\n\\r\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]'
    const partialTokenRegExp = new RegExp(`(?:^|[\\s\\n]):(${nonWhitespaceOrColon}+)$`, 'gim')
    const fullTokenRegExp = new RegExp(`(?:^|[\\s\\n])(:(${nonWhitespaceOrColon}+):)(?=$|[\\s\\n])`, 'gim')
    userAgent.on(Events.SET_STAGED_MESSAGE, event => {
      const {text} = event.message
      if (!text) return

      const partialMatch = partialTokenRegExp.exec(text)
      if (partialMatch) {
        const partialToken = partialMatch[1]
        const partialTokenMatches = sortedTokens.filter(t => t.startsWith(partialToken))
        if (!partialTokenMatches.length) return
        // const results = [{text: partialTokenMatches[0]}] // TODO: Lookup and return all
        // userAgent.emit(SET_CHAT_COMPLETE_RESULTS, {replyTag: event.tag, results})
        return
      }

      const fullMatch = fullTokenRegExp.exec(text)
      if (!fullMatch) return

      const toReplace = fullMatch[1]
      const token = fullMatch[2]
      if (!sortedTokens.includes(token)) return

      super._requestResult({token}, result => {
        const newText = text.replace(toReplace, result.text)
        super._handleResult(event.tag, {stagedMessage: {text: newText}})
      })
    })
  }
}

export default TokenListener
