const {Feature} = require('other')

const feature = new Feature({
  name: 'Echo',
  version: '0.0.3',
  dependencies: {
    otherjs: '3.2.x'
  },
  identity: '5db2ae95f72b4785ae2348d76c463270'
})

const channel = feature.chatternet.channel({id: '03c2f076c78744dd8e345138ee28ba7f'})
channel.onReceive(message => channel.send(message))

module.exports = feature
