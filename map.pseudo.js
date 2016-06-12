var otherchat = Otherchat(),
    Places = require('other-places') // our extended-local place search


//
// MAP COMMAND
// map me, map sushi, map active club
//

var mapCmd = OtherchatFeature({
  tokens: ['map'],
  version: 'map.0.1',
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})

mapCmd.on('query', (context, promise) => {
  var query = context.query

  // "map me" displays the map of where you are
  // "map sushi" displays a list of sushi places
    
  if( ['me', 'here'].contains(query) ){
    // Centering on a user object continually updates the map with the
    // user's location
    var map = otherchat.types.mapChatComplete({ center: client.me, zoom: 17 })
    promise.resolve( map )
  }

  otherchat.client.location().then( loc => {
    findAndDisplayMapResults({ center: loc.latLng, query: query }, promise )
  })
})

function findAndDisplayMapResults( options, promise ){

  Places
    .search({ query: options.query, centeredAt: options.center })
    .then( results => {

      results = results.map( place => {
        return otherchat.types.mapChatComplete({
          title: place.name,
          rating: place.rating,
          location: place.latLng
        })
      })

      // When a single map chat complete object is passed to done the map chat
      // complete shows just that item. When a list is passed, it shows all
      // items on the map

      promise.resolve( results )

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

var etaCmd = OtherchatFeature({
  tokens: ['eta'],
  version: 'eta.0.1',
  accepts: { user: otherchat.types.user, place: Place }
})

etaCmd.on('query', (context, promise) => {

  if( !context.user && !context.place ){
    return promise.reject( 'Keep typing to map your eta to a person or place...' )
  }

  promise.resolve( oc.types.mapChatComplete({
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