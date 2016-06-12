//
// WEB
// Either does a web search or opens a URL
//

// When you click the 'go' action, the browser opened should allow you
// to selecting text and then post the equiv of a screenshot+link. This
// lets you talk about things on the web, link them with context, all
// without leaving Other Chat. Think a much better version of the web
// snippets thing on Twitter.

var feature = new OtherchatFeature({
      apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
      version: 'web-bundle.0.1'
    })
    otherchat = new Otherchat( feature ),
    Web = require('other-web') // Extended-local web search?

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