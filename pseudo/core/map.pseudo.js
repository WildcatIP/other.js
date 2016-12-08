const {Feature} = require('other')

const feature = new Feature({
  name: 'mapping-and-finding',
  version: '0.0.1',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
})
const otherchat = new Otherchat( feature )
const Places = require('other-places') // our extended-local place search

//
// ETA COMMAND
// eta @alien, eta active club
//

//
// Playing with calling out the type of objects a command can accept. In this
// case either a user or place. If there's a match to a type, it gets passed
// as a member of the context object.
//

const etaCmd = feature.command({
  tokens: ['eta'],
  version: 'eta.0.1',
  accepts: {user: otherchat.types.user, place: Place, query: String},
})

etaCmd.on('didQuery', (context, promise) => {
  if ( !context.user && !context.place ) {
    return promise.reject( 'Get an eta to a person or place...' )
  }

  return promise.resolve( oc.types.mapChatComplete({
    from: otherchat.client.me,
    to: context.user || context.place,
    showTravelTime: true,
  }))

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

const findCommand = feature.command({
  tokens: ['find'],
  version: 'find.0.1',
  accepts: {place: Place, query: String},
})

// @bs: Haha, yay! And I thought it was just me!
// Also ... yeah. Github really needs comments.
const Parser = require('other-parser') // maaaaaaggggiiiiccccc

findCommand.on('didQuery', (context, promise) => {
  // Some magic that parses out specific types

  const parsed = Parser.parse(context.query, {for: {
    query: String,
    time: Time,
    near: Place.withDefault( otherchat.client.me ),
  }})

  Places.search({query: parsed.query, centeredAt: parsed.near, openAt: parsed.time}).then( (places) => {
    const results = places.map( (place) => ({
      text: place.name,
      detail: `${place.distance} ${place.vicinity}`,
      rating: place.rating,
      info: {href: place.href},
      action: 'more',
    }) )

    promise.resolve( results )
  }).catch((reason) => promise.reject( reason ) )
})

findCommand.on('didAction', (context, promise) => {
  otherchat.client.browser.open( context.info.href )
})
