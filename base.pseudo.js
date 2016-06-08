
// 
// AT MESSAGE COMPLETE
//

var otherchat = new Otherchat(),
    client = otherchat.client,
    server = otherchat.server

var mention = client.registerCommand({
  tokens: ['@'],
  version: 'user.0.1'
})

mention.on('query', function(context, done){

  client.users.find({ query: context.query, scope:client.me }).then(function( users ){

    users = users.sortBy(function(u){
      // .relevance is server calculated
      return [ user.isMemberOf( client.currentChannel ), user.relevance ]
    })

    users = users.map(function(user){
      return otherchat.types.userChatComplete({
        user: user,
        actionName: 'whipser',
        action: function( selected ){
          client.navigateTo( selected.user.whisperChannel )
        }
      })
    })

    done( users )

  })
})



// 
// CHANNEL COMPLETE
//

var hash = client.registerCommand({
  tokens: ['#'],
  version: 'channel.0.1'
})

hash.on('query', function(context, done){

  client.channels.find({ query: context.query, scope:client.me }).then( function(channels){

    channels = channels.map(function(channel){

      return otherchat.types.channelChatComplete({
        channel: channel,
        actionName: 'go',
        action: function( selected ){
          client.navigateTo( selected.channel )
        }
      })

    }).sortBy(['relevance', 'created_at')

    done( users )

  })
})



// 
// INVITE COMMAND
//

var invite = client.register({
  tokens: ['invite'],
  version: 'invite.0.1',
})

invite.on('query', function(context, done){
  
  client.users.find({ query: context.query }).then( function(users){

    users = users.map(function(user){

      return otherchat.types.userChatComplete({
        user: user,
        actionName: 'invite',
        action: function( selected ){

          selected.toggleActionActiveState( function(didBecomeActive){

            if( didBecomeActive ) context.users.append( selected.user )
            else context.users.remove( selected.user )

          })
          
        }
      })

    })

    return done( users )

  })

})

invite.on('done', function(context, done){

  context.users.each(function( user ){
  
    user.join( client.currentChannel )

    client.currentChannel.send(
      otherchat.types.systemMessage({
        body: [ client.me,  'invited', user ],
        from: client.me
      })
    )

  })

})



//
// Kick
//


var kick = client.register({
  tokens: ['kick'],
  version: 'kick.0.1',
  accepts: otherchat.types.user, // for an array of users: [otherchat.types.user]
})

kick.on('done', function(context, done){

  var kickedUser = context.user

  kickedUser.unjoin( client.currentChannel )

  server.channel( client.currentChannel ).blacklist.append( kickedUser, {
    duration: otherchat.types.timeDuration('2 minutes')
  })

})

// TODO: Add increasing length of kick in kick.0.2

// TODO:
// Ignore, Mute


// NOTES:

// There's a problem with the explanation text on multiple selects conflicting with where you type
// Maybe changes the "send" button to "invite" 
//
//
// Proposal:
// If an @name is entered by typing, deleting works like normal: character to character.
// If an @name is entered via chat complete, the name is deleted as a block
