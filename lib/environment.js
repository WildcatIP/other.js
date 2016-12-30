import './TaggedMessage'
import EventEmitter from 'events'

export const FETCH = 'FETCH'
export const FETCH_ERROR = 'FETCH_ERROR'
export const FETCH_RESPONSE = 'FETCH_RESPONSE'

/**
 * Fetch request init options.
 * @see {@link https://fetch.spec.whatwg.org/#requestinit}
 * @typedef {object} RequestInit
 * @property {string} method The request method, e.g., GET, POST.
 * @property {object} headers Any headers you want to add to your request.
 * @property {string} body Any body that you want to add to your request. Note
 *     that a request using the GET or HEAD method cannot have a body.
 * @property {string} mode The mode you want to use for the request, e.g., cors,
 *     no-cors, or same-origin.
 * @property {string} cache The cache mode you want to use for the request:
 *     default, no-store, reload, no-cache, force-cache, or only-if-cached.
 * @property {string} redirect The redirect mode to use: follow (automatically
 *     follow redirects), error (abort with an error if a redirect occurs), or
 *     manual (handle redirects manually).
 * @property {string} referrer A string specifying no-referrer, client, or a
 *     URL. The default is client.
 * @property {string} referrerPolicy Specifies the value of the referer HTTP
 *     header. May be one of no-referrer, no-referrer-when-downgrade, origin,
 *     origin-when-cross-origin, unsafe-url.
 * @property {string} integrity Contains the subresource integrity value of the
 *     request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
 */

 /**
  * Fetch response init options.
  * @see {@link https://fetch.spec.whatwg.org/#responseinit}
  * @typedef {object} ResponseInit
  * @property {number} status The status code for the reponse, e.g., 200.
  * @property {string} statusText The status message associated with the staus
  *     code, e.g., OK.
  * @property {object} headers Any headers you want to add to your response,
  *     contained within an object literal of ByteString key/value pairs
  *     (see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}
  *     for a reference).
  */

/**
 * An {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter}
 * for interacting with the embedding environment.
 * @emits Environment#FETCH
 * @listens Environment#FETCH_ERROR
 * @listens Environment#FETCH_RESPONSE
 */
class Environment extends EventEmitter {
  /**
   * Event requesting a network fetch.
   * @event Environment#FETCH
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!Request|string} input This defines the resource that you wish
   *     to fetch. This can either be: a string containing the direct URL of
   *     the resource you want to fetch OR a Request object.
   * @property {?RequestInit} init An options object containing any custom
   *     settings that you want to apply to the request.
   */

  /**
   * Event responding to an unsuccessful network request.
   * @event Environment#FETCH_ERROR
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!string} error An error message.
   */

  /**
   * Event responding to a successful network request.
   * @event Environment#FETCH_RESPONSE
   * @mixes event:TAGGED_MESSAGE
   * @type {!Object}
   * @property {!string} body An object defining a body for the response.
   * @property {!ResponseInit} init An options object containing any custom
   *     settings that you want to apply to the response.
   */
}

export const environment = new Environment()
