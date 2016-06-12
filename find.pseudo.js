var oc = new Otherchat(),
    Places = require('other-places') // our extended-local place search

var findCommand = OtherchatFeature({
    tokens: ['find'],
    version: 'find.0.1',
    apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e'
})

findCommand.on('query', (context, promise) => {

  client.location().then( loc => {
    findAndDisplayPlaceResults({ center: loc.latLng, query: context.query }, promise )
  })

})

function findAndDisplayPlaceResults( options, promise ){

  Places
    .search({ query: options.query, centeredAt: options.center })
    .then( results => {

      results = results.map( place => {
        return oc.types.twoLineChatComplete({
          title: place.name,
          detail: [ place.distance, place.vicinity ].join(' '),
          rating: place.rating,
          info: {href: place.href },
          actionName: 'more',
          action: selected => {
            // Open a fullscreen web page with appropriate chrome for chat complete action
            client.browser.open( selected.info.href )
          }
        })
      })

      promise.resolve( results )
      
    }
  )

}