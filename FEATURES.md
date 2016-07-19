# Other Features

Like a web browser, Other Chat is a User Agent. That is, an agent which acts on _behalf of the user_! This document describes how Other Chat's extensible platform (aka [Features](https://github.com/other-xyz/otherscript.pseudo.js/blob/master/README.md)) operate on behalf of the user.

## Terminology

- **Identity**: An entity which may read and post Chatternet events.
- **Channel**: A stream of Chatternet events.
- **Feature**: A unit of possibly third-party code which extends Other Chat client functionality.
- **Bot**: A Feature which also has its own Identity.
- **Idenity Feature** and **Account Feature**: Features which are carried by a user to channels.
- **Channel Feature**: Features which are installed on channels.
- **Feature Bundle**: A bundle of multiple related Features.

## User bill of rights

### The input box is sacred

It's our equivalent of the browser's URL bar. It lets the user know who they are, where they are and how to interact with the channel in a predictable way. Beyond changing a theme color, its elements may not be changed, resized or customized in any other way. It's always visible and nothing may draw over it (with the exception of fullscreen apps and media). The sidebar may fall into this same category, but that's still TBD.

### Never send a message on user's behalf

The "send" button is the _only_ way to send a message. All message modifications, insertions and completions stage the content for the user to send (current proposal: for media, selecting adds +1 to the send button; you add text in the normal input field; and you can select multiple types of media each with +1 to the send button).

Bots are bots and humans are humans. Features and bots have their own identity.

If extensions post on behalf of the user, they are clearly marked as coming from an extension (e.g. clicking on them reveals which extension is posting. This function stacks as a word-of-mouth discovery mechanism for new features).

## Applicability

Any Feature may be applied at four distinct levels: `channel`, `identity`, `account` and `builtin`.
- Where in conflict, they take precedence in that order. For example, a channel's color scheme overrides an identity's, which overrides an account's.
- Where compatible, they're additive. For example, an identity's word tokens are added to the builtin hotwords.

## Installation

Channel Features may only be installed by channel owners (ie. the creator and their delegates). Identity and Account Features are obviously installed by the identity/account owner. Builtin Features ship with the client (we'll likely come up w/ a scheme to update them more frequently than the client itself which supports A/B testing).

Installation may be initiated by:
  1. Clicking a link from within the client.
  1. Clicking a link from outside the client (e.g. a web browser) which deep links into the client.
  1. Attaching a Feature URL to a message or channel (e.g. a message may declare that a particular renderer should be installed to view it). However, all messages must be serializable to a primitive (mostly textual) representation. In some cases, this allows graceful degradation when the Feature isn't installed. In the most degenerate case, it just displays a link to install that Feature.

Features which don't require permissions are applied automatically, otherwise the user is prompted to grant its permissions. Channel Feature permissions are accepted by the channel owner. Their behaviors should be safe for channel visitors.

UI for determining the level to apply the Feature to is TBD.

We explicitly **do not** hardcode any privileged aggregation of Features (ie. an App Store). This would make us responsible for policing the content and isn't in line with the *early web feels*. Search engines and curated lists may freely evolve in the ecosystem. This being said, we'll likely have a default landing channel (e.g. `#welcome`) that has some sort of "spotlight" curated list and/or search functionality. The key is that other than being the default landing, it otherwise enjoys no special capabilities.

## Capabilities

### Permissionless

- Provide simple, declarative themes (e.g primary color, accent color, sound set, icon set).
- Provide IME buttons. Builtin buttons are provided that hook device capabilities like camera roll, audio input, etc.
- Customize button slots in the IME bar (e.g. donger could be a first class citizen next to audio input, or giphy could just replace audio input).
- Suggest (ChatComplete)
- Render a message which it sent

### Conditionally permissionless
Permissionless when in combined with **only** the above "permissionless" capabilities and **not** each other or the below "permission guarded" capabilities.
- Access the network
- Read channel messages

### Permission guarded

- Post messages to the channel
- Configure channel properties (e.g. who can post, readonly)
- Render a message list
- Render an arbitrary message
- Run in background on server (probably as Lambda)
- Run in background on client

### Examples

- A [Twitter feed](https://github.com/other-xyz/otherscript.pseudo.js/blob/master/apps/twitter.pseudo.js) could be implemented as a Channel Feature which polls on the server and posts messages to the channel.
- A Starbucks ordering app could be implemented as a message list renderer which always displays an ordering UI above the message list (or perhaps doesn't even display the message list).
- An extended-local store. A la Instagram boutiques. Imagine an IME button that nav to #knifeman/store with a set of knives with buy buttons.
- [Rock, Paper, Scissors](https://github.com/other-xyz/otherscript.pseudo.js/blob/master/extras/rock-paper-scissors.pseudo.js) could be implemented as a pure logic Feature, which requires another (probably builtin) Feature renderer that displays a customizable set of action buttons on a message. This has the advantage of lower barrier to entry through code reuse, greater UI consistency and potential for more performance implementation by using native widgets instead of web.
- TBD: [Moar, many moar](https://docs.google.com/document/d/1qhH74PRk9RdMLszV2PVMZniIgtpVxyG6e4-1fcA5Qmc/edit#)

## Development

The platform follows similar principles to the [Rational Web Platform](https://docs.google.com/document/d/1ZkV1PpPsJJgdSZOA10Jh0VrThR6D_Q0XWv_2B9-0gGE/edit). That is, rational layers of abstraction, no "magic", etc.

All third party Features are implemented in JavaScript. Builtin Features may also be implemented in any native language in order to expose native capabilities, however, we try to implement as many in JS as possible in order to share code and eat our own dogfood.

We aim to make the lowest friction development environment possible. Everything should be view sourcable, forkable, hackable. Zero to hello world should be < 2 minutes. Designing such a system is out of scope of this document.

## TBD
- @aza: Features also apply at the message level and feature level
- @aza: How do ChannelSets fit?
- @tonygentilcore: Explain Rechat via containers with references. Entities may then hang off of the referenced entity or the container.
- @tonygentilcore: Explain using references for content (like a Twitter feed) whose source of truth isn't in courier.
