//
// CALCULATE
//

const calcCommand = feature.command({
  tokens: ['='],
  version: 'calc.0.1',
  accepts: {query: String},
})

const Maths = require('...') // some 3rd party math library

calcCommand.on('didQuery', (context, promise) => {
  try {
    const answer = Maths.calc(context.query)
    return promise.resolve({
      text: `${context.query} = ${answer}`,
      info: {value: answer, equation: context.query},
    })
  } catch( error ) {
    return promise.reject( error )
  }
})

// Chat Complete types have sensible defaults for what they do when selected.
// You can override the default behavior. For calc, I'd expect you'd want to
// have the answer put into your input, but in case we wanted to render
// something else out...

calcCommand.on('didSelect', (selected, promise) => {
  otherchat.client.post({
    type: 'extension',
    text: `The answer to ${selected.info.equation} is ${selected.info.value}`,
  })

  // If wanted to insert something into the input field
  // otherchat.client.messagePanel.insert( ... )

  promise.resolve( false ) // don't do default behavior
})
