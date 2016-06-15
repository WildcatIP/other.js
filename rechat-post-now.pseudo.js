//
// RECHAT (POST NOW)
//
// This is a better rechat that requires Other Chat having a basic
// implementation of being able to select a message and then operating on it.
//
// Start by long-holding a message. It's turns a color to indicate that it is
// chosen. Instead of the iOS action sheet, I'm a chat complete opens, whose
// completes are actions (commands) that act on a chosen message. E.g., flag,
// delete, edit, ... rechat :) And potentially many more.
//
// Like normal, typing filters the chat complete. This makes it easy to have
// many actions on a message!
//
// After rechat is tapped, the message is reposted to the selected channels
// and a system message posted saying:
//
// > 'rechat from #foo by @blah'

var feature = new FeatureSet({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e', // root ;)
  id: 'rechat',
  version: 'rechat-post-now.0.1',
  name: 'Rechat Post Now'
})

var otherchat = new Otherchat( feature )

var rechatCommand = feature.command({
  id: 'rechat-post-now',
  tokens: ['rechat'],
  version: '0.1',
  accepts: {
    message: otherchat.type.message, // populated by long-holding a message (if we allowed multi-select, would be an array)
    channels: [otherchat.type.channels], // channels to which to rechat
    query: String
  },
  allowsMultipleSelection: true
})

rechatCommand.on('didFinish', (context, doFinish) => {
  
  var currentChannel = otherchat.client.currentChannel
  
  context.channels.each( toChannel => {

    // repost the message, and the system message

    toChannel
      .post( context.message )
      .post({
        type: 'system', // Could also add a 'rechat' type for custom rechatty display
        text: `rechat from ${currentChannel} by ${client.me}`
      })
      .then( () => { doFinish.resolve() })
      .catch( reason => { doFinish.reject(reason) }

  })

})