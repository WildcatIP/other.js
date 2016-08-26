const {Feature} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.0.5',
  dependencies: {
    otherjs: '3.x'
  }
})

feature.listen({
  to: {commands: ['blockquote', 'caption', 'h1', 'h2', 'h3', 'p', 'small']},
  on({command, args}) {
    // TODO: Remove this small -> system hack once the ioS client understands small.
    return {stagedMessage: {format: command === 'small' ? 'system' : command}}
  }
})

module.exports = feature
