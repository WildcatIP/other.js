var otherchat = new Otherchat(),
    server = otherchat.server,
    Twilio = require('...')

function isValidPhoneNumber( string ){
  /* code */
}
    
server.channel('*').on('message', function(message){
  
  var phoneUsers = message.userMentions.each(function( user ){
    
    if( isPhoneNumber(user.name.match) ){
      Twilio.send({
        to: user.name,
        body: [ message.from, ':\n', message.text ]
      })
    }

  })

})

// TODO: The bridge back