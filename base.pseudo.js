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

// All features that share an API key can share data. Perhaps permissions can
// be set for an api key via a web interface.

var feature = new OtherchatFeature({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e', // system key
  version: 'base.0.1'
})

// scope access to otherchat via the feature's permissions
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

  // using async/await syntax

  try{
    var users = await otherchat.client.users.find(context.query)

    // Show the members of the current channel first, sorted by .relevance
    // which is server calculated
    users = users.sortBy( user => [user.isMemberOf( client.currentChannel ), user.relevance] )
    users.map( user =>
      otherchat.types.chatCompleteResult({
        user: user,
        action: 'whipser'
      })
    )

  }
  catch( error ) promise.reject( error )
  
})

mentionCommand.on('didAction', selected => {
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

  // using promise syntax

  otherchat.client.channels.find(context.query).then( channels => {

    channels = channels.map( channel =>
      otherchat.types.chatCompleteResult({
        channel: channel,
        action: 'go'
      })
    }).sortBy(['relevance', 'created_at')

    promise.resolve( channels )

  }).catch( reason => promise.reject( reason ) )
})

hashCommand.on('didAction', selected => {
  client.navigateTo( selected.channel )
})



// 
// INVITE COMMAND
//
// As per the new spec, you can select multiple people and invite them all
// at once


var invite = feature.command({
  tokens: ['invite'],
  version: 'invite-manual.0.2',
  // Accepts both an array of users as well as an arbitrary query string for
  // searching the users.
  //
  // The accepts field allows programatic calling of commands:
  // > otherchat.client.command('invite', {users: [...]})
  accepts: {users: [otherchat.types.user], query: String},
  allowsMultipleSelection: true
})


invite.on('didQuery', (context, promise) => {
  
  otherchat.client.users.find(context.query).then( users => {

    var results = users.map( user =>
      otherchat.types.chatCompleteResult({
        user: user,
        action: 'invite',
      })
    )

    // TODO: How are we showing hint/explanation text for these multi-selection
    // comamnds? Needs design from Mike on user interface.

    return promise.resolve( results )

  }).catch( reason => promise.reject( reason ) )

})

invite.on('didAction', selected => {
  
  if(  selected.isActive ) this.context.users.append( selected.user )
  else this.context.users.remove( selected.user )

})


// The didFinish event is available for multiple-selection chat completes

invite.on('didFinish', (context, promise) => {
  
  var thisChannel = otherchat.server.channel( otherchat.client.currentChannel )

  // Everything done to thisChannel is passed as a message to the server,
  // which then does it. If something goes wrong, then an error is thrown.
  // Would be good if everything in the try block is done 'atomically' so
  // that if it gets half way through and then throws an error, the changes
  // roll-back.

  try{
    await thisChannel.addMembers( context.users )

    await thisChannel.post({
      type: 'system'
      body: `${client.me} invited ${users.join(', ')} to ${thisChannel}`
    })
    promise.resolve()
  }

  catch( error ) promise.reject( error )

})


//
// CALCULATE
//

var calcCommand = feature.command({
  tokens: ['='],
  version: 'calc.0.1',
  accepts: {query: String},
})

var Maths = require('...') // some 3rd party math library

calcCommand.on('didQuery', (context, promise) => {

  try{
    
    var answer = Maths.calc( context.query ),
    
    return promise.resolve({
      text: `${context.query} = ${answer}`,
      info: {value: answer, equation: context.query}
    })
    
  }
  catch( error ) promise.reject( error )

  promise.resolve( "Keep typing..." )

})

// Chat Complete types have sensible defaults for what they do when selected.
// You can override the default behavior. For calc, I'd expect you'd want to
// have the answer put into your input, but in case we wanted to render
// something else out...

calcCommand.on('didSelect', (selected, promise) => {
  otherchat.client.post({
    type: 'extension',
    text: `The answer to ${selected.info.equation} is ${selected.info.value}`
  })

  // If wanted to insert something into the input field
  // otherchat.client.messagePanel.insert( ... )

  promise.resolve( false ) // don't do default behavior
})



//
// KICK
// Kicks a user for the channel and bans them from entering for x minutes
// Would be nice to include: "kick @blah 10 minutes"
//

var kickCommand = feature.command({
  tokens: ['kick'],
  version: 'kick.0.1',
  accepts: {user: otherchat.types.user, query: String}
})

var Time = require('other-time') // Time utils

var kickedHandler = otherchat.type.serverSideEventHandler({
  // unique means that this handler will only be installed once, no matter
  // how many times you .on() with it.
  unique: true,
  handler: (context, promise) => {

    // Note: server-side handlers should only use data passed into the handler
    // and global things like modules. Variables that get defined in the client
    // scope won't be available here.

    var channel = context.channel

    try{

      var blacklist = await channel.data( 'blacklist' ) || [],
          rule = blacklist.filter( rule => rule.user == context.user )

      // If the user is still kicked, keep them from entering and post a
      // system message only they can see saying why they cannot enter.

      if( rule && Date.now() <= rule.until ){
        
        channel.post({
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
        channel.data( 'blacklist', blacklist )
      }

      // If there is no more blacklist, uninstall the event handler

      if( blacklist.length == 0 ) channel.off('userWillEnter', kickedHandler)

      // Finally, allow default action to let them into the channel

      promise.resolve( true )
    }

    catch( error ) promise.reject( error )
  }
})

kickCommand.on('didQuery', (context, promise) => {
  
  var channelMembers = otherchat.client.currentChannel.members
  
  var users = channelMembers.find({ query: context.query }).map( user =>
    otherchat.type.chatCompleteResult({
      user: user,
      actionName: 'kick'
    })
  })

  promise.resolve( users )
  
})

kickCommand.on('didAction', (selected, promise) => {
  
  // selected.user is guaranteed via the accepts field. Thus can programatically
  // call kick from another command via otherchat.client.command('kick', {user: aUser}) 

  var kickedUser = selected.user,
      theChannel = otherchat.server.channel( otherchat.client.currentChannel ),
      banLength = '1 minute'

  try{
    // Functions on theChannel are messaged to the server for execution.
    // If something goes wrong, an errors is thrown.
    theChannel.forceLeave( kickedUser )
    theChannel.removeAsMember( kickedUser )

    var blacklist = await theChannel.data( 'blacklist' ) || []
    blacklist.append({ user: kickedUser, until: Time.fromNow( banLength ) })
    theChannel.data( 'blacklist', blacklist )

    // Only install the handler that blocks kicked users from entering after
    // the first user is kicked.
    theChannel.on('userWillEnter', kickHandler)

    otherchat.client.post({
      type: 'system',
      text: `${client.me} kicked ${kickedUser} from this channel for ${banLength}`
    })

    promise.resolve()
  }

  catch( error ){
    // If the promise is rejected, that means something went wrong in the
    // try, so roll back any changes made. I.e., everything in the try
    // should be atomic.

    promise.reject( error )
  }
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
