# Motivation

## Building ourselves with ourselves

Implementing much of Other Chat in other.js has some benefits:

- It forces a clean separation of base Chatternet/client infrastructure from our feature logic: which minimizes the part of the client that has to be ported and tested platform to platform; and creates a clear line along which we can open source.
- Let's us make strong assertions about security. other.js is hermetically sealed from the rest of it's host, and can be passed objects with just the permissions they need.
- Increases the number of us able to prototype and implement features and behaviors.
- Provides a way to update client behavior across all platforms on the fly, roll out features to specific communities, and rollback miss-behaving functionality.
- Allows us to automatically build granular usage and telemetry analytics for feature packs. Imagine being able to test and compare multiple versions of our commands in the wild at the same time, with comparative analytics, and then tweaking behavior just right in realish time. The analytics we need to craft our feature packs will be the same analytics the community will want.
- We work with and in the same tools as everyone else. This aligns '_us making what the community needs_' with '_us making what we need_'.

## Extensible community

Imagine you start a channel around `#manatees`. It stays small for a while. Then a vibrant community starts to grow, and soon the channels needs mods and manatee specific flagging. So you look around and find a feature pack with the right features and install it on `#manatees`. A little later, you decide to start `#manatees/news` and install a blog feature, so you and the other mods can compose posts on the web, pulling stuff in with a bookmarklet. Later, you install a store feature to sell your `#manateeshirts`, and swap your officer features for a new one you heard about in `#communities`.

other.js lets you attach new functionality to any community, upgrading its abilities on the fly. It's an expressiveness and flexibility unique to us, and a strategic competitive advantage: if it's us against Facebook, we can't win; with other.js it's Facebook against everybody, which they can't win.

## Inspirations

- One of the most inspiring aspects of Swift, for me, has been how it's idioms forces me to write robust code with only minimal sacrifice to hackability. I'd like to learn from that in the design of other.js, so that the fastest way to express some behavior in other.js is also a robust way to express it.
- I think of jQuery as a kind of Javascript DSL. It has a remarkable property: people who say they don't know Javascript can still use jQuery! From this we can learn. And also from it's hackably-robust chaining API.
- The web. It's so expressive and malleable. On the web, everything is a webpage; in Other Chat everything is a channel.

## Random notes

(!!!: What's the philosophy for how we handle updates? On install, we can take a snapshot of the code, host a versioned, checksumed etc version on our servers?)

* Is Web an Other supplied library? Is it useful to default own this level of search strategically?

* How should help work? Thought: add a question mark to the end of any command, and it brings up a bottom sheet with the contents of that extension's `#:/help`, just like for channel details/rules.