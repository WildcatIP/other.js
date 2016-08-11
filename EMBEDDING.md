# Embedding

## Environment preparation

To prepare an environment, embedding clients must inject a [supported version](#versioning) of `other.min.js` (e.g. https://apps.other.chat/otherjs/0.0.x/other.min.js) as a [commonjs2](http://requirejs.org/docs/commonjs.html) module into a fully sandboxed, [es6](http://es6-features.org/) compliant execution environment. Sandboxed means that the script must be incapable of accessing any information or producing any effects outside of the environment (e.g. no disk access, no network access, no window object, no DOM access).

See an [example](https://github.com/other-xyz/other-chat-web/blob/master/feature.html) of such an environment running in a web browser.

## Feature execution

To execute a feature, the feature's source must be fetched and injected as a [commonjs2](http://requirejs.org/docs/commonjs.html) module into a freshly [prepared environment](#environment-preparation) (ie. one that has no other features in it). Then the module's default `export` must be executed with the ability to `require` the `other.js` module.

## Feature host process

Embedders must provide a host which interacts with the other.js library by emitting and handling events.

To emit an event, invoke `emit()` on any other.js object that extends `EventEmitter`. For example:

```js
module.exports.userAgent.emit('UPDATE_STAGED_MESSAGE', {text: 'hello world'})
```

To listen for events, invoke `on()`, `once()` or similar on any other.js object that extends `EventEmitter`. For example:

```js
module.exports.userAgent.on('SET_CHAT_COMPLETE_RESULTS', event => {
  console.log(event.results)
})
```

An embedder may choose to implement any set of events. The set of events it implements determines whether a particular feature can execute within that host. For example, a server-side host should implement all [Chatternet](https://apps.other.chat/docs/Chatternet.html) events but cannot implement [UserAgent](https://apps.other.chat/docs/UserAgent.html) events. While a client-side host should implement applicable [UserAgent](https://apps.other.chat/docs/UserAgent.html) events and may optionally implement [Chatternet](https://apps.other.chat/docs/Chatternet.html) events.

## Versioning

* An embedder must implement compatibility with one or more `MAJOR.MINOR.x` versions of other.js. It should remain agnostic of `PATCH`. Compatibility means supporting all of the [events](#feature-host-process) expected by that version of other.js.
* When [preparing the environment](#environment-preparation) to execute a feature, the embedder must verify that it can satisfy the feature's dependencies.
* Since each feature is completely isolated in its runtime context, an embedder may inject different versions of other.js into different containers. As long as dependency requirements are met, features are guaranteed to work together even across different `MAJOR` versions of other.js.

## Reference

For full reference of supported events and their semantics, see the [event documentation](https://apps.other.chat/docs/index.html).

For a reference embedder implementation, see the web client's [FeatureHost](https://github.com/other-xyz/other-chat-web/blob/master/middleware/features.js).
