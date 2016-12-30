/**
 * Abstract base class for all listeners.
 * @abstract
 */
class Listener {
  /**
   * Resulting action to perform in response to this command.
   * @typedef {object} Listener.Result
   * @property {?Message} stagedMessage Sparse message representating an update
   *     to the staged message, i.e. omitted fields remain unchanged.
   * @property {?UserAgent~ChatCompletion[]} chatCompletions Array of
   *     items which may be displayed as chat complete results.
   */

   /**
    * @param {!string} action The action that was activated.
    * @param {!Listener.Result} result The chat complete result that
    *     was activated.
    * @param {?Message} message The message to which the action applies.
    * @abstract
    */
  onActivateChatCompleteResult(action, result) {
    throw new Error('Not implemented')
  }

  /**
   * @param {!Message} message The set staged message event data.
   * @abstract
   */
  onSetStagedMessage(message) {
    throw new Error('Not implemented')
  }
}

export default Listener
