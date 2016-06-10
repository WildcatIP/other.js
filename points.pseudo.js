//
// POINTS
// Give and take away points by posting @adam-- or @alien++ in a message, then
// view the points with the 'points' command
//

var feature = new OtherchatFeature({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
  version: 'points.0.1'
})

// scope access to otherchat via the feature's permissions 
var otherchat = new Otherchat( feature )

//
// CLIENT
//

var suffixToPoints = { '++': 1, '+-': 0.5, '-+': -0.5, '--': -1 }

otherchat.client.on('messageDidPost', function( message ){

  // For each user mention, see if the next two characters match any of the
  // suffixes which gives points

  // Message objects contain handy-dandy common things, like lists of users
  // or channels mentioned in the message text.

  message.userMentions.each( function(mention){
    
    var mentionSuffix = message.text.substr( mention.range.end, 2 )
    if( mentionSuffix.match(/[+-]{2}/) ){
      givePointsToUser( mention.user, mentionSuffix )
    }

  })
  
  function givePointsToUser( user, suffixText ){

    // By default, extensions can only read/write data with other extensions
    // that share an API key.

    user.data.getWithDefault( 'points', 0 ).then( function( points ){

      var newPoints = suffixToPoints[suffixText]
      user.data.set( 'points', points + newPoints )

      message.channel.post( otherchat.types.systemMessage({
        body: [ message.user, 'gave', newPoints, 'points to', user ],
        author: message.user
      })

    })
  }

})

var pointsCommand = otherchat.client.registerCommand({
  tokens: ['points'],
  // The accepts field tells the client what kind of arguments the command is
  // expecting and how it is called in the context object. In this case,
  // the points command expects users (you can lookup multiple user's points
  // at once).
  accepts: { users: [otherchat.types.user] }
})

pointsCommand.on('query', function(context, done){

  var users = context.users
  
  // Default is to show points for all members of the channel.
  if( users.length == 0 ){
    users = client.currentChannel.members
  }

  var results = users.map( function( user ){

    var points = user.data.getWithDefault( 'points', 0 )

    // For deferreds that haven't completed, the client shows some sort of
    // inline throbber in the chat complete results indicating a piece of data
    // is loading. This lets completes show immediately, even for long lists.
     
    return otherchat.types.singleLineChatComplete({
      text: [ result.user, 'has', points, 'points']
    })

  })

  done( results )

})

//
// HOW DO FEATURES SPREAD?
// 
// The points feature is installed per user, meaning that if I have it installed
// and you don't, I can give you points but you can't give me points.
// 
// The question is, how do you find out how I gave you points and gain the
// ability if desired?
// 
// One way is for any message posted by an app to include attribution (say via
// info/link shown on long-hold). This lets you easily find out how I did it,
// install or find out more. This way a feature can spread organically
// via usage
// 
// In addition, another way might be the following:
// 


//
// SELF-TEACHING BEHAVIOR
//
// If someone who doesn't have the points app tries the syntax while you are
// in the channel, the app sends them a system message that gives a link
// that lets them install
//

otherchat.client.currentChannel.on('message', function(message){
  var didUseSyntax = message.userMentions.filter( function(mention){
    var mentionSuffix = message.text.substr( mention.range.end, 2 )
    return mentionSuffix.match(/[+-]{2}/)
  })

  if( didUseSyntax ) postHintIfNeeded( message.author )
})

function postHintIfNeeded( user ){

  if( user == client.me ) return

  // You can only check if features that share your api key are installed
  user.getIsFeatureInstalled( feature ).then( function( isFeatureInstalled ){

    if( !isFeatureInstalled ){

      var hint = otherchat.types.systemMessage({
        text: ['Psst', user, 'you need', feature, 'to do that'],
        author: feature,
        visibleTo: [user, client.me]
      })

      message.channel.post( hint )

    }

  })
}




/*

THOUGHTS ON PREVIOUS VERSION

Previously, it was otherchat.server.channel('*').on('messageDidPost', ...) which
raised some interesting questions: Are points specific to a channel, to a domain
(i.e., a private channel plus its subchannels), global?

If we are deploying it, we may want to add it as default behavior to every
channel. But for a normal person, they'd be able to install it only on channels
they own.

Maybe there is another way to think about it? If I've installed the points
command, then I'd like to be able to use points in every channel, regardless
whether if it's been installed there.

Seems like this is worth exploring. Say I'm in a channel that doesn't have
the points feature installed, but I have installed it. Then I @adam++. Because
I have it installed, the client could detect what I've done and give the points.
What happens when @adam, who doesn't have the points feature, tries to do the
same? Is there a way to automatically detect and teach @adam how I did it?

At the very least, if @adam long-holds the system message the feature posted,
it should include attribution to the points app (so he can install it, or
flag it as abusive/spam, etc.)

SIDE NOTE: As a user, how do you know what commands are available in a specific
channel? Seems like you'd want to quickly see what the "language" particular to
this channel/domain.

*/
