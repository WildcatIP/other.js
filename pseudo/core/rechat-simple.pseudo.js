const {FeaturePack} = require('other');

// RECHAT
//
// This is a stop-gap rechat that we could implement nearly now.
//
// Use the rechat command to rechat the last message in a channel. It get's
// posted by the original author, with a system message beneath it that says:
//
// > 'rechat from #foo by @blah'
//

const feature = new FeaturePack({
  name: 'Rechat Simple (Stopgap)',
  version: '0.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e' // root ;)
});

const otherchat = new Otherchat(feature);

const rechatCommand = feature.command({
  id: feature.id,
  tokens: ['rechat'],
  version: '0.1',
  action: 'select', // same action for all rows
  accepts: {channels: [otherchat.type.channel], query: String},
  allowsMultipleSelection: true
});

// If we don't add a custom didQuery event handler, then the behavior is
// inferred from the accepts field. In this case the command accepts an array
// of channels, so the completes from the #channel command are displayed.

rechatCommand.on('didFinish', (context, doFinish) => {
  const currentChannel = otherchat.client.currentChannel;

  // get the last message from the current channel
  currentChannel.messages.last().then(messageToRechat => {
    // post it to all of the selected channels
    context.channels.each(toChannel => {
      // repost the message, and the system message
      toChannel
        .post(messageToRechat)
        .post({
          type: 'system',
          text: `rechat from ${currentChannel} by ${otherchat.client.me}`
        })
        .then(() => doFinish.resolve())
        .catch(reason => doFinish.reject(reason));
    });
  }).catch(reason => doFinish.reject(reason));
});
