const {Feature} = require('other')

// This is a stop-gap rechat that we could implement nearly now.
//
// Use the rechat command to rechat the last message in a channel. It get's
// posted by the original author, with a system message beneath it that says:
//
// > 'rechat from #foo by @blah'
const feature = new Feature({
  name: 'Rechat Simple (Stopgap)',
  version: '0.0.1',
  dependencies: {
    otherjs: '^3.2.x',
  },
  identity: 'fffd90068a6249638d804323b7c93ffb',
})

feature.listen({
  to: 'message',
  on(message, channel) {
    // TODO: Make it possible to get the most recent message. It's incorrect to
    // "rechat" the rechat message.
    const {identityId, text} = message
    const command = parseCommand(text)
    if (!command) return

    // TODO: Make it possible to send this message on behalf of the user.
    const targetChannel = feature.chatternet.channel({id: command.channelId})
    targetChannel.send({format: 'system', text: command.text})
    targetChannel.send({format: 'system', text: `rechat from <#${channel.id}> by <@${identityId}>`})
  },
})

module.exports = feature

// <mess>
// TODO: This mess all goes away after it's possible to use both a
// CommandListener and chattetnet events in the same feature.
const command = '/rechat '
const channelRegexp = /<[@#][a-f0-9]{32}>/
function parseCommand(text) {
  if (!text.startsWith(command)) return null
  const args = text.substring(command.length)
  const targetChannelPosition = args.search(channelRegexp)
  if (targetChannelPosition === -1) return null
  return {
    channelId: args.substring(targetChannelPosition + 2, 34),
    text: args.replace(channelRegexp, '').trim(),
  }
}
// </mess>
