const {Feature} = require('other')

const feature = new Feature({
  name: 'Echo',
  version: '0.0.5',
  dependencies: {
    otherjs: '3.2.x'
  },
  identity: '5db2ae95f72b4785ae2348d76c463270'
})

feature.listen({
  to: 'message',
  on(message, channel) {
    // Everyone knows that a quack doesn't echo ;-)
    const text = message.text === 'quack' ? 'silence' : message.text
    channel.send({format: 'system', text})
  }
})

module.exports = feature
