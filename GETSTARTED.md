## Writing a Feature

[Feature](https://apps.other.chat/docs/Feature.html) is the base unit of other.js. Perhaps unsurprisingly, a Chatternet feature is simply an ES6 module that exports an instance of the Feature class.

From there, nearly all features will want to use its high level API to listen and respond to events. For example, to automatically replace the word "The" with "Teh" in all user input, one could write:
```js
new Feature({name: 'Teh hotnezz'}).listen({
  to: {words: ['The']},
  on() => ({stagedMessage: {text: 'Teh'}})
})
```

### Installing

1. To start developing, send a [gist](https://gist.github.com/) link to any https://other.chat/ channel. The file must end in `.other.js`. Recommended: If you want it to update with new commits, use a link of the form `https://gist.githubusercontent.com/{user}/{gist}/raw/{file}.other.js`. To pin it, use `https://gist.githubusercontent.com/{user}/{gist}/raw/{commit}/{file}.other.js`
1. Tap the link to install it. Use it! Share it!

### Development cycle

A quick dev loop is currently under development. For now,
1. Ensure you're using a gist link that isn't pinned to a specific commit (see installing above).
1. Commit changes to your gist.
1. Tap the link to reload it.

### Using the network

The [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is exported by other.js and available to features in the `global` object. Fetching JSON, for example, looks like:
```js
fetch('https://example.com/endpoint').then(response => response.json()).then(json => {
  console.log(json)
})
```

## Examples

**Builtins** these features are built into Other Chat by default. They're useful learning examples.

* [Core](https://github.com/other-xyz/other.js/blob/master/builtins/core.other.js) &mdash; start here
* [Donger](https://github.com/other-xyz/other.js/blob/master/builtins/donger.other.js) &mdash; (⊙_☉)
* [Rechat Simple](https://github.com/other-xyz/other.js/blob/master/builtins/rechat.other.js) &mdash; a simplified rechat implementation that doesn't require selecting a message

**Toy examples**

* [Echo](https://github.com/other-xyz/other.js/blob/master/examples/echo.other.js) &mdash; a trivial example of a feature that runs on the server.
* [Map](https://github.com/other-xyz/other.js/blob/master/examples/map.other.js) &mdash; display a map chat completion when "map" is typed
* [Search](https://github.com/other-xyz/other.js/blob/master/examples/search.other.js) &mdash; display a search results when "search" is typed
* [Translate](https://github.com/other-xyz/other.js/blob/master/examples/translate.other.js) &mdash; display translations of user input

**Pseudo** non functioning inspiration that will be ported to other.js as functionality is implemented.

* [Base Behaviors](https://github.com/other-xyz/other.js/blob/master/pseudo/core/base.pseudo.js) &mdash; start here
* [Channel Mentions](https://github.com/other-xyz/other.js/blob/master/pseudo/core/channel-mentions.pseudo.js) &mdash; link-back posted to channels are mentioned in another channels
* [Kick](https://github.com/other-xyz/other.js/blob/master/pseudo/core/kick.pseudo.js) &mdash; kicks a user from a channel for 1 minute, uses data stored on channels and runAsServer
* [ETA, Find](https://github.com/other-xyz/other.js/blob/master/pseudo/core/map.pseudo.js) &mdash; maps and places
* [Points](https://github.com/other-xyz/other.js/blob/master/pseudo/extras/points.pseudo.js) &mdash; explores how new social features are added and self-teach, uses data stored on users
* [Rechat](https://github.com/other-xyz/other.js/blob/master/pseudo/core/rechat.pseudo.js) &mdash; the core command! also: selecting a message
* [Twitter](https://github.com/other-xyz/other.js/blob/master/pseudo/apps/twitter.pseudo.js) &mdash; putting it all together, channels as app, identity creation
* [Web](https://github.com/other-xyz/other.js/blob/master/pseudo/core/web.pseudo.js)

## Under the hood

While it requires more care, it's also possible to interact directly with
[UserAgent](https://apps.other.chat/docs/UserAgent.html) or [Chatternet](https://apps.other.chat/docs/Chatternet.html) events. For example, an incomplete implementation of the above might look roughly like:
```js
const feature = new Feature({name: 'Teh hotnezz'})
feature.userAgent.on(SET_STAGED_MESSAGE, event => {
  const {message, tag} = event
  if (message.text.indexOf('The') !== -1) {
    feature.userAgent.emit(UPDATE_STAGED_MESSAGE, {
      replyTag: tag,
      message: message.replace('The', 'Teh')
    })
  }
})
```
