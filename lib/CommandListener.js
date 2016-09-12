import Listener from './Listener'

/**
 * Listens for commands entered by the user.
 *
 * Commands are invoked by a "/", followed by the command, then a space. A
 * command's arguments consist of everything following the space.
 * @inheritdoc
 */
class CommandListener extends Listener {
  /**
   * @callback CommandListener#onCallback
   * @param {string} command - The command that was invoked.
   * @param {string} args - All text entered after the command.
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this command.
   */

  /**
   * @param {string[]} commands - Keyword commands which the user may invoke by
   *     typing a "/{COMMAND} " at the beginning of the input area.
   * @param {CommandListener#onCallback} on - Called when one of the commands is
   *     invoked by the user.
   */
  constructor({commands, on}) {
    super()
    this._on = on
    this._commands = commands.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest command is matched
  }

  onSetStagedMessage(message) {
    const {text} = message
    const chatCompletions = []
    if (text.startsWith('/')) {
      const command = text.substring(1).split(' ')[0]
      const potentialCommands = this._commands.filter(c => c.startsWith(command))
      if (potentialCommands.includes(command) && text.length >= command.length + 2) {
        const args = text.substring(command.length + 2)
        let result = this._on({command, args})
        if (!(result instanceof Promise)) result = Promise.resolve(result)
        return result.then(result => {
          if (!result.stagedMessage || !result.stagedMessage.text) result.stagedMessage.text = args
          return result
        })
      }
      chatCompletions.push(...potentialCommands.map(c => ({text: `/${c} `})))
    }
    return Promise.resolve({chatCompletions})
  }
}

export default CommandListener
