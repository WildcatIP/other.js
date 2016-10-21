import Listener from './Listener'

/**
 * Listens for URLS entered by the user. Matches to end of string only.
 *
 * @inheritdoc
 */

const endingURLRegexp = /((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/

class LinkListener extends Listener {
  /**
   * @callback LinkListener#onCallback
   * @return {?(Promise|Listener~Result)} - The resulting action that the
   *     user agent should take in response to this ;oml.
   */

  /**
   * @param {LinkListener#onCallback} on - Called when one a link is found.
   */
  constructor({on}) {
    super()
    this._on = on
  }

  onActivateChatCompleteResult( action, result, message ) {

    // TODO: This does not seem to get called?
    // That is, adding a console.log('boom') will not print 'boom'
    // and adding a return doesn't effect behavior.

    if (action !== 'default' || !result.text) return null
    return {stagedMessage: {text: result.text}}
  }

  onSetStagedMessage( message ) {

    // Get text typed so far
    const {text} = message

    var match = text.match( endingURLRegexp )
    var linkURL = match ? match[0] : null

    if( linkURL && !linkURL.match(/ /)) {
      const result = this._on({url: linkURL})
      return result instanceof Promise ? result : Promise.resolve( result )
    }

    return Promise.resolve( {chatCompletions: []} )

  }

}

export default LinkListener
