const {Feature} = require('other')

// WEB
// Either does a web search or opens a URL

// When you click the 'go' action, the browser opened should allow you
// to selecting text and then post the equiv of a screenshot+link. This
// lets you talk about things on the web, link them with context, all
// without leaving Other Chat. Think a much better version of the web
// snippets thing on Twitter.

const feature = new Feature({
  name: 'web-bundle',
  version: '0.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})
const otherchat = new Otherchat(feature)
const Web = require('other-web'); // Extended-local web search?

var cmd = feature.command({
  tokens: ['web'],
  version: 'web.0.1',
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})

cmd.on('query', (context, promise) => {

  try {

    var results = await Web.search( context.query )
    results = results.map( page => {
      return oc.types.chatComplete({
        title: page.title,
        detail: page.href,
        actionName: 'go',
        action: function( selected ){
          client.browser.open(selected.detail)
        }
      })
    })

    promise.resolve( results )

  }

  catch (error) promise.reject( error )

})

//
// EMBEDDING WEB/MEDIA
//
// When you type a url like www.manatee.com you get a chat complete letting you
// post an embed.
//

var webEmbed = feature.command({
  tokens: ['www', 'http://'],
  version: 'web-embed.0.1',
  accepts: {query: String},
})

var Web = request('other-web') // Our Web library

webEmbed.on('didQuery', (context, promise) => {

  if( Web.isUrl(context.query) ){
    promise.resolve({ url: context.query })
  }

  promise.resolve()

})
