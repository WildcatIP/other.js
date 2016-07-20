var feature = new Feature({
    apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
    version: 'mapping-and-finding.0.1'
  }),
  otherchat = new Otherchat( feature ),
  Places = require('other-places') // our extended-local place search


//
// MAP COMMAND
// map me, map sushi, map active club
//

var mapCmd = feature.command({
  tokens: ['map'],
  version: 'map.0.2' // can be separately versioned from the feature,
  accepts: {place: Place, query: String}
})

mapCmd.on('didQuery', (context, promise) => {
  var query = context.query

  // "map me" displays the map of where you are
  // "map sushi" displays a list of sushi places

  if( ['me', 'here'].contains(query) ){
    // Centering on a user object continually updates the map with the
    // user's location
    var map = otherchat.types.mapChatComplete({ center: client.me, zoom: 17 })
    return promise.resolve( map )
  }

  otherchat.client.location().then( loc => {
    findAndDisplayMapResults({ center: loc.latLng, query: query }, promise )
  })
})

function findAndDisplayMapResults( context, promise ){

  Places
    .search({ query: context.query, centeredAt: context.center })
    .then( places => {

      var results = places.map( place => otherchat.types.mapChatComplete({
        text: place.name,
        rating: place.rating,
        location: place.latLng
      }) )

      // When a single map chat complete object is passed to done the map chat
      // complete shows just that item. When a list is passed, it shows all
      // items on the map

      promise.resolve( results )

    }).catch( reason => promise.reject(reason) )

}


//
// ETA COMMAND
// eta @alien, eta active club
//

//
// Playing with calling out the type of objects a command can accept. In this
// case either a user or place. If there's a match to a type, it gets passed
// as a member of the context object.
//

var etaCmd = feature.command({
  tokens: ['eta'],
  version: 'eta.0.1',
  accepts: { user: otherchat.types.user, place: Place, query: String }
})

etaCmd.on('didQuery', (context, promise) => {

  if( !context.user && !context.place ){
    return promise.reject( 'Get an eta to a person or place...' )
  }

  promise.resolve( oc.types.mapChatComplete({
    from: otherchat.client.me,
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


//
// FIND COMMAND
// find aburaya, find coffee near sf
//
// An open question is how we do more natural language parsing for things like:
//  - coffee near sf
//  - coffee in oakland
//  - sushi open now
//  - sushi open at 10pm near me
//
// wit.ai has some inspiration, and perhaps the Place library can handle this
// kind of parsing

var findCommand = feature.command({
  tokens: ['find'],
  version: 'find.0.1',
  accepts: { place: Place, query: String }
})

// @bs: Haha, yay! And I thought it was just me!
// Also ... yeah. Github really needs comments.
var Parser = require('other-parser') // maaaaaaggggiiiiccccc

findCommand.on('didQuery', (context, promise) => {

  // Some magic that parses out specific types

  var parsed = Parser.parse( context.query, for:{
    query: String,
    time: Time,
    near: Place.withDefault( otherchat.client.me )
  })

  Places.search({ query:parsed.query, centeredAt: parsed.near, openAt: parsed.time }).then( places => {

    var results = places.map( place => ({
      text: place.name,
      detail: `${place.distance} ${place.vicinity}`,
      rating: place.rating,
      info: { href: place.href },
      action: 'more'
    }) )

    promise.resolve( results )

  }).catch(reason) promise.reject( reason )

})

findCommand.on('didAction', (context, promise) => {
  otherchat.client.browser.open( context.info.href )
})
