import {default as core} from '../core.other'

describe('core', () => {
  beforeEach(() => {
    spyOn(core.userAgent, 'emit').and.callThrough()
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

    it('applies caption', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/caption '}, tag: 123})
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
            {text: '🎳'},
            {text: '🙇'}
          ],
          replyTag: 123
        })
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
})
