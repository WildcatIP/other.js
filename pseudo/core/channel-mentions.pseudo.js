const {FeaturePack} = require('other');

// CHANNEL MENTION
//
// An experimental behavior: When a message mentions a channel, post a system
// message in mentioned channel with a link back. In other words, post system
// messages with a link to the message than mentioned it.
//
// Shows how quickly we can experiment with new behavior with other.js.
//
// Builds from the patterns in points.pseudo.js

const feature = new FeaturePack({
  name: 'Channel Mention Backlink',
  version: 'channel-mention.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e' // root ;)
});

const command = feature.command();

// Have two versions of the implementation: one where the client does the
// posting, and one where the server does the posting. I think I dig the
// client version more, but it doesn't guarantee atomicness.
//
// Also the following pattern is popping up everywhere:
//
//   .then( () => promise.resolve() )
//   .catch( reason => promise.reject( reasons )
//
// I'm chunking that into .endsWith( promise )

// CLIENT VERSION

command.on('messageDidPost', (context, didPostMentions) => {
  const message = context.message;
  const channelPosts = [];

  message.mentionedChannels.each(channel => {
    const link = command.types.link({text: 'mentioned', to: message});

    channel
      .post({
        type: 'system',
        text: `${context.message.author} ${link} this channel in ${channel}`
      })
      .appendTo(channelPosts);
  });

  Promise
    .all(channelPosts)
    .endsWith(promise);
});

// ALTERNATE SERVER VERSION

command.on('messageDidPost', (context, didPostMentions) => {
  const info = {message: context.message};

  feature.runAsServer(info, (serverContext, serverSuccess) => {
    const message = serverContext.info.message;

    message.mentionedChannels.each(channel => {
      const link = command.types.link({text: 'mentioned', to: message});

      channel.post({
        type: 'system',
        text: `${message.author} ${link} this channel in ${channel}`
      })
      .endsWith(serverSuccess);
    });
  })
  .endWith(didPostMentions);
});
