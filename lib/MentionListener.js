import Listener from './Listener'

const illegalMention = '\u0000-\u002E\u003A-\u0040\u005B-\u0060\u007B-\u007F'
const partialMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)$`, 'im')
const fullMentionRegExp = new RegExp(`(?:^|[\\s\\n])([@#][^${illegalMention}]+)(?=$|[${illegalMention}])`, 'im')

function applyResultToStagedMessage(result, match, stagedMessage) {
  const {entities, text} = stagedMessage
  const entireMatch = match[0]
  const mention = match[1]
  const start = entireMatch[0] === ' ' || entireMatch[0] === '\n' ? match.index + 1 : match.index
  const name = result.name || result.text && result.text.substring(1)
  const isIdentity = Boolean(result.isIdentity || result.text && result.text[0] === '@')
  const newEntities = (entities || []).concat([{
    id: result.id,
    isIdentity,
    start,
    length: name.length + 1
  }])
  const requiredToken = isIdentity ? '@' : '#'
  const newText = text.substr(0, start) + requiredToken + name + text.substr(start + mention.length)
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
    const {entities, text} = message

    // Strip any already matched entities from the text so we don't try to keep
    // matching them.
    let textSansEntities = text
    if (entities) {
      textSansEntities = entities.reduce((total, current) => {
        const {start, length} = current
        const textBeforeEntity = start ? text.substring(total.length, start) : ''
        return total + textBeforeEntity + ' '.repeat(length)
      }, '')
      textSansEntities += text.substring(textSansEntities.length)
    }

    // First check for partial matches to autocomplete.
    const partialMatch = partialMentionRegExp.exec(textSansEntities)
    if (partialMatch) {
      const partialMention = partialMatch[1]
      let results = this._on({mention: partialMention})
      if (!(results instanceof Promise)) results = Promise.resolve(results)
      return results.then(results => ({chatCompletions: results}))
    }

    // Then check for full matches to replace.
    const fullMatch = fullMentionRegExp.exec(textSansEntities)
    if (!fullMatch) return Promise.resolve({chatCompletions: []})
    const mention = fullMatch[1]
    let results = this._on({mention})
    if (!(results instanceof Promise)) results = Promise.resolve(results)
    return results.then(results => {
      const name = mention.substring(1)
      const result = results.find(r => r.name === name)
      if (!result) return {chatCompletions: []}
      return {chatCompletions: [], stagedMessage: applyResultToStagedMessage(result, fullMatch, message)}
    })
  }
}

export default MentionListener
