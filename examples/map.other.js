const {fetch, Feature} = require('other')

const feature = new Feature({
  name: 'Map',
  version: '0.0.11',
  dependencies: {
    otherjs: '^3.6.x',
  },
})

const token = 'pk.eyJ1IjoiYXphYXphIiwiYSI6ImNpd2Z4d3VzeTAxMWYyb3MxeXlua2ptYWQifQ.i0_NWuVx81Mw_63es6IaYA'
const geocodeURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/QUERY.json?access_token=' + token
const mapURL = 'https://api.mapbox.com/v4/mapbox.streets/pin-m+919cff(LON,LAT)/LON,LAT,16.5/600x150.png?access_token=' + token

feature.listen({
  to: {words: ['map']},
  on({word, rest}) {
    const query = encodeURIComponent(rest.replace('map ', ''))
    if (query.length <= 4) return null

    const url = geocodeURL.replace(/QUERY/, query)
    return fetch(url).then((response) => response.json()).then((json) => {
      if (json.features.length == 0) return null

      return {
        chatCompletions: json.features.map((feature) => {
          const center = feature.center
          const imgURL = mapURL.replace(/LON/g, center[0]).replace(/LAT/g, center[1])
          return {
            media: {
              type: 'image',
              url: imgURL,
              size: {width: 600, height: 150},
            },
          }
        }),
      }
    })
  },
})

module.exports = feature
