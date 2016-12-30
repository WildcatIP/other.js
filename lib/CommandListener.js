import Listener from './Listener'

const partialCommandRegExp = new RegExp('^/([\\w]*)(\\s|$)')

/**
 * Listens for commands entered by the user.
 *
 * Commands are invoked by a "/", followed by the command, then a space. A
 * command's arguments consist of everything following the space.
 * @extends Listener
 */
class CommandListener extends Listener {
  /**
   * @callback CommandListener.onCommand
   * @param {string} command - The command that was invoked.
   * @param {string} args - All text entered after the command.
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this command.
   */

  /**
   * @param {string[]} commands - Keyword commands which the user may invoke by
   *     typing a "/{COMMAND} " at the beginning of the input area.
   * @param {CommandListener.onCommand} on - Called when one of the commands is
   *     invoked by the user.
   */
  constructor({commands, on}) {
    super()
    this._on = on
    this._commands = commands.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest command is matched
  }

  onActivateChatCompleteResult(action, result, message) {
    const {text} = message
    if (action !== 'default' || !text.startsWith('/')) return null
    const command = result.text.substring(1).split(' ')[0]
    if (!this._commands.includes(command)) return null
    const newText = text.replace(partialCommandRegExp, '')
    if (text === newText) return null
    return {stagedMessage: {text: newText, format: command}}  // TODO: Setting format isn't general.
  }

  onSetStagedMessage(message) {
    const {text} = message
    const chatCompletions = []
    const match = partialCommandRegExp.exec(text)
    if (match) {
      const command = match[1]
      const space = match[2]
      const potentialCommands = this._commands.filter((c) => c.startsWith(command))
      if (space) {
        if (potentialCommands.includes(command)) {
          const args = text.substring(command.length + 2)
          let result = this._on({command, args})
          if (!(result instanceof Promise)) result = Promise.resolve(result)
          return result.then((result) => {
            if (!result.stagedMessage || !result.stagedMessage.text) result.stagedMessage.text = args
            return result
          })
        }
      } else {
        chatCompletions.push(...potentialCommands.map((c) => ({text: `/${c} `})))
      }
    }
    return Promise.resolve({chatCompletions})
  }
}

export default CommandListener
