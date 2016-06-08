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
    // Centering on a user continually updates the map with the user's location
    var map = oc.types.mapChatComplete({ center: client.me, zoom: 17 })
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

      results = results.map( function(place){
        return oc.types.mapChatComplete({
          title: place.name,
          rating: place.rating,
          location: place.latLng
        })
      })

      // When a single map chat complete object is passed to done the map chat
      // complete shows just that item. When a list is passed, it shows all
      // items on the map

      done( results )

    }
  )

}

// TODO: Maybe make the ETA command?