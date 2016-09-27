import {default as donger} from '../donger.other'

describe('donger', () => {
  beforeEach(() => {
    spyOn(donger.userAgent, 'emit').and.callThrough()
  })

  it('ignores messages without donger', done => {
    donger.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello world'}, tag: 123})
    setImmediate(() => {
      expect(donger.userAgent.emit.calls.count()).toEqual(2)
      expect(donger.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
      done()
    })
  })

  it('recognizes donger', done => {
    donger.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'donger'}, tag: 123})
    setImmediate(() => {
      expect(donger.userAgent.emit.calls.count()).toEqual(2)
      const {layout, results} = donger.userAgent.emit.calls.argsFor(1)[1]
      expect(results.length).toEqual(13)
      expect(layout).toEqual('tile')
      done()
    })
  })
})
