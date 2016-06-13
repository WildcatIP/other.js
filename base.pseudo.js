// This sketch of Otherscript is centered around trying to build as much of
// Otherchat's features in Otherscript as possible. It focuses on the base
// commands. While thinking forward to 3rd party extensions and their permission
// model, this exploration focuses on letting us build.
//
// Otherscript uses the latest in ecmascript 6 (and sometimes 7!). While
// not all of these features are [supported](http://kangax.github.io/compat-table/es6/)
// by JavascriptCore on iOS, both [Google](https://github.com/google/traceur-compiler) and
// [Facebook](http://facebook.github.io/regenerator/) have open-source code regenerators
// that converts the future into complaint ECMAScript 5.
//
// In particular, these features are awesome:
// - [async/await](https://github.com/tc39/ecmascript-asyncawait)
// - [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
// - [string literals that allow embedded expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
// - [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
//

var Time = require('other-time') // Legendary time utilities from the future

// All features that share an API key can share data. Perhaps permissions can
// be set for an api key via a web interface.

var feature = new OtherchatFeature({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e', // root ;)
  version: 'base.0.1'
})

// Scoped access to Other Chat via the feature's permissions
var otherchat = new Otherchat( feature )


// 
// AT MESSAGE COMPLETE
//

var mentionCommand = feature.command({
  tokens: ['@'],
  version: 'user.0.1',
  accepts: {query: String} // this is the default
})


mentionCommand.on('didQuery', (context, promise) => {

  otherchat.client.users.find(context.query).then( users => {

    // Show the members of the current channel first, then sort by .relevance
    // (which is server calculated)

    users = users.sortBy( user => [user.isMemberOf( client.currentChannel ), user.relevance] )

    var results = users.map( user => ({user: user, action: 'whisper'})
    promise.resolve( results )

  }).catch( reason => promise.reject(reason) )
  
})


mentionCommand.on( 'didAction', selected => {
  client.navigateTo( selected.user.whisperChannel )
})


// 
// CHANNEL COMPLETE
//

var hashCommand = feature.command({
  tokens: ['#'],
  version: 'channel.0.1'
})


hashCommand.on('didQuery', (context, promise) => {

  otherchat.client.channels.find(context.query).then( channels => {

    var results = channels
                    .map( channel => ({channel: channel, action: 'go'})
                    .sortBy(['relevance', 'createdAt')

    promise.resolve( results )

  }).catch( reason => promise.reject( reason ) )

})


hashCommand.on('didAction', selected => {
  client.navigateTo( selected.channel )
})



// 
// INVITE COMMAND
//
// As per the new spec hotness, you can select multiple people and invite
// them all at once. This command shows server side goodness.
//

//
// The accepts field allows programatic calling of commands:
// otherchat.client.command('invite', {users: [...]})
//
// Inside of an event handler, this.context can be modified
//

var invite = feature.command({
  tokens: ['invite'],
  version: 'invite.0.2',
  // Accepts both an array of users as well as an arbitrary query string for
  // searching users.
  accepts: {users: [otherchat.types.user], query: String},
  allowsMultipleSelection: true
})


invite.on('didQuery', (context, promise) => {
  
  otherchat.client.users.find(context.query).then( users => {

    var results = users.map( user => ({user: user, action: 'invite'}) )

    // TODO: How are we showing hint/explanation text for these multi-selection
    // comamnds? Needs design from Mike on user interface.

    return promise.resolve( results )

  }).catch( reason => promise.reject( reason ) )

})

invite.on('didAction', selected => {

  // Modifies context, which gets passed into event handlers
  
  if(  selected.action.isActive ) this.context.users.append( selected.user )
  else this.context.users.remove( selected.user )

})


// The didFinish event is available for multiple-selection chat completes
// and is fired when the user taps the send/done button

invite.on('didFinish', (context, promise) => {
  
  var currentChannel = otherchat.client.currentChannel,
      info = { users: context.users, by: client.me }

  currentChannel.asServer( info, serverContext => {

    var channel = serverContext.channel,
        info = serverContext.info

    await channel.addMembers( info.users )
    await channel.post({
      type: 'system'
      body: `${info.by} invited ${info.users} to ${channel}`
    })

  })
  .then( () => promise.resolve() )
  .catch( reason => promise.reject(reason) )

  // All actions in asServer are done atomically, so if there is an
  // error, we aren't left in weird state

})



//
// KICK
// Kicks a user for the channel and bans them from entering for 1 minute
// Would be nice to include: "kick @blah 10 minutes"
//

var kickCommand = feature.command({
  tokens: ['kick'],
  version: 'kick.0.1',
  accepts: {user: otherchat.types.user, query: String}
})

var checkIfKicked = otherchat.type.serverEventHandler({
  // unique means that this handler will only be installed once, no matter
  // how many times you .on() with it.
  unique: true,
  handler: (context, promise) => {

    // Note: server-side handlers should only use data passed into the handler
    // and global things like modules. Variables that get defined by the client
    // won't be available in this scope, and so if used will cause errors.

    var channel = context.channel

    try {

      var blacklist = await channel.data.get( 'blacklist', [] ),
          rule = blacklist.filter( rule => rule.user == context.user ).first()

      // If the user is still kicked, keep them from entering and post a
      // system message only they can see saying why they cannot enter.

      if( rule && Date.now() <= rule.until ){
        
        await channel.post({
          type: 'system',
          text: `You have been kicked from ${channel} for another ${Time.howLongUntil(rule.until)} minutes`,
          whoCanSee: [context.user]
        })

        // Prevent default action, i.e., entering the channel
        return promise.resolve( false ) 

      }
      
      // If the kick has run out, remove the blacklist rule
      else if( rule ){
        blacklist.remove( rule )
        await channel.data.set( 'blacklist', blacklist )
      }

      // If there are no blacklist rules, uninstall the event handler
      if( blacklist.length == 0 ) await channel.off('userWillEnter', kickedHandler)

      // Finally, allow default action to let the user into the channel
      promise.resolve( true )

    }

    catch( error ) promise.reject( error )

  }
})


kickCommand.on('didQuery', (context, promise) => {
  
  var channelMembers = otherchat.client.currentChannel.members
  
  channelMembers.find({ query: context.query }).then( users => {
    var results = users.map( user => ({user: user, action: 'kick'}) )
    promise.resolve( results )
  })
  
})


kickCommand.on('didAction', (selected, promise) => {
  
  // Can programatically called from another command via
  // otherchat.client.command('kick', {user: aUser})

  var kickedUser = selected.user, // will exist because of accepts field
      theChannel = otherchat.client.currentChannel,
      banLength = '1 minute'

  var info = { kicked: kickedUser, by: client.me, banLength: banLength }

  theChannel.asServer( info, (context) => {

    var channel = context.channel,
        info = context.info

    await channel.forceUserToLeave( info.kicked )
    await channel.removeAsMember( info.kicked )

    var blacklist = await channel.data.get( 'blacklist', [] )

    blacklist.append({
      user: info.kicked,
      until: Time.fromNow( info.banLength )
    })

    await channel.data.set( 'blacklist', blacklist )
    await channel.post({
      type: 'system',
      text: `${info.by} kicked ${info.toKick} from this channel for ${info.banLength}`
    })

    await channel.on( 'userWillEnter', checkIfKicked )

  })
  .then( () => promise.resolve() )
  .catch( reason => promise.reject(reason) )

})
  



// TODO:
// Mute


// NOTES:

// Localization is an open question
//
// There's a problem with the explanation text on multiple selects conflicting with where you type
// Maybe changes the "send" button to "invite" 
//
//
// Proposal:
// If an @name is entered by typing, deleting works like normal: character to character.
// If an @name is entered via chat complete, the name is deleted as a block
