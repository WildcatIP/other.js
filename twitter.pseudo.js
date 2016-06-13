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
  apiKey: '8b889bba-87da-4546-b08b-b6564610261b',
  id: 'points'
  version: 'points.0.2',
  name: 'Points++',
  description: 'Give points to people with @user++, take them away with @user--.'
})


let otherchat = new Otherchat( feature ),
    Twitter = require('http://...')

//
// TWITTER IDENTITY
//

let twitterIdentity = feature.identity({
  id: 'me',
  name: Twitter.me.name,
  avatar: Twitter.me.profile_image_url  
})


//
// APP CHANNEL STRUCTURE
//

let baseChannel = feature.channel({

  id: 'app',
  path: '#:/twitter', // :/ means relative hashurl, # means absolute, #:/twitter means @user/twitter
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

feature.on('install', () => {
  
  // TODO: oAuth setup here
 
})


//
// BEHAVIOR
//

feature.runOnServer( () => {

  feature.channels('*').on( 'shouldUpdate', (context, promise) => {

    try {
      var channel = context.channel

      let lastFetchTimestamp = await channel.data.get( 'lastFetchTimestamp', 0 )
      let twitterApiCall

      // channel.class (think CSS) is the class name of the channel.
      // channel.path is the value returned by the hashurl regexp.

      if( channel.class == 'baseChannel' )
        twitterApiCall = Twitter.fetchTimeline({ since: lastFetchTimestamp })
      else if( channel.class == 'twitterUserChannel' )
        twitterApiCall = Twitter.fetchTweets({ user: channel.path, since: lastFetchTimestamp })
      else if( channel.class == 'twitterHashtagChannel' )
        twitterApiCall = Twitter.search({ query: channel.path, since: lastFetchTimestamp })

      twitterApiCall.then( tweets => {
        
        let messages = tweets.map( tweet => {
          since = tweet.since
          return {
            name: tweet.user.name
            text: tweet.text,
            time: tweet.time,
            avatar: tweet.user.avatar_profile_url,
          }
        })

        await channel.data.set( 'lastFetchTime', since )
        promise.resolve( messages ) // Adds the new tweets to the channel

      })

    }

    catch( error ) promise.reject( error )

  })

})


//
// TURN OFF POSTING FOR SUB CHANNELS, AND SET LINK DESTINATION
//

feature.channels( '.twitterUserChannel, .twitterHashtagChannel' ).set({
  whoCanPost: null
})

feature.channels('*').on( 'didTapLink', (context, promise) => {
  otherchat.client.navigateTo( baseChannel.path + '/' + context.link.text )
  promise.resolve( false ) // prevent default behavior
})


//
// POSTING IN BASE CHANNEL TWEETS
//

baseChannel.on( 'willPostMessage', (context, promise) => {
  var msg = context.message

  Twitter
    .tweet( msg )
    .then( () => {
      msg.author = twitterIdentity
      msg.channel.post( msg )
      promise.resolve( false ) // cancel default action
    })
    .error( () => promise.reject() )
})


