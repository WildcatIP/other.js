const {ChatCompleteResult, Command, Feature} = require('other')

const DONGERS = [
  "⊂(▀¯▀⊂)",
  "ᕙ(˵ ಠ ਊ ಠ ˵)ᕗ",
  "ԅ( ͒ ۝ ͒ )ᕤ",
  "o͡͡͡╮༼ • ʖ̯ • ༽╭o͡͡͡",
  "ᕙʕ ಥ ▃ ಥ ʔᕗ",
  "ᕙᓄ(☉ਊ☉)ᓄᕗ",
  "╰། ◉ ◯ ◉ །╯",
  "ʕ ᓀ ᴥ ᓂ ʔ",
  "ᕦ༼ ✖ ਊ ✖ ༽ᕤ",
  "ლ(ಥ Д ಥ )ლ",
  "⋌༼ •̀ ⌂ •́ ༽⋋",
  "( ຈ ﹏ ຈ )",
  "¯\\_༽ ಥ Д ಥ ༼_/¯",
  "໒( •̀ ╭ ͟ʖ╮ •́ )७",
  "[ * ༎ຶ _ ༎ຶ * ]"
]

module.exports = new Feature({
  name: 'Donger',
  version: '0.0.1',
  commands: [
    new Command({
      tokens: ['donger'],
      onQuery(token, query, promise) {
        let shuffledDongers = DONGERS.sort(() => 0.5 - Math.random())

        if (query.length) {
          const sampleSize = Math.round(DONGERS.length / Math.pow(query.length, 2))
          shuffledDongers = shuffledDongers.slice(0, sampleSize)
        }

        const results = shuffledDongers.map(donger => new ChatCompleteResult({text: donger}))
        promise.resolve(results)
      }
    })
  ]
})
