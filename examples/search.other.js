const {fetch, Feature} = require('other')

const feature = new Feature({
  name: 'Duck Duck Go',
  version: '0.0.2',
  dependencies: {
    otherjs: '^3.2.x',
  },
})

feature.listen({
  to: {words: ['web']},
  on({word, rest}) {
    const query = encodeURIComponent(rest.replace(word, '').trim())
    const url = `https://api.duckduckgo.com/?q=${query}&format=json`
    return fetch(url).then((response) => response.json()).then((json) => {
      if (!json.RelatedTopics) return null
      const chatCompletions = json.RelatedTopics.map((t) => {
        return {text: t.Text}
      })
      return {chatCompletions}
    })
  },
})

module.exports = feature
