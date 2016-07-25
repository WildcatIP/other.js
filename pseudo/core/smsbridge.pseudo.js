const {Feature} = require('other');

const feature = new Feature({
  version: '00.1',
  name: 'SMS Bride nOG',
  identity: 'cdb6b77b-99c3-454e-8e89-185badc4644e' // root ;)
});

// Twilio Credentials
var accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authToken = '[AuthToken]',
    twilio = require('twilio')(accountSid, authToken)


// Other Chat
var otherchat = new Otherchat( feature ),
    phoneRegexp = /.../

// Find all at mentions that are phone numbers, and text them

otherchat.client.on( 'willPostMessage', (context, postMessage) => {

  var message = context.message,
      phoneUsers = message.userMentions.filter( mention => mention.name.match( phoneRegexp ) )


  // After a user is created this way, you just nickname them to a mneumonic. The sms icon shows.
  var smsPromises = phoneUsers.map( user => {

    return new Promise( (reject, resolve) => {

      var endpoint = otherchat.server.Endpoint()

      twilio.messages.create({
        to: user.name,
        from: '+14153325538',
        body: message.text,
        StatusCallback: endpoint.url
      })

      endpoint.on('post', request => {
        if( request.params.MessageStatus == 'sent' ) resolve( true )
        if( request.params.MessageStats == 'failed' ) reject( request.params.ErrorCode )
      })

    })

  })

  Promise.all( smsPromises )
    .then( () => postMessage.resolve( true ) )
    .catch( reason => postMessage.reject( reason ) )

})
