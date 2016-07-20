import _ from "underscore"

var DONGERS = [
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

let feature = new Feature({id: 'donger.0.1'})

var command = feature.command({
    tokens: [ 'donger' ],
    accepts: { query: String }
})

command.on('didQuery', (context, completes) => {

	var query = context.queryString,
		theDongers = []

	if( query.length <= 1 ){
		theDongers = _( DONGERS ).shuffle()
	} else {
		var sampleSize = Math.round( DONGERS.length / Math.pow( query.length, 2 ) )
		theDongers = _( DONGERS ).sample( sampleSize ) 
	}

	completes.resolve(theDongers)

})