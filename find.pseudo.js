var oc = new Otherchat(),
    client = oc.client,
    Places = require('other-places')

var command = client.register({
    tokens: ['find'],
    version: 'find.0.1',
    scope: [client.me, otherchat.scope.location]
})

command.on('query', function(context, done){
  var query = context.query

  client.location().then( function(loc){
    findAndDisplayPlaceResults({ center: loc.latLng, query: query }, done )
  })

})

function findAndDisplayPlaceResults( options, done ){

  Places
    .search({ query: options.query, centeredAt: options.center })
    .then( function( results ){

      results = results.map(function(place){
        return oc.types.twoLineChatComplete({
          title: place.name,
          detail: [ place.distance, place.vicinity ].join(' '),
          rating: place.rating,
          actionName: 'more',
          info: {href: place.href },
          action: function( item ){
            // Open a fullscreen web page with appropriate chrome for chat complete action
            client.browser.open( selected.info.href )
          }
        })
      })

      // FINALLY
      done( results )
      
    }
  )

}