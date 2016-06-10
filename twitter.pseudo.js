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

  var twitterIdentity = feature.addIdentity( otherchat.types.identity({
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

var app = feature.channel({ routes:{
  home: '#/twitter',
  twitterName: /@(.+)/,
  hashtag: /#(.+)/}
})

app.on( 'didNavigate', function(channel, context, done){

  channel.data.get( 'lastFetchTimestamp' ).then( function( lastFetchTimestamp ){

    var twitterApiCall,
        route = context.route

    if( route.name == 'home' )
      twitterApiCall = Twitter.fetchTimeline({ since: lastFetchTimestamp })
    else if( route.name == 'twitterName' )
      twitterApiCall = Twitter.fetchTweets({ user: route.value, since: lastFetchTimestamp })
    else if( route.name == 'hashtag' )
      twitterApiCall = Twitter.search({ query: route.value, since: lastFetchTimestamp })
    
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
    linkHandler: function( link ){
      otherchat.client.navigateTo( app.path.home + '/' + link.text )
      link.preventDefault() // prevent default navigation
    }
  })

  channel.post( msg )

}

//
// POSTING IN BASE CHANNEL TWEETS
//

app.routes.home.on( 'willPostMessage', function( message, done ){
  Twitter
    .tweet( message )
    .then( function(){
      message.author = feature.identity['me']
      message.channel.post(message)
      done(true)
    })
    .error( function(){ done(false) })
})