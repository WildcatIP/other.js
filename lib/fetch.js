import 'isomorphic-fetch'
import * as Events from './Events'
import {environment} from './environment'

let nextTag = 1

function fetch(input, init) {
  const tag = nextTag++
  return new Promise((resolve, reject) => {
    const onResponse = event => {
      if (event.replyTag !== tag) return
      resolve(new global.Response(event.body, event.options))
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

export default fetch
