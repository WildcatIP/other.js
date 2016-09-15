const {fetch, Feature} = require('other')

const feature = new Feature({
  name: 'Translate',
  version: '0.0.1',
  dependencies: {
    otherjs: '3.2.x'
  }
})

const apiKey = 'trnsl.1.1.20160505T065015Z.5bd4645fbce8439c.821669b0ee870acc3992e6a1a30f2621b1c472ab'
const translateUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}`
const languages = getLanguages()
feature.listen({
  to: {words: ['translate']},
  on({word, rest}) {
    let toLang = 'en'
    let query = rest.replace(word, '').trim()
    const moreThanOneWord = query.split(/\b/).length >= 2

    if (moreThanOneWord) {
      const lastWord = query.match(/\b\w+$/)[0].toLowerCase()
      const	toLangs = Object.keys(languages).filter(x => x.startsWith(lastWord))
      toLang = toLangs.length >= 1 ? languages[toLangs[0]] : toLang
      if (toLang !== 'en') {
        query = query.replace(/\b\w+$/, '')
      }
    }

    const url = `${translateUrl}&text=${encodeURIComponent(query)}&lang=${encodeURIComponent(toLang)}`
    return fetch(url).then(response => response.json()).then(json => {
      return {chatCompletions: json.text.map(t => ({text: t}))}
    })
  }
})

function getLanguages() {
  return {
    albanian: 'sq',
    english: 'en',
    arabic: 'ar',
    armenian: 'hy',
    azerbaijan: 'az',
    afrikaans: 'af',
    basque: 'eu',
    belarusian: 'be',
    bulgarian: 'bg',
    bosnian: 'bs',
    welsh: 'cy',
    vietnamese: 'vi',
    hungarian: 'hu',
    haitian: 'ht',
    galician: 'gl',
    dutch: 'nl',
    greek: 'el',
    georgian: 'ka',
    danish: 'da',
    yiddish: 'he',
    indonesian: 'id',
    irish: 'ga',
    italian: 'it',
    icelandic: 'is',
    spanish: 'es',
    kazakh: 'kk',
    catalan: 'ca',
    kyrgyz: 'ky',
    chinese: 'zh',
    korean: 'ko',
    latin: 'la',
    latvian: 'lv',
    lithuanian: 'lt',
    malagasy: 'mg',
    malay: 'ms',
    maltese: 'mt',
    macedonian: 'mk',
    mongolian: 'mn',
    german: 'de',
    norwegian: 'no',
    persian: 'fa',
    polish: 'pl',
    portuguese: 'pt',
    romanian: 'ro',
    russian: 'ru',
    serbian: 'sr',
    slovakian: 'sk',
    slovenian: 'sl',
    swahili: 'sw',
    tajik: 'tg',
    thai: 'th',
    tagalog: 'tl',
    tatar: 'tt',
    turkish: 'tr',
    uzbek: 'uz',
    ukrainian: 'uk',
    finish: 'fi',
    french: 'fr',
    croatian: 'hr',
    czech: 'cs',
    swedish: 'sv',
    estonian: 'et',
    japanese: 'ja'
  }
}

module.exports = feature
