const {FeaturePack} = require('other');

// PepClock
//
// Have a message waiting for a friend in the morning with something you want
// want to pep them up about!
//
// The server just holds the message until a given time and then passes it back
// to the client to be acted on.

var feature = new FeaturePack({
  name: 'Pep Clock!',
  version: '0.1',
  identity: 'dfjklsaj3-87da-4546-b08b-b656461042dfjh4'
})

var pepclockCommand = feature.command({
  id: 'pepclock',
  tokens: ['pepclock'],
  version: '0.1',
  accepts: {query: String}
})


// A pepclock command example would be
// pepclock @za You are the best at getting ligament surgery! tomorrow at 9am

pepclockCommand.on('didQuery', (context, doFinish) => {

  // First we tokenize each part of the command.
  var user, message, timestamp;
  var pepParser = new PepParser();
  [user, message, timestamp] = pepParser(context.query)

  // Then it behaves similarly to the @mention FeaturePack except instead of
  // filtering by one user and the action being whisper, we have each user listed
  // twice with the option to send the pep as a whisper or to their homeroom

  // Search for the user's who match the query

  otherchat.client.users.find(user).then( users => {

    // Add yourself in because, hey, you deserve some pep too!

    users.push(client.me)

    // Sort by name, alphebetically and then double up each one.
    // Once with a the action being a posting pep as a private whisper,
    // the other being posting to their homeroom.

    users = users.sortBy(user => user.name)
    var results = users.map( user => ({user: user, message: message, timestamp: timestamp, action: 'Send Pep!'}) )

    didQuery.resolve( results )

})
.catch( reason => didQuery.reject( reason ) )

// When they've selected a user and action pair, push it to the server to be posted later

pepclockCommand.on('didAction', (selected, didAction) => {

  var info = {
    from: client.me,
    to: selected.user,
    message: selected.user.message,
    timestamp: selected.user.timestamp
  }

  var theChannel = selected.user.channel;

  // Q: Should something like info.timestamp and info be optional params at
  //    the end of runAsServer?

  theChannel.scheduleRunAsServer( info.timestamp, info, (serverContext, didRun) => {

    var channel = serverContext.channel,
        info = serverContext.info

    channel.post( info )
    .then(() => {
      channel.post({
        type: 'system',
        text: `Pep scheduled for ${info.timestamp} `
      })

      didRun.resolve()
    })
    .finishWith( didRun )
  })
  .catch( reason => didRun.reject( reason ) )

})

// Q: What is passed into the then(function(x) {}) in these promises?
.finishWith( didAction )

// Thoughts:
// A receivedDelayedPost hook would be a part of browser-core. It would really
// act no differently than any other post except that it is delivered in the
// future by the server.
//
// Potential gotchas
//
// If messages are end-to-end encypted, can the server ever post to a group chat
// without decoding it by proxy through a user? Does this call for a "bot"
// hosted by a 3rd party that sits in the channel?
//
// If this was implemented as a whisper, it wouldn't matter because it would be
// processed at the time the user's device receives the push notification.
