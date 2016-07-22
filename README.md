# <img src="https://web.other.chat/images/favicon.png" height="18" width="18" /> other.js [![Build Status](https://travis-ci.com/other-xyz/other.js.svg?token=96rqAKq1wuu7waxjVyTg&branch=master)](https://travis-ci.com/other-xyz/other.js) [![chat](https://img.shields.io/badge/chat-%23otherjs-919cff.svg)](https://web.other.chat/#/channel/740c2b85b3ad45509a59168891a58f74)

The Chatternet feature platform

## Introduction

Its goals are to be: readable, never clever, succinct, pickup-able, and simultaneously [hackable and robust](#inspirations).

A particular Chatternet feature pack might require behavior that changes both server and client behavior. For example, a guild's extension might modify the behavior of the guild channel, create new social/structural behaviors that mirror the guild's governance, and install a chat command for members to interact with the guild bank. To minimize dW, a complete Chatternet feature pack is written in a single file, which can be run both on the server and in the client.

What is a feature pack? A bundle of behavior. You can add new feature packs to Other Chat by having someone send you a link, then click to install.

Cue dialogue...

TWO FRIENDS TALKING OTHER CHAT:

> "Have you tried any WoW sets that you liked?"

> "Yeah, here's the one I use."

> _sends link_

> _installs, does setup flow, oauths to his account_

> "Cool. I like that it lets me be my character on here... love that she gets her own channel!"

> "You should also try the item search and you can check auction prices with 'auction'."

### Terminology

- **Chatternet**: A "Turing complete" social network. It's the web on which we surf.
- **Channel**: A stream of Chatternet events.
- **Identity**: An entity which may read and post Chatternet events.
- **Feature**: A unit of possibly third-party code which extends Other Chat functionality.
- **Bot**: A Feature which also has its own Identity.
- **Identity Feature** and **Account Feature**: Features which are carried by a user to channels.
- **Channel Feature**: Features which are installed on channels.
- **Feature Pack**: A package of multiple related Features.

## Getting started

*TBD: Create user docs*

## Contributing

[contributing](CONTRIBUTING.md)

## Specification / technical details

See the [Features proposal](FEATURES.md).

## Motivation

[motivation](MOTIVATION.md).

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
