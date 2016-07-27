# Embedding

## Environment preparation

To prepare an environment, embedding clients must inject [other.min.js](https://apps.other.chat/other.min.js) as a [commonjs2](http://requirejs.org/docs/commonjs.html) module into a fully sandboxed, [es6](http://es6-features.org/) compliant execution environment. Sandboxed means that the script must be incapable of accessing any information or producing any effects outside of the environment (e.g. no disk access, no network access, no window object, no DOM access).

See an [example](https://github.com/other-xyz/other-chat-web/blob/master/feature.html) of such an environment running in a web browser.

## Feature execution

To execute a feature, the feature's source must be fetched and injected as a [commonjs2](http://requirejs.org/docs/commonjs.html) module into a freshly [prepared environment](#environment-preparation) (ie. one that has no other features in it). Then the module's default `export` must be executed with the ability to `require` the `other.js` module.

## Feature host requirements

Embedders must provide a host which interacts with the other.js library by emitting and handling events.

To emit an event, invoke `emit()` on any other.js object that extends `EventEmitter`. For example:

```js
module.exports.userAgent.emit('SET_STAGED_MESSAGE', {text: 'hello world'})
```

To listen for events, invoke `on()`, `once()` or similar on any other.js object that extends `EventEmitter`. For example:

```js
module.exports.userAgent.on('SET_CHAT_COMPLETE_RESULTS', event => {
  console.log(event.results)
})
```

For full reference, see the [event documentation](file:///work/other.js/dist/docs/module-other.html).

For an example, see the web client's [FeatureHost](https://github.com/other-xyz/other-chat-web/blob/master/middleware/features.js).
