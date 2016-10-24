import * as Events from './Events'
import {environment} from './environment'

let Headers = global.Headers
let Request = global.Request
let Response = global.Response
if (!Response) {
  const node = require('node-fetch')
  Headers = node.Headers
  Request = node.Request
  Response = node.Response
}

let nextTag = 1
function fetch(input, init) {
  const tag = nextTag++
  return new Promise((resolve, reject) => {
    let removeListeners = null

    const onResponse = event => {
      if (event.replyTag !== tag) return
      removeListeners()
      resolve(new Response(event.body, event.options))
    }

    const onError = event => {
      if (event.replyTag !== tag) return
      removeListeners()
      reject(event.error)
    }

    removeListeners = () => {
      environment.removeListener(Events.FETCH_RESPONSE, onResponse)
      environment.removeListener(Events.FETCH_ERROR, onError)
    }

    environment.on(Events.FETCH_RESPONSE, onResponse)
    environment.on(Events.FETCH_ERROR, onError)
    environment.emit(Events.FETCH, {tag, input, init})
  })
}

global.fetch = fetch
global.Headers = Headers
global.Request = Request
global.Response = Response

export default fetch
