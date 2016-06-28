//
// A Rock Paper Scissors Game
//
// Shows a more Firebase-y handling server state logic.
//
// Game works like this:
//
// "rock paper scissors @alien"
// > @za has challenged @alien to a game of rock paper scissors
// Both @za and @alien see a message specific to them that includes three buttons (R/P/S)
// > @za has thrown, waiting for @alien... 
// > Rock beats scissors, @alien wins vs @za!
//

var feature = new FeatureSet({
  apiKey: 'cdb6b77b-99c3-454e-8e89-185badc4644e',
  id: 'rockpaperscissors',
  version: '0.1'
})

var otherchat = new Otherchat( feature )

var rpsCommand = feature.command({
  tokens: ['rock paper scissors'],
  version: '0.1',
  name: 'Rock Paper Scissors',
  description: 'Challenge someone to the age-old game, but without hands.',
  action: 'challenge',
  // accepts means shows users as didQuery chat complete
  accepts: {user: otherchat.types.user, query: String}
})


let RPS = {
  
  startGame: gameRef => {

    let historyRef = gameRef.child( 'history' ),
        game = gameRef.value()

    // A message with three buttons: rock, paper, scissors

    let actionPickers = [game.challenger, game.challengee].map( user => ({
        text: 'What will you throw?',
        actions: ['Rock', 'Paper', 'Scissors'],
        whoCanSee: user,
        _didSelect: selected => historyRef.append({ by: context.user, action: selected.action })
      })
    )

    let msg = {
      type: 'system',
      text: `${info.challenger} has challenged ${info.challengee} to a game of rock paper scissors`
    }

    return game.channel
      .post( msg )
      .post( chooseThrows )
    
  },

  whoWins: ( throwA, throwB ) => { /* Looks like: { type: 'tie' || 'won', winningThrow: ..., losingThrow: ... } */ },

  doPlayerAction: ( actionRef ) => {

    let game = await actionRef.parent().value(),
        playerAction = actionRef.value(),
        channel = game.channel

    // If first throw, announce who threw and who we are waiting for

    if ( game.history.length == 0 ) {

      let otherPlayer = [game.challenger, game.challengee].filter( player => player != playerAction.by )

      msg.text = `${playerAction.by} has thrown, waiting for ${otherPlayer}...`

      return game.channel
        .post( msg )
        .then( () => gameRef.child('history').append( playerAction ) )

    }

    // If second throw, announce game results

    else if ( game.history.length == 1 ){

      let firstThrow = game.history.first(),
          secondThrow = playerAction,
          result = RPS.whoWins( firstThrow, secondThrow )

      msg.text = result.type == 'tie'
                    ? `${game.info.challenger} and ${game.info.challengee} both threw ${firstThrow.action} for a tie!`
                    : `${result.winningThrow.action} beats ${result.losingThrow.action}, ${result.winningThrow.by} wins vs ${result.losingThrow.by}!`
      
      return channel
        .post( msg )
        .then( () => gameRef.remove() )

    }
  }
  
}

rpsCommand.on( 'didAction', selected => {

  return feature.data.append({
    channel: otherchat.client.currentChannel,
    challenger: otherchat.client.me,
    challengee: selected.user,
    history: [
      _didAppend: RPS.doPlayerAction
    ],
    _didAppendedTo: RPS.startGame
  })

})

// FURTHER THOUGHTS:
//
// More commands that are similar to this one:
// - guess the number between 1-100
// - guess the number that's 1/3 of the average number
// - roll to decide who wins: single-button to roll, pipe through dice roll command?
//
// More discoverable via a parent "play" command?
// play --> chat complete of games
// play: rock paper scissors
// play: rock paper scissors @alien
