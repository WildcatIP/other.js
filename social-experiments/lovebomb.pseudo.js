//
// LoveBomb
//
// Friend down? Perhaps just in need of a celebration? Ping your friends to
// create send them a custom channel full of love, created just for them.

var feature = new FeatureSet({
  apiKey: 'zkl3lkkd-87da-4546-k33b-vcjk42dfdfj',
  id: 'lovebomb',
  version: '0.0.1',
  name: 'Love Bomb'
})

// Lots of possible ways this interaction could work out. Let's explore a few of
// them ...
//
// One way would be a to create a special smart channel with a featureset that
// eventually gets sent to the user
//
// bs: lovebomb @patrick
//
// lovebomb whispers to @bs: Hi! So @patrick could use a little love, you say?
// Well you're in luck ... I've created a channel just for the occasssion. Visit
// #lovebomb/patrick to get started. <3"
//
// FeatureSet creates a room #lovebomb/patrick and prepopulates it with the
// system message:
//
// "Welcome to @patrick's love bomb! This is a space where you and your friends
// can collaborate on what you want to send them. A love bomb can consist of
// text, pictures, gifs, videos. Whatever you want, really! And don't worry,
// chat away. When you're all done, I'll clean up everything nicely and package
// it up to be sent. <3
//
// For more information type `help`"
// Q: Will @patrick get a notification when his name is mentioned here? Maybe if
// the channel is private?
// Q: Maybe this should be namespaced to #bs/lovebomb/patrick to reduce
// collisions?
//
// Response to `help` command
// A lovebomb is a special type of chatroom where you can collaborate with
// friends to create a list of messages, pictures and gifts to send to a friend
// in need of some love, whatever the reason. Available commands are:
//
// `help`    - this message
// `reason`  - set a short description of what kind of lovebomb you're creating
// `invite`  - invite people to collaborate on this lovebomb
// `send`    - bombs away!
//
// System message:
// "Let's get started by describeing what you want to create using the `reason`
// command. An example might be
//
// reason So, @patrick is doing a big thingeo at work today and I'd love to send
// him some love. Can everyone record a video telling him how awesome he is?
//
// This will be pinned at the bottom of the channel for new collaborators to
// see." 
//
// @bs: So, @patrick is doing a big thingeo at work today and I'd love to send
// him some love. Can everyone record a video telling him how awesome he is?
//
// System message:
// "Great! Now let's invite a few people to collaborate on this. You can do this
// by using the regular invite command. For example, `invite @krista @ginger
// @joshua`
//
// System message:
// When you're ready, start putting messages, videos, and anything else you
// might want in #lovebomb/patrick/create"
//
// Note: Inside #lovebomb/patrick/create users can write messages, record
// videos, etc. Using the existing otherchat infrastruture one would be able to
// delete a message or video posted on accident. In the future it may be
// worthwhile to have them be re-ordered through commands. This begs the
// question:
//
// Q: Will otherscript (and the browser in general) be able to reorder a
// message? At the very least that would involve invalidating the cache for the
// room, a potentially expensive operation. That being said, deletes currently
// do this.  I guess this falls more under the realm of more nuanced operations
// like edit, etc.
//
// Ginger joins the room
//
// System message:
// "Hey @ginger! NBD, we're just creating an amazing ball of love to send
// @patrick. Get started by putting something #lovebomb/patrick/create or type
// help for more info."
//
// send
//
// System message:
// "Ready to send? Last chance to look over #lovebomb/patrick/preview and make
// any changes you might want. When you're sure you're ready to go, just confirm
// by typing `bombs away` and I'll message @patrick with a link.
//
// bombs away
//
// System message:
// "Done! I've just messaged @patrick with their lovebomb at
// #lovebomb/patrick/<3
//
// I've also archived this channel at #lovebomb/patrick/behind-the-scenes, which
// you can make public if you ever want to show them your creative process ;)
