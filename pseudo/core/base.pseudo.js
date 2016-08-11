const {Feature} = require('other')

// This sketch of other.js is centered around trying to build as much of
// Otherchat's features in other.js as possible. It focuses on the base
// commands. While thinking forward to 3rd party extensions and their permission
// model, this exploration focuses on letting us build quickly.

// The API key is tied to the developer and dictates the overall permissions of
// the other.js. Permissions for specific features and commands can be
// set from a web interface and/or in code.
//
// Data storage is built-in to Other Script. Both user and channel objects have
// a .data property, and can be written to and read from via .set(key, value)
// and .get(key).
//
// Behind the scenes, this is backed by a key-value store. The tuple
// (apiKey, userOrChannelId, key) makes a convinient key, and allows for
// features that share an API key to share data.
//
// Further data security measures are, without a doubt, needed.
const feature = new Feature({
  name: 'Other Chat Base Behaviors',
  description: 'The basic behaviors of Other Chat',
  version: '0.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e' // root ;)
})

// This is the object used to script the Other Chat client. It's permissions
// are scoped by the feature passed in. Many of the features used in this file
// would not be available in this unguarded fashion to extension authors.
const userAgent = feature.userAgent

// AT MESSAGE COMPLETE

// The most basic of all chat completes is the @mention. It also shows the
// basics of writing a chat complete command. This command, runs entirely
// on the client.
//
//   token - what the user types to get the command
//   accepts - the kinds of things the command for input
//
// accepts is a dictionary that maps a type to the property it is accessible by
// in the context argument of a handler. For example, in this command the string
// containing what the user typed after the command token will accessible
// in context.query. Generally speaking, all commands accept at least this type.

const mentionCommand = feature.command({
  tokens: ['@'],
  version: 'user.0.1',
  name: '@mention complete',
  accepts: {query: String}
})

// The didQuery event handler is trigger when the user enters something after
// the command token. The handler is passed two arguments:
//
//   context - all the things the event handler needs to do its thing
//   didQuery - the promise by which the handler communnicates with the caller

mentionCommand.on('didQuery', (context, didQuery) => {
  // Find all users the client knows that match the query
  otherchat.client.users.find(context.query).then(users => {
    // Then sort those users by membership in the current channel first,
    // then by their .relevance (a server calculated value) second
    const sortedUsers = users.sortBy(user => [user.isMemberOf(otherchat.client.currentChannel), user.relevance])

    // Then pass back the list of sorted, matching users to the Other Chat
    // client (which is who made the call) as chat complete results.
    //
    // {user: user, action: 'whisper'} is short for:
    // otherchat.types.chatCompleteResult({ user: user, action: 'whisper' })
    //
    // The promise interprets dictionaries as the default chat complete result
    // type.
    //
    //   user - the client knows how to display a result based on the properties
    //          set, in this case each row is displayed as a user
    //   action - the name of the action button
    const results = sortedUsers.map(user => ({user, action: 'whisper'}))
    didQuery.resolve(results)
  })
  // Something went wrong with the search, abort!
  .catch(reason => didQuery.reject(reason))
})

// When the action button is tapped, cause the client to navigate to the
// selected user's whipser channel.

mentionCommand.on('didAction', selected => {
  userAgent.navigate(selected.user.whisperChannel)
})

// CHANNEL COMPLETE

// Very similar to the last. The promise is passed on object with the channel
// property set, so they display as a channel chat complete row.

const hashCommand = feature.command({
  tokens: ['#'],
  version: 'channel.0.1',
  name: '#channel complete',
  accepts: {query: String}
})

hashCommand.on('didQuery', (context, didQuery) => {
  otherchat.client.channels.find(context.query).then(channels => {
    const results = channels
      .map(channel => ({channel, action: 'go'}))
      .sortBy(['relevance', 'createdAt'])

    didQuery.resolve(results)
  }).catch(reason => didQuery.reject(reason))
})

hashCommand.on('didAction', selected => {
  userAgent.navigate(selected.channel)
})

// INVITE COMMAND
//
// The invite command introduces three concepts. Accepting types other than
// the query String, allowing multiple selections, and running code on the
// server.

const invite = feature.command({
  tokens: ['invite'],
  version: 'invite.0.2',

  // Accepts both an array of users as well as the arbitrary query string for
  // finding users.
  accepts: {users: [otherchat.types.user], query: String},

  // Chat completes allow for multiple selection, huzzah!
  allowsMultipleSelection: true
})

// When the invite command is invoked...
invite.on('didQuery', (context, didQuery) => {
  // Search for the user's who match the query
  otherchat.client.users.find(context.query).then(users => {
    // Map the users to user chat completes with invite action
    const results = users.map(user => ({user, action: 'invite'}))

    // And display them
    return didQuery.resolve(results)
  }).catch(reason => didQuery.reject(reason))
})

// TODO: How are we showing hint/explanation text for these multi-selection
// comamnds? Needs design from Mike on user interface.

// When an action button is activated, add the selected user to the context.
// When an action button is deactivated, remove them from the context.
invite.on('didAction', (context, doAction) => {
  const {selected} = context

  // Modifies the context which gets passed into event handlers
  if (selected.action.isActive) context.users.append(selected.user)
  else context.users.remove(selected.user)

  doAction.resolve()
})

// When the user taps the send/done button (how a user indicates being done with
// a multi-selection chat complete command), make the user a member of the
// channel, and post a system message marking the invitation.
//
// This is the first time we'll see running code on the server in action.
invite.on('didFinish', (context, doFinish) => {
  const currentChannel = userAgent.channel()
  const info = {users: context.users, by: otherchat.client.me}

  // When we run code on the server, it doesn't have access to anything derived
  // from the client except what is serialized through the info argument (and
  // available on the server context object).
  //
  // The closure's code is run on the server. Available in it's scope is
  // anything in this scripts global name space.
  //
  // The server automatically catches any throws from the await calls and passes
  // them along to the promise returned by .runAsServer.
  //
  // Everything done within a .runAsServer closure is atomic. If one error is
  // thown, everything is rolled back so that nothing is left in a weird or
  // inconsistent state.
  currentChannel.runAsServer(info, serverContext => {
    const {channel, info} = serverContext

    // Make the user a member of the channel, and post a system message to the
    // channel marking the invitation.
    channel.addMembers(info.users).then(() => {
      channel.post({
        format: 'system',
        body: `${info.by} invited ${info.users} to ${channel}`
      })
    })
  })
  .then(() => doFinish.resolve())
  .catch(reason => doFinish.reject(reason))
})

// TODO: Mute
// TODO: Rechat
// TODO: Todo app

// NOTES:
//
// Localization is an open question, though I think string templates will be
// a good place to look for an answer.
//
// There's a problem with the explanation text on multiple selects conflicting
// with where you type. Maybe changes the "send" button to "invite"
//
// How about...
// If an @name is entered by typing, deleting works like normal: character to character.
// If an @name is entered via chat complete, the name is deleted as a block
