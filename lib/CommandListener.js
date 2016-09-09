import * as Events from './Events'
import Listener from './Listener'
import {userAgent} from './UserAgent'

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
    super({on})
    this._commands = commands.sort((a, b) => b.length - a.length)  // Sort by length descending so that longest command is matched
    userAgent.on(Events.SET_STAGED_MESSAGE, event => {
      const {text} = event.message
      const chatCompleteResults = []
      if (text && text.startsWith('/')) {
        const command = text.substring(1).split(' ')[0]
        const potentialCommands = this._commands.filter(c => c.startsWith(command))
        if (potentialCommands.includes(command) && text.length >= command.length + 2) {
          const args = text.substring(command.length + 2)
          super._requestResult({command, args}, result => {
            if (!result.stagedMessage || !result.stagedMessage.text) result.stagedMessage.text = args
            super._handleResult(event.tag, result)
          })
        } else {
          chatCompleteResults.push(...potentialCommands.map(c => ({text: `/${c} `})))
        }
      }
      userAgent.emit(Events.SET_CHAT_COMPLETE_RESULTS, {replyTag: event.tag, results: chatCompleteResults})
    })
  }
}

export default CommandListener
