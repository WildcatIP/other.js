//
// CHANNEL MENTION
//
// An experimental behavior: When a message mentions a channel, post a system
// message in mentioned channel with a link back. In other words, post system
// messages with a link to the message than mentioned it.
//
// Shows how quickly we can experiment with new behavior with Otherscript.
//
// Builds from the patterns in points.pseudo.js
//

var feature = new FeatureSet({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e', // root ;)
  id: 'channel-mention',
  version: 'channel-mention.0.1',
  name: 'Channel Mention Backlink'
})

var otherchat = new Otherchat( feature )

//
// Have two versions of the implementation: one where the client does the
// posting, and one where the server does the posting. I think I dig the
// client version more, but it doesn't guarantee atomicness.
//
// Also the following pattern is popping up everywhere:
//
//   .then( () => promise.resolve() )
//   .catch( reason => promise.reject( reasons )
//
// I'm chunking that into .endWith( promise )



// CLIENT VERSION

otherchat.client.on('messageDidPost', (context, didPostMentions) => {

  let message = context.message,
      channelPosts = []

  message.mentionedChannels.each( channel => {

    let link = otherchat.types.link({ text: 'mentioned', to: message })

    channel
      .post({
        type: 'system',
        text: `${context.message.author} ${link} this channel in ${channel}`
      })
      .appendTo( channelPosts )

  })

  Promise
    .all( channelPosts )
    .endsWith( promise )

})



// ALTERNATE SERVER VERSION

otherchat.client.on('messageDidPost', (context, didPostMentions) => {

  let info = { message: context.message }

  feature.runAsServer( info, (serverContext, serverSuccess) => {

    let message = serverContext.info.message

    message.mentionedChannels.each( channel => {

      let link = otherchat.types.link({ text: 'mentioned', to: message })

      channel.post({
        type: 'system',
        text: `${message.author} ${link} this channel in ${channel}`
      })
      .endsWith( serverSuccess )
    
    })

  })
  .endWith( didPostMentions )

})


