const Feature = require('other');

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
];

const feature = new Feature({id: 'donger.0.1'});

const command = feature.command({
  tokens: ['donger'],
  accepts: {query: String}
});

command.on('didQuery', (context, completes) => {
  const {query} = context;
  let shuffledDongers = DONGERS.sort(() => 0.5 - Math.random());

  if (query.length > 1) {
    const sampleSize = Math.round(DONGERS.length / Math.pow(query.length, 2));
    shuffledDongers = shuffledDongers.slice(0, sampleSize);
  }

  const results = shuffledDongers.map(donger => ({text: donger}));
  completes.resolve(results);
});
