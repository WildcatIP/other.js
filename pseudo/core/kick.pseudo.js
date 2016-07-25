const {Feature} = require('other')

// KICK
//
// Kicks a user for the channel and bans them for 1 minute. Ties everything
// together, uses server-side events and data storage.
//
// The accepts field means you can programatically kick a user by:
// otherchat.client.command('kick', {user: aUser}), which will be used
// by the ban command at the end of this file.

const feature = new Feature({
  name: 'kickfeature',
  version: '0.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})

var otherchat = new Otherchat( feature )

var kickCommand = feature.command({
  tokens: ['kick'],
  version: '0.1',
  name: 'Kick Command',
  description: 'Temporarily kicks a user from the channel.',
  action: 'kick',
  // accepts means shows users as didQuery chat complete
  accepts: {user: otherchat.types.user, query: String}
})


//
// Kicks somebody from a channel and bans them for a minute.

kickCommand.on('didAction', (selected, didAction) => {

  var kickedUser = selected.user, // guaranteed from the accepts field
      theChannel = otherchat.client.currentChannel,
      banLength = '1 minute' || selected.banLength // so that it can be passed in

  // TODO: Would be nice to include: "kick @blah 10 minutes"
  // Q: In general, how do do that support that kind of parsing?

  // To kick someone, the server needs to know who is kicked, who did the
  // kicking, and for how long they should be banned
  // @bs It might be useful to include an optional param with the reason they
  //     were kicked. This could be useful for whispering to them the reason
  //     they were timed out or any other messages the channel host might
  //     want to send.
  //
  //     Q: How does someone attach an listener to something like kick
  //        to add custom behavior?

  var info = { kicked: kickedUser, by: client.me, banLength: banLength, action: selected.action }

  theChannel.runAsServer( info, (serverContext, didRun) => {

    var channel = serverContext.channel,
        info = serverContext.info

    // Kick them from the channel and remove their membership

    channel
      .forceUserToLeave( info.kicked )
      .removeAsMember( info.kicked )

      // Attach a server-side handler to the channel

      .on( 'userWillEnter', checkIfKicked )

      // Append to the blacklist stored on the channel. Each rule in the blacklist
      // contains the user to block and until when to block them.
      //
      // All features that share an apiKey can access shared data. For example,
      // our block command might append an object to the blacklist with until
      // set to Infinity and an extra field for also blocking on account.

      .withData( 'blacklist', [], (data, done) => {

        blacklist.append({
          user: info.kicked,
          until: Time.fromNow( info.banLength )
        })

        channel
          .updateData({ blacklist: blacklist })
          .finishWith( done )

      })

      // Post a system message saying the user was kicked. Normally extensions
      // would only be able to post extension not system messages, but we are
      // running with system privileges.

      .post({
        type: 'system',
        text: `${info.by} ${info.action} ${info.toKick} from this channel for ${info.banLength}`
      })
      .finishWith( didRun )

  })
  .finishWith( didAction )

  // .finishWith is shorthand for:
  //    .then( () => didAction.resolve() )
  //    .catch( reason => didAction.reject(reason) )

})

//
// Create the server-side event handler that checks if the user is on the
// black list whenever a user tries to enter the channel, and keeps them out
// if they are (and explains via a system message)
//
//    unique - this handler will only be installed once per event, no matter
//             how many times .on is called

// Playing around here with try/await instead of pure Promises

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

    catch{
      reason => willEnter.reject(reason)
    }

  }
})



//
// BAN
//
// Bans a user for the channel forever.
//
// Shows how to programatically call another command


var banCommand = feature.command({
  tokens: ['ban'],
  version: '0.1',
  name: 'Ban User',
  description: 'Permanently bans a user from the channel, until they are unbanned.',
  action: 'ban',
  // accepts means shows users as didQuery chat complete
  accepts: {user: otherchat.types.user, query: String}
})

banCommand.on('didAction', (selected, didAction) => {

  feature
    .command( 'kick', {user: selected.user, banLength: 'Infinity minutes'} )
    .finishWith( didAction )

})
