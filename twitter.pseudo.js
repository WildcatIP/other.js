//
// TWITTER APP
//

var feature = new OtherchatFeature({
      apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
      version: 'twitter.0.1'
    }),

    otherchat = new Otherchat( feature ),
    Twitter = require('http://...')


//
// SETUP
//

feature.on('install', function(){
  
  /* TODO: oAuth setup here */

  var twitterIdentity = otherchat.client.identities.create( otherchat.types.identity({
      id: 'me',
      name: Twitter.me.name,
      avatar: Twitter.me.profile_image_url
    })
  )

  feature.channel.style({
    navBackgroundColor: '#4099FF', // Twitter blue
    navIcon: 'bird.png',
    whoCanPost: [ twitterIdentity ]
  })

})


//
// APP CHANNEL STRUCTURE
//

var app = feature.channel({home: '#/twitter', twitterName: /@(.+)/, hashtag: /#(.+)/})

app.on( 'didNavigate', function(channel, context, done){

  channel.data.get( 'lastFetchTimestamp' ).then( function( lastFetchTimestamp ){

    var twitterApiCall

    if( context.home )
      twitterApiCall = Twitter.fetchTimeline({ since: lastFetchTimestamp })
    else if( context.twitterName )
      twitterApiCall = Twitter.fetchTweets({ user: context.twitterName, since: lastFetchTimestamp })
    else if( context.hashtag )
      twitterApiCall = Twitter.search({ query: context.hashtag, since: lastFetchTimestamp })
    
    twitterApiCall.then( function( tweets ){
      
      tweets.each( function( tweet ) {

        addTweetToChannel( tweet, channel )
        since = tweet.since

      })
      
      channel.data.set( 'lastFetchTime', since )
      done( true )

    }).error( function(){ done( false  )})

  })

})

function addTweetToChannel(channel, tweet){

  var msg = otherchat.types.userMessage({
    text: tweet.text,
    time: tweet.time,
    avatar: tweet.user.avatar_profile_url,
    linkHandler: function( link, done ){
      otherchat.client.navigateTo( app.path.home + '/' + link.text )
      done( false ) // prevent default navigation
    }
  })

  channel.post( msg )

}

//
// TODO: Add posting in home to tweet
//