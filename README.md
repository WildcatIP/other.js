# <img src="https://web.other.chat/images/favicon.png" height="18" width="18" /> other.js [![Build Status](https://travis-ci.com/other-xyz/other.js.svg?token=96rqAKq1wuu7waxjVyTg&branch=master)](https://travis-ci.com/other-xyz/other.js) [![chat](https://img.shields.io/badge/chat-%23otherjs-919cff.svg)](https://web.other.chat/#/channel/740c2b85b3ad45509a59168891a58f74)

other.js is a JavaScript library for building Chatternet features.

* **Rational** Multiple layers of abstraction, each explained in terms of the layer beneath, without "magic" (à la the [Rational Web Platform](https://docs.google.com/document/d/1ZkV1PpPsJJgdSZOA10Jh0VrThR6D_Q0XWv_2B9-0gGE/edit)).
* **Robust** There's no need to think about environment. Features are written in vanilla [es6](http://es6-features.org/) code that is adapted to execute across our environments as needed ([Node.js](https://nodejs.org/) on the server, [JavaScriptCore](http://nshipster.com/javascriptcore/) on iOS and [modern browsers](http://browsehappy.com/) on the web).
* **Ready to hack** Feature code is readable, succinct and pickup-able. We don't make assumption about the rest of your technology stack, so you can bring your fancy build process or just start typing.

See [motivation](MOTIVATION.md).

## Get started

Start here for [feature creation documentation](https://apps.other.chat/docs/index.html).

## Examples

### Core

* [Base Behaviors](pseudo/core/base.pseudo.js) &mdash; start here
* [Kick](pseudo/core/kick.pseudo.js) &mdash; kicks a user from a channel for 1 minute, uses data stored on channels and runAsServer
* [Rechat](pseudo/core/rechat.pseudo.js) &mdash; the core command! also: selecting a message
* [Rechat Simple](pseudo/core/rechat-simple.pseudo.js) &mdash; an implementation that doesn't require selecting a message
* [Map, ETA, Find](pseudo/core/map.pseudo.js) &mdash; maps and places
* [Channel Mentions](pseudo/core/channel-mentions.pseudo.js) &mdash; link-back posted to channels are mentioned in another channels
* [Web](pseudo/core/web.pseudo.js)

### Apps

* [Twitter](pseudo/apps/twitter.pseudo.js) &mdash; putting it all together, channels as app, identity creation

### Extras

* [Points](pseudo/extras/points.pseudo.js) &mdash; explores how new social features are added and self-teach, uses data stored on users

## Specification

### Terminology

- **Chatternet**: A "Turing complete" social network. It's the web on which we surf.
- **Channel**: A stream of Chatternet events.
- **Identity**: An entity which may read and post Chatternet events.
- **Feature**: A unit of possibly third-party code which extends Other Chat functionality.
- **Bot**: A Feature which also has its own Identity.
- **Identity Feature** and **Account Feature**: Features which are carried by a user to channels.
- **Channel Feature**: Features which are installed on channels.
- **Feature**: A package of functionality (e.g. one more more Commands) which extend the Chatternet and/or a user agent.

See the [Features specification](FEATURES.md).

## Contribute

See [contribution instructions](CONTRIBUTING.md) to contribute to the other.js library.

See [embedding instructions](EMBEDDING.md) for embedding other.js in a client.
