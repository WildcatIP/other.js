var oc = new Otherchat(),
    client = oc.client,
    Places = require('other-places')


//
// MAP COMMAND
// map me, map sushi, map active club
//


var mapCmd = client.register({
    tokens: ['map'],
    version: 'map.0.1',
    scope: [client.me, otherchat.scope.location]
})

mapCmd.on('query', function(context, done){
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


//
// ETA COMMAND
// eta @alien, eta active club
// 
// Playing with calling out the type of objects a command can accept. In this
// case either a user or place. If there's a match to a type, it gets passed
// as a member of the context object.
//

var mapCmd = client.register({
    tokens: ['eta'],
    version: 'eta.0.1',
    scope: [client.me, otherchat.scope.location],
    accepts: { user: otherchat.types.user, place: Place }
})

mapCmd.on('query', function(context, done){
  var query = context.query

  if( !context.user && !context.place ){
    done( otherchat.types.singeLineChatComplete('Keep typing to map your eta to a person or place...') )
    return
  }

  done( oc.types.mapChatComplete{
    from: client.me,
    to: context.user || context.place,
    showTravelTime: true
  })

  // There's some behind-the-scenes magic going on here with permissioning:
  //
  // To display eta to another user, Other Chat needs permission to access
  // the other user's location. Thus, when this command is the other user
  // gets a message prompting to share location until the person arrives
  // (with some reasonable timeout). Until they accept, the map will be in
  // a awaiting-permission state (but still sharable), probably just showing
  // your current location.
  //
  // Another implementation of the command might not show a map, but do a single
  // line chat complete with just the estimated time/distance.

})