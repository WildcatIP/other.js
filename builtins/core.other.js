const {Command, Feature, StagedMessageResult} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.0.3',
  dependencies: {
    otherjs: '1.2.x'
  }
})

// Why not do the conversion to Command implicitly, so:
//   feature.commadns.push({ ... })
// Same thing for the StagedMessageResult

// tokens and onQuery are vestigial naming from the very first version of oext's. Can we think of better names?
// (I'm a little into calling tokens "words" [|....] )

// What should "/s" be acutally called. Maybe "/small"?

// Not sure I fully grok yet what a StagedMessageResult is

feature.commands.push(new Command({
  tokens: ['/blockquote', '/caption', '/h1', '/h2', '/h3', '/p', '/s'],
  onQuery(token, query) {
    return new StagedMessageResult({
      format: token === '/s' ? 'system' : token.substring(1),
      text: query.replace(/^\s/, '')
    })
  }
}))

module.exports = feature
