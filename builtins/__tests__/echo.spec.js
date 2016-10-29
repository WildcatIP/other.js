import {default as echo} from '../echo.other'

describe('echo', () => {
  beforeEach(() => {
    spyOn(echo.chatternet, 'emit').and.callThrough()
  })

  it('echos messages from others', (done) => {
    echo.chatternet.emit('UPDATE_MESSAGES', 123, [{text: 'hello', identityId: '234'}])
    setImmediate(() => {
      expect(echo.chatternet.emit.calls.count()).toEqual(2)
      expect(echo.chatternet.emit).toHaveBeenCalledWith('ADD_MESSAGE', 123, {text: 'hello', format: 'system'})
      done()
    })
  })

  it('ignores its own messages', (done) => {
    echo.chatternet.emit('UPDATE_MESSAGES', 123, [{text: 'hello', identityId: '5db2ae95f72b4785ae2348d76c463270'}])
    setImmediate(() => {
      expect(echo.chatternet.emit.calls.count()).toEqual(1)
      done()
    })
  })
})
