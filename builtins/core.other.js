const {Feature} = require('other')

const feature = new Feature({
  name: 'Core',
  version: '0.1.0',
  dependencies: {
    otherjs: '3.1.x'
  }
})

// Format commands
feature.listen({
  to: {commands: ['blockquote', 'caption', 'h1', 'h2', 'h3', 'p', 'small']},
  on({command, args}) {
    // TODO: Remove this small -> system hack once the iOS client understands small.
    return {stagedMessage: {format: command === 'small' ? 'system' : command}}
  }
})

// Emoji tokens
// TODO: Support http://www.webpagefx.com/tools/emoji-cheat-sheet/
feature.listen({
  to: {tokens: ['smile']},
  on({token}) {
    return {text: '😊'}
  }
})

module.exports = feature
