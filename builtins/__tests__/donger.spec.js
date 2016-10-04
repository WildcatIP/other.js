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

  it('replaces whole message with donger', done => {
    donger.userAgent.emit('ACTIVATE_CHAT_COMPLETE_RESULT', {action: 'default', result: {text: 'ᵔᴥᵔ'}, message: {text: 'hello donger goodbye'}, tag: 123})
    setImmediate(() => {
      expect(donger.userAgent.emit.calls.count()).toEqual(3)
      expect(donger.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: 'ᵔᴥᵔ'}, replyTag: 123})
      expect(donger.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
      done()
    })
  })
})
