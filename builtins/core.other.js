const {Feature} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.0.4',
  dependencies: {
    otherjs: '2.x'
  }
})

feature.listen({
  to: {commands: ['blockquote', 'caption', 'h1', 'h2', 'h3', 'p', 's']},
  on({command, args}) {
    return {stagedMessage: {format: command === 's' ? 'system' : command}}
  }
})

module.exports = feature
