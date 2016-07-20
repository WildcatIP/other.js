# <img src="https://web.other.chat/images/favicon.png" height="18" width="18" /> other.js

The Chatternet feature platform

## Introduction

Its goals are to be: readable, never clever, succinct, pickup-able, and simultaneously [hackable and robust](#inspirations).

A particular Chatternet feature set might require behavior that changes both server and client behavior. For example, a guild's extension might modify the behavior of the guild channel, create new social/structural behaviors that mirror the guild's governance, and install a chat command for members to interact with the guild bank. To minimize dW, a complete Chatternet feature set is written in a single file, which can be run both on the server and in the client.

What is a feature set? A bundle of behavior. You can add new feature sets to Other Chat by having someone send you a link, then click to install.

Cue dialogue:

TWO FRIENDS TALKING OTHER CHAT — Have you tried any WoW sets that you liked? — Yeah, here's the one I use. _(sends link)_ — _(installs, does setup flow, oauths to his account)_ Cool. I like that it lets me be my character on here... love that she gets her own channel! — You should also try the item search and you can check auction prices with 'auction'.

## Getting started

*TBD: Create user docs*

## Contributing

[contributing](CONTRIBUTING.md)

## Building ourselves with ourselves

Implementing much of Other Chat in other.js has some benefits:

- It forces a clean separation of base Chatternet/client infrastructure from our feature logic: which minimizes the part of the client that has to be ported and tested platform to platform; and creates a clear line along which we can open source.
- Let's us make strong assertions about security. other.js is hermetically sealed from the rest of it's host, and can be passed objects with just the permissions they need.
- Increases the number of us able to prototype and implement features and behaviors.
- Provides a way to update client behavior across all platforms on the fly, roll out features to specific communities, and rollback miss-behaving functionality.
- Allows us to automatically build granular usage and telemetry analytics for feature sets. Imagine being able to test and compare multiple versions of our commands in the wild at the same time, with comparative analytics, and then tweaking behavior just right in realish time. The analytics we need to craft our feature sets will be the same analytics the community will want.
- We work with and in the same tools as everyone else. This aligns '_us making what the community needs_' with '_us making what we need_'.

## Specification / technical details

See the [Features proposal](FEATURES.md).

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

## Extensible community

Imagine you start a channel around `#manatees`. It stays small for a while. Then a vibrant community starts to grow, and soon the channels needs mods and manatee specific flagging. So you look around and find a bundle with the right features and install it on `#manatees`. A little later, you decide to start `#manatees/news` and install a blog feature, so you and the other mods can compose posts on the web, pulling stuff in with a bookmarklet. Later, you install a store feature to sell your `#manateeshirts`, and swap your officer features for a new one you heard about in `#communities`.

other.js lets you attach new functionality to any community, upgrading its abilities on the fly. It's an expressiveness and flexibility unique to us, and a strategic competitive advantage: if it's us against Facebook, we can't win; with other.js it's Facebook against everybody, which they can't win.

---

## Inspirations

- One of the most inspiring aspects of Swift, for me, has been how it's idioms forces me to write robust code with only minimal sacrifice to hackability. I'd like to learn from that in the design of other.js, so that the fastest way to express some behavior in other.js is also a robust way to express it.
- I think of jQuery as a kind of Javascript DSL. It has a remarkable property: people who say they don't know Javascript can still use jQuery! From this we can learn. And also from it's hackably-robust chaining API.
- The web. It's so expressive and malleable. On the web, everything is a webpage; in Other Chat everything is a channel.


--------------------------

### Random notes

(!!!: What's the philosophy for how we handle updates? On install, we can take a snapshot of the code, host a versioned, checksumed etc version on our servers?)

* Is Web an Other supplied library? Is it useful to default own this level of search strategically?

* How should help work? Thought: add a question mark to the end of any command, and it brings up a bottom sheet with the contents of that extension's `#:/help`, just like for channel details/rules.
