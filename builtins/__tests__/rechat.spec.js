import {default as rechat} from '../rechat.other'

describe('rechat', () => {
  beforeEach(() => {
    spyOn(rechat.chatternet, 'emit').and.callThrough()
  })

  it('does incorrect simplified rechat', (done) => {
    rechat.chatternet.emit('UPDATE_MESSAGES', 123, [{text: '/rechat <#03aea5a92a124d679c866e8dc97bdf1d> hello', identityId: '234'}])
    setImmediate(() => {
      expect(rechat.chatternet.emit.calls.count()).toEqual(3)
      expect(rechat.chatternet.emit).toHaveBeenCalledWith('ADD_MESSAGE', '03aea5a92a124d679c866e8dc97bdf1d', {text: 'hello', format: 'system'})
      expect(rechat.chatternet.emit).toHaveBeenCalledWith('ADD_MESSAGE', '03aea5a92a124d679c866e8dc97bdf1d', {text: 'rechat from <#123> by <@234>', format: 'system'})
      done()
    })
  })

  it('ignores other commands', (done) => {
    rechat.chatternet.emit('UPDATE_MESSAGES', 123, [{text: '/something else', identityId: '5db2ae95f72b4785ae2348d76c463270'}])
    setImmediate(() => {
      expect(rechat.chatternet.emit.calls.count()).toEqual(1)
      done()
    })
  })
})
