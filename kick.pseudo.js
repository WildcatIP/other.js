//
// KICK
//
// Kicks a user for the channel and bans them for 1 minute. Ties everything
// together, uses server-side events and data storage.
//
// The accepts field means you can programatically kick a user by:
// otherchat.client.command('kick', {user: aUser})

var kickCommand = feature.command({
  tokens: ['kick'],
  version: 'kick.0.1',
  name: 'Kick command',
  description: 'Temporarily kicks a user from the channel.'
  accepts: {user: otherchat.types.user, query: String}
})


//
// Show a list of users with a 'kick' action

kickCommand.on('didQuery', (context, didQuery) => {
  
  var channelMembers = otherchat.client.currentChannel.members
  
  channelMembers.find({ query: context.query }).then( users => {
    var results = users.map( user => ({user: user, action: 'kick'}) )
    didQuery.resolve( results )
  })
  .catch( reason => didQuery.reject(reason) )
  
})

//
// This is where it gets exciting! This kicks somebody from a channel and bans
// them for a minute.

kickCommand.on('didAction', (selected, didAction) => {
  
  var kickedUser = selected.user, // guaranteed from the accepts field
      theChannel = otherchat.client.currentChannel,
      banLength = '1 minute'

  // To kick someone, the server needs to know who is kicked, who did the
  // kicking, and for how long they should be banned

  var info = { kicked: kickedUser, by: client.me, banLength: banLength }

  theChannel.runAsServer( info, serverContext => {

    var channel = serverContext.channel,
        info = serverContext.info

    // Kick them from the channel and remove their membership

    await channel.forceUserToLeave( info.kicked )
    await channel.removeAsMember( info.kicked )

    // Append to the blacklist stored on the channel. Each rule in the blacklist
    // contains the user to block and until when to block them.
    // 
    // All features that share an apiKey can access shared data. For example,
    // our block command might append an object to the blacklist with until
    // set to Infinity and an extra field for also blocking on account. 

    var blacklist = await channel.data.get( 'blacklist', [] )

    blacklist.append({
      user: info.kicked,
      until: Time.fromNow( info.banLength )
    })

    await channel.data.set( 'blacklist', blacklist )

    // Post a system message saying the user was kicked. Normally extensions
    // would only be able to post extension not system messages, but we are
    // running with system privileges.

    await channel.post({
      type: 'system',
      text: `${info.by} kicked ${info.toKick} from this channel for ${info.banLength}`
    })

    // Attach a server-side handler to the channel

    await channel.on( 'userWillEnter', checkIfKicked )

  })
  // Tell the client everything was succesfull!
  .then( () => didAction.resolve() )
  // Roll-back any changes and let the client know something went uncheesy
  .catch( reason => didAction.reject(reason) )

})

//
// Create the server-side event handler that checks if the user is on the
// black list whenever a user tries to enter the channel, and keeps them out
// if they are (and explains via a system message)
//
//    unique - this handler will only be installed once per event, no matter
//             how many times .on is called

var checkIfKicked = otherchat.type.serverEventHandler({
  unique: true,
  handler: (context, willEnter) => {

    // This is run atomically on the server

    try{
      
      channel = context.channel

      // Get the blaclkist and find the first rule (or null if none) for the
      // user that just entered.

      var blacklist = await channel.data.get( 'blacklist', [] )
      var rule = blacklist.filter( rule => rule.user == context.user ).first()

      // If the user is still kicked, keep them from entering and post a
      // system message only they can see saying why they cannot enter.

      if( rule && Date.now() <= rule.until ){
        
        await channel.post({
          type: 'system',
          text: `You have been kicked from ${channel} for another ${Time.howLongUntil(rule.until)} minutes`,
          whoCanSee: [context.user]
        })

        // Prevent default action, i.e., don't let them enter the channel
        return willEnter.resolve( false ) 

      }

      // If the kick has run out, remove the blacklist rule
      else if( rule ){
        blacklist.remove( rule )
        await channel.data.set( 'blacklist', blacklist )
      }

      // If there are no blacklist rules, uninstall the event handler
      if( blacklist.length == 0 ) await channel.off('userWillEnter', kickedHandler)

      // Finally, allow default action to let the user into the channel
      willEnter.resolve( true )

    }
    
    catch( reason => willEnter.reject(reason) )

  }
})


// TODO: Would be nice to include: "kick @blah 10 minutes"
// Q: In general, how do do that support that kind of parsing?