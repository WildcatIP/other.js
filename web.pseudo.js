var otherchat = new Otherchat(),
    client = otherchat.client,
    Web = require('other-web')

var cmd = client.register({
  tokens: ['web'],
  version: 'web.0.1'
})

cmd.on('query', function(context, done){
  
  Web.search( context.query ).then(function( results ){

    results = results.map( function(page){
      return oc.types.twoLineChatComplete({
        title: page.title,
        detail: page.href,
        actionName: 'go',
        action: function( selected ){
          client.browser.open(selected.detail)
        }
      })
    })

    done( results )

  })
})