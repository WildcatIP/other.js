import Listener from './Listener'

const illegalMention = '\u0000-\u002E\u003A-\u0040\u005B-\u0060\u007B-\u007F'
const partialMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)$`, 'im')
const fullMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)(?=$|[${illegalMention}])`, 'im')

function applyResultToStagedMessage(result, match, stagedMessage) {
  const {entities, text} = stagedMessage
  const entireMatch = match[0]
  const mention = match[1]
  const start = entireMatch[0] === ' ' || entireMatch[0] === '\n' ? match.index + 1 : match.index
  const newEntities = (entities || []).concat([{
    id: result.id,
    isIdentity: Boolean(result.isIdentity),
    start,
    length: result.name.length + 1
  }])
  const requiredToken = result.isIdentity ? '@' : '#'
  const newText = text.substr(0, start) + requiredToken + result.name + text.substr(start + mention.length)
  return {entities: newEntities, text: newText}
}

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
    const match = partialMentionRegExp.exec(text)
    if (!match) return null
    return {stagedMessage: applyResultToStagedMessage(result, match, message)}
  }

  onSetStagedMessage(message) {
    const {text} = message
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
      return {chatCompletions: [], stagedMessage: applyResultToStagedMessage(result, fullMatch, message)}
    })
  }
}

export default MentionListener
