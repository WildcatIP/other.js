//
// RECHAT
//
// This is a stop-gap rechat that we could implement nearly now.
//
// Use the rechat command to rechat the last message in a channel. It get's
// posted by the original author, with a system message beneath it that says:
// 
// > 'rechat from #foo by @blah'
//

var feature = new FeaturePack({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e', // root ;)
  id: 'rechat-simple',
  version: '0.1',
  name: 'Rechat Simple (Stopgap)'
})

var otherchat = new Otherchat( feature )

var rechatCommand = feature.command({
  id: feature.id,
  tokens: ['rechat'],
  version: '0.1',
  action: 'select', // same action for all rows
  accepts: {channels:[otherchat.type.channel], query: String},
  allowsMultipleSelection: true
})

// If we don't add a custom didQuery event handler, then the behavior is
// inferred from the accepts field. In this case the command accepts an array
// of channels, so the completes from the #channel command are displayed.


rechatCommand.on('didFinish', (context, doFinish) => {
  
  var currentChannel = otherchat.client.currentChannel
  
  // get the last message from the current channel

  currentChannel.messages.last().then( messageToRechat => {
    
    // post it to all of the selected channels
    
    context.channels.each( toChannel => {

      // repost the message, and the system message

      toChannel
        .post( messageToRechat )
        .post({
          type: 'system',
          text: `rechat from ${currentChannel} by ${client.me}`
        })
        .then( () => { doFinish.resolve() })
        .catch( reason => { doFinish.reject(reason) }

    })

  }).catch( reason => { doFinish.reject(reason) })

})

  

  