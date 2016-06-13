//
// TWITTER APP
//
// Using https://tc39.github.io/ecmascript-asyncawait/ and ECMAScript 6:
//
// See:
// - https://github.com/google/traceur-compiler
// - https://github.com/facebook/regenerator
//

let feature = new OtherchatFeatureSet({
      apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
      version: 'twitter.0.1'
    }),

    otherchat = new Otherchat( feature ),
    Twitter = require('http://...')


//
// TWITTER IDENTITY
//

// If an identity already exists (created by an Otherscript that
// shares an API key) with the given id then that identity returned
// with the other fields updated.

let twitterIdentity = otherchat.types.identity({
  id: 'me',
  name: Twitter.me.name,
  avatar: Twitter.me.profile_image_url  
})


//
// APP CHANNEL STRUCTURE
//

// Same thing for channels

let app = otherchat.types.channel({

  id: 'app',
  path: ':/twitter', // :/ means relative hashurl, # means absolute
  displayName: 'Twitter',
  class: 'baseChannel',
  
  whoCanPost: [ twitterIdentity ],

  subchannels: {
    twitterUserChannel: /@(.+)/,
    twitterHashtagChannel: /@(.+)/
  }

  style: {
    navBackgroundColor: '#4099FF', // Twitter blue
    navIcon: 'bird.png',
  }

})


//
// INSTALLATION
//

feature.on('install', () =>
  
  /* TODO: oAuth setup here */

  client.addIdentity( twitterIdentity )
  client.me.addChannel( app )
 
})


//
// APP BEHAVIOR
//

app.on( 'willView', async (channel, promise) => {
  
  try {

    let lastFetchTimestamp = await channel.data.get( 'lastFetchTimestamp' )
    let twitterApiCall

    // channel.class (think CSS) is the class name of the channel.
    // channel.path is the value returned by the hashurl regexp.

    if( channel.class == 'baseChannel' )
      twitterApiCall = Twitter.fetchTimeline({ since: lastFetchTimestamp })
    else if( channel.class == 'twitterUserChannel' )
      twitterApiCall = Twitter.fetchTweets({ user: channel.path, since: lastFetchTimestamp })
    else if( channel.class == 'twitterHashtagChannel' )
      twitterApiCall = Twitter.search({ query: channel.path, since: lastFetchTimestamp })

    twitterApiCall.then( (tweets) => {
      
      tweets.each( (tweet) => {
        addTweetToChannel( tweet, channel )
        since = tweet.since
      })
      
      channel.data.set( 'lastFetchTime', since )
      promise.resolve( true )

    })

  }

  catch( error ) promise.reject( error )

})

function addTweetToChannel(channel, tweet){

  let msg = otherchat.types.userMessage({
    text: tweet.text,
    time: tweet.time,
    avatar: tweet.user.avatar_profile_url
  })

  msg.on( 'linkWasTapped', (link){
    otherchat.client.navigateTo( app.path + '/' + link.text )
    link.preventDefault() // prevent default navigation
  })

  channel.post( msg )

}


//
// POSTING IN BASE CHANNEL TWEETS
//

app.on( 'willPostMessage', (message, promise) => {
  Twitter
    .tweet( message )
    .then( () => {
      message.author = twitterIdentity
      message.channel.post(message)
      promise.resolve()
    })
    .error( () => { promise.reject() } )
})

// Turn off posting for the rest of the app's channels

app.subchannels( '.twitterUserChannel, .twitterHashtagChannel' ).set({
  whoCanPost: null
})
