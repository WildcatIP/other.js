import Listener from './Listener'

const illegalMention = '\u0000-\u002E\u003A-\u0040\u005B-\u0060\u007B-\u007F'
const partialMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)$`, 'im')
const fullMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)(?=$|[${illegalMention}])`, 'im')

/**
 * Listens for mentions entered by the user.
 *
 * Mentions consist of # or @, followed by an alphanumeric name and possibly a
 * path separator (/).
 * @inheritdoc
 */
class MentionListener extends Listener {
  /**
   * @callback MentionListener#onCallback
   * @param {string} mention - The mention that was invoked.
   * @return {?(Promise|UserAgent~ChatCompletion)} - The chat completion content
   *     which should replace this mention.
   */

  /**
   * @param {string[]} mentions - Mentionss which invoke this listener if typed
   *     anywhere in the message (e.g. " @mention ").
   * @param {MentionListener#onCallback} on - Called when a mention is typed by
   *     the user.
   */
  constructor({on}) {
    super()
    this._on = on
  }

  onActivateChatCompleteResult(action, result, message) {
    if (action !== 'default') return null
    const {text} = message
    const {id, isIdentity} = result
    const newText = text.replace(partialMentionRegExp, ` <${isIdentity ? '@' : '#'}${id}>`)
    if (text === newText) return null
    return {stagedMessage: {text: newText}}
  }

  onSetStagedMessage(message) {
    const {entities, text} = message
    const partialMatch = partialMentionRegExp.exec(text)
    if (partialMatch) {
      const partialMention = partialMatch[1]
      let results = this._on({mention: partialMention})
      if (!(results instanceof Promise)) results = Promise.resolve(results)
      return results.then(results => ({chatCompletions: results}))
    }

    const fullMatch = fullMentionRegExp.exec(text)
    if (!fullMatch) return Promise.resolve({chatCompletions: []})

    const mention = fullMatch[1]
    let results = this._on({mention})
    if (!(results instanceof Promise)) results = Promise.resolve(results)
    return results.then(results => {
      const result = results[0]
      if (!result) return {chatCompletions: []}
      const start = fullMatch[0][0] === ' ' || fullMatch[0][0] === '\n' ? fullMatch.index + 1 : fullMatch.index
      const newEntities = (entities || []).concat([{
        id: result.id,
        isIdentity: Boolean(result.isIdentity),
        start,
        length: mention.length
      }])
      const requiredToken = result.isIdentity ? '@' : '#'
      const newText = text[start] === requiredToken ? text : text.substr(0, start) + requiredToken + text.substr(start + 1)
      return {chatCompletions: [], stagedMessage: {entities: newEntities, text: newText}}
    })
  }
}

export default MentionListener
