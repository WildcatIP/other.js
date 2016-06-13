//
// POINTS
// Give and take away points by posting @adam-- or @alien++ in a message, then
// view the points with the 'points' command
//

// Where this feature gets installed is an interesting question:
//
// The first time I tried writing it, I installed behavior on the channel so
// that the server could listen for new messages with the right syntax and
// giveth or taketh points away.
//
// But, you don't control every channel, so in those channels points wouldn't
// work which frusterates habit formation and hence the use of the command.
// 
// This implementation instead is run by the client, and the behavior installed
// on a user.

let feature = new OtherchatFeature({
  apiKey: '8b889bba-87da-4546-b08b-b6564610261b',
  id: 'points'
  version: 'points.0.2',
  name: 'Points++',
  description: 'Give points to people with @user++, take them away with @user--.'
})

let otherchat = new Otherchat( feature )

//
// CLIENT
//

let suffixToPoints = { '++': 1, '+-': 0.5, '-+': -0.5, '--': -1 }

// Installs the listener on the client

otherchat.client.on('messageDidPost', (context, promise) => {

  // For each user mention, see if the next two characters match any of the
  // suffixes which gives points

  // Message objects contain handy-dandy common things, like lists of users
  // or channels mentioned in the message text.

  let message = context.message

  message.userMentions.each( mention => {
    
    let mentionSuffix = message.text.substr( mention.range.end, 2 )
    if( mentionSuffix.match(/[+-]{2}/) ){
      await givePointsToUser( mention.user, mentionSuffix )
    }

  })
  
  async function givePointsToUser( user, suffixText ){

    // Behind the scenes, data is essentially a key-value store with a key
    // tuple of (apiKey, userId, propertyName). This lets all extensions that
    // share an API key share data.
    //
    // You can also channel.data to store data on a channel. Or
    // feature.data to store feature-wide data.

    try {

      let points = await user.data.get( 'points' ) || 0
      await user.data.set( 'points', points + suffixToPoints[suffixText] )

      await message.channel.post({
        type: 'extension',
        body: `${message.user} gave ${newPoints} points to ${user}`,
      })

      promise.resolve()

    }
    catch (reason) promise.reject( reason )

})

let pointsCommand = feature.command({
  tokens: ['points'],
  // The accepts field tells the client what kind of arguments the command is
  // expecting and how it is called in the context object. In this case,
  // the points command expects users (you can lookup multiple user's points
  // at once).
  accepts: { users: [otherchat.types.user] }
})

pointsCommand.on('didQuery', (context, promise) => {

  let users = context.users
  
  // Default is to show points for all members of the channel.
  if( users.length == 0 ){
    users = client.currentChannel.members
  }

  let results = users.map( user => ({
    text: user.data.get( 'points', [])
      .then( points => `${user} has ${points} points` )
      .catch( reason => `${user} has ? points` )
  })

  promise.resolve( results )

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

otherchat.client.on('message', context => {

  let message = context.message

  let didUseSyntax = message.userMentions.filter( mention => {
    let mentionSuffix = message.text.substr( mention.range.end, 2 )
    return mentionSuffix.match(/[+-]{2}/)
  })

  if( didUseSyntax ) postHintIfNeeded( message.author )
})

function postHintIfNeeded( user ){

  if( user == client.me ) return

  // You can only check if features that share your api key are installed

  user.getIsFeatureInstalled( feature ).then( isFeatureInstalled  => {

    if( !isFeatureInstalled ){

      message.channel.post({
        type: 'extension',
        text: `Psst ${user}, you need ${feature} to do that`,
        whoCanSee: [user, client.me]
      })

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
