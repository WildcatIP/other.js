var oc = new Otherchat(),
    client = oc.client,
    Places = require('other-places')

var command = client.register({
    tokens: ['map'],
    version: 'map.0.1',
    scope: [client.me, otherchat.scope.location]
})

command.on('query', function(context, done){
  var query = context.query

  // "map me" displays the map of where you are
  // "map sushi" displays a list of sushi places
    
  if( ['me', 'here'].contains(query) ){
    var map = oc.types.mapChatComplete({ centerOnUser: true, zoom: 17 })
    done( map )
  }

  client.location().then( function(loc){
    findAndDisplayMapResults({ center: loc.latLng, query: query }, done )
  })
})

function findAndDisplayMapResults( options, done ){

  Places
    .search({ query: options.query, centeredAt: options.center })
    .then( function( results ){

      // VERSION A: WITH PLACE RESULT TYPE

      results = results.map( function(place){
        return oc.types.placeChatComplete({
          title: place.name,
          rating: place.rating,
          location: place.latLng
        })
      })

      // VERSION B: WITH TWO LINE RESULT TYPE

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