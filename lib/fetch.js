import * as Events from './Events'
import {environment} from './environment'

let Headers = global.Headers
let Request = global.Request
let Response = global.Response
/* TODO: Node networking support.
if (process.env.TARGET === 'node') {
  const node = require('node-fetch')
  Headers = node.Headers
  Request = node.Request
  Response = node.Response
}
*/
if (process.env.TARGET !== 'node' && !Response) {
  const whatwg = require('whatwg-fetch')
  Headers = whatwg.Headers
  Request = whatwg.Request
  Response = whatwg.Response
}

let nextTag = 1
function fetch(input, init) {
  const tag = nextTag++
  return new Promise((resolve, reject) => {
    const onResponse = event => {
      if (event.replyTag !== tag) return
      resolve(new Response(event.body, event.options))
      environment.removeListener(Events.FETCH_RESPONSE, onResponse)
    }
    environment.on(Events.FETCH_RESPONSE, onResponse)

    const onError = event => {
      if (event.replyTag !== tag) return
      reject(event.error)
      environment.removeListener(Events.FETCH_ERROR, onError)
    }
    environment.on(Events.FETCH_ERROR, onError)

    environment.emit(Events.FETCH, {tag, input, init})
  })
}

global.fetch = fetch
global.Headers = Headers
global.Request = Request
global.Response = Response

export default fetch
