const {feature} = require('other')

//
// EMBEDDING WEB/MEDIA
//
// When you type a url like www.manatee.com you get a chat complete letting you
// post an embed.
//

const webEmbed = feature.command({
  tokens: ['www', 'http://'],
  version: 'web-embed.0.1',
  accepts: {query: String},
})

const Web = request('other-web') // Our Web library

webEmbed.on('didQuery', (context, promise) => {
  if (Web.isUrl(context.query)) {
    promise.resolve({url: context.query})
  }
  promise.resolve()
})
