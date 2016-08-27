import {default as core} from '../builtins/core.other'

describe('format commands', () => {
  beforeEach(() => {
    spyOn(core.userAgent, 'emit').and.callThrough()
  })

  it('ignores messages without format commands', () => {
    core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello'}, tag: 123})
    expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
  })

  it('autocompletes heading commands', () => {
    core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/h'}, tag: 123})
    expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {
      results: [
        {text: '/h1 '},
        {text: '/h2 '},
        {text: '/h3 '}
      ],
      replyTag: 123
    })
  })

  it('applies caption', done => {
    core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/caption '}, tag: 123})
    process.nextTick(() => {
      expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {text: '', format: 'caption'}, replyTag: 123})
      // TODO: This should pass.
      // expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
      done()
    })
  })

  it('ignores unknown format command', () => {
    core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/unknown '}, tag: 123})
    expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
  })
})
