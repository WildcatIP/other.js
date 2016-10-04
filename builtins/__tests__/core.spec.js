import {default as core} from '../core.other'

describe('core', () => {
  beforeEach(() => {
    spyOn(core.userAgent, 'emit').and.callThrough()
    spyOn(core.environment, 'emit').and.callThrough()
  })

  it('clears chat complete for empty messages', done => {
    core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: ''}, tag: 123})
    setImmediate(() => {
      expect(core.userAgent.emit.calls.count()).toEqual(2)
      expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
      done()
    })
  })

  describe('format command', () => {
    it('ignores messages without format commands', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('autocompletes heading commands', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/h'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {
          layout: 'tile',
          results: [
            {text: '/h1 '},
            {text: '/h2 '},
            {text: '/h3 '}
          ],
          replyTag: 123
        })
        done()
      })
    })

    it('applies caption when typed', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/caption '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: '', format: 'caption'}, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('applies caption from chat completion', done => {
      core.userAgent.emit('ACTIVATE_CHAT_COMPLETE_RESULT', {action: 'default', result: {text: '/caption'}, message: {text: '/capt'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: '', format: 'caption'}, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('ignores unknown format command', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/unknown '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })
  })

  describe('emoji tokens', () => {
    it('recognizes smile', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello :smile:'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: 'hello 😄'}, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('autocompletes', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello :bow'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {
          layout: 'tile',
          results: [
            {text: '🎳', actions: ['default']},
            {text: '🙇', actions: ['default']}
          ],
          replyTag: 123
        })
        done()
      })
    })

    it('replaces partial completions', done => {
      core.userAgent.emit('ACTIVATE_CHAT_COMPLETE_RESULT', {action: 'default', result: {text: '🙇'}, message: {text: 'hello :bow'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: 'hello 🙇'}, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('dismisses autocomplete', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello :bow '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })
  })

  describe('gif word', () => {
    it('searches for gifs', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'gif simpsons'}, tag: 123})
      setImmediate(() => {
        expect(core.environment.emit.calls.count()).toEqual(1)
        expect(core.environment.emit).toHaveBeenCalledWith('FETCH', {input: 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=simpsons&limit=7', tag: 1})

        const giphyResponse = {
          data: [{
            images: {
              original: {
                url: "https://media3.giphy.com/media/4rb6ojYxk35CM/giphy.gif",
                width: "320",
                height: "214"
              }
            }
          }]
        }
        core.environment.emit('FETCH_RESPONSE', {body: JSON.stringify(giphyResponse), replyTag: 1})
        setImmediate(() => {
          const result = {
            media: {
              type: 'image',
              url: 'https://media3.giphy.com/media/4rb6ojYxk35CM/giphy.gif',
              size: {height: 214, width: 320}
            }
          }
          expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {layout: 'row', results: [result], replyTag: 123})
          done()
        })
      })
    })

    it('is case insensitive', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'Gif simpsons'}, tag: 123})
      setImmediate(() => {
        expect(core.environment.emit.calls.count()).toEqual(1)
        done()
      })
    })

    it('does not match .gif extensions', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'simpsons.gif'}, tag: 123})
      setImmediate(() => {
        expect(core.environment.emit.calls.count()).toEqual(0)
        done()
      })
    })
  })
})
