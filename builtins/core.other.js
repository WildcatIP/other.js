const {Command, Feature, StagedMessageResult} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.0.3',
  dependencies: {
    otherjs: '1.2.x'
  }
})

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
