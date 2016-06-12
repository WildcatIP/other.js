var otherchat = new Otherchat(),
    Web = require('other-web') // Extended-local web search?

var cmd = OtherchatFeature({
  tokens: ['web'],
  version: 'web.0.1',
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})

cmd.on('query', (context, promise) => {

  try{

    var results = await Web.search( context.query )
    results = results.map( page => {
      return oc.types.twoLineChatComplete({
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

  catch (error) {
    promise.reject( `Something went wrong: ${error}` )
  }
  
})