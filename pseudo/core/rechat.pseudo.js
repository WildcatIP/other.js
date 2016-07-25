const {FeaturePack} = require('other');

// RECHAT (POST NOW)
//
// This implementation of rechat requires Other Chat having a basic
// implementation of being able to select a message and then operating on it.
//
// Here's a post-now-ish way to implement it:
//
// Start by long-holding a message. It's turns a color to indicate that it is
// chosen. Instead of the iOS action sheet, a chat complete opens, whose
// completes are actions (commands) that act on the chosen message. E.g., flag,
// delete, edit, ... rechat :) And potentially many more.
//
// Like normal, typing filters the chat complete. This makes it easy to have
// many actions on a message!
//
// After rechat is tapped, the message is reposted to the selected channels
// and a system message posted saying:
//
// > 'rechat from #foo by @blah'

const feature = new FeaturePack({
  name: 'Rechat',
  version: '0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e' // root ;)
});

const otherchat = new Otherchat(feature);

//
// To me, it's rechat that makes the power of the accepts field apparent:
// it both cuts down on boiler plate code, and acts as a kind of contract
// call signature. To call rechat programatically one would:
//
// > otherchat.command('rechat', {message: messageToRechat, channels: [a,b,c]} )
//

const rechatCommand = feature.command({
  id: 'rechat',
  tokens: ['rechat'],
  version: '0.1',
  accepts: {
    message: otherchat.type.message, // populated by long-holding a message (if we allowed multi-select, would be an array)
    channels: [otherchat.type.channels], // the to-rechat-to channels
    query: String
  },
  allowsMultipleSelection: true
});

rechatCommand.on('didFinish', (context, doFinish) => {
  const currentChannel = otherchat.client.currentChannel;

  context.channels.each(toChannel => {
    // repost the message, and then post a system message

    toChannel
      .post(context.message)
      .post({
        type: 'system', // Could also add a 'rechat' type for custom rechatty display
        text: `rechat from ${currentChannel} by ${otherchat.client.me}`
      })
      .endsWith(doFinish);

      // Short for:
      // .then( () => { doFinish.resolve() })
      // .catch( reason => { doFinish.reject(reason) }
  });
});
