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

    it('clears results after partial match miss', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '/s '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })
  })

  describe('mentions', () => {
    beforeEach(() => {
      const entities = {
        234: {
          name: 'archer',
          isIdentity: true
        },
        345: {
          name: 'cheryl',
          isIdentity: true
        },
        456: {
          name: 'cyril',
          isIdentity: true
        },
        567: {
          name: 'krieger',
          isIdentity: true
        },
        678: {
          name: 'krieger',
          isIdentity: true
        },
        789: {
          name: 'isis'
        },
        890: {
          name: 'espionage',
          parentId: '789'
        },
        901: {
          name: 'dangerzone',
          parentId: '234'
        },
        987: {
          name: 'kgb'
        }
      }
      core.chatternet.emit('UPDATE_ENTITIES', {entities})
    })

    it('mentions identity', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello @archer, whats up?'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: 'hello @archer, whats up?',
          entities: [{id: '234', isIdentity: true, start: 6, length: 7}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('does not mention partial matches', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hello @arch '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('mentions identity channel', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'check out the #archer channel'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: 'check out the @archer channel',
          entities: [{id: '234', isIdentity: true, start: 14, length: 7}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('mentions channel', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#isis '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: '#isis ',
          entities: [{id: '789', isIdentity: false, start: 0, length: 5}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('completes multiple with different names', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@c'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [
          {
            id: '345',
            name: 'cheryl',
            isIdentity: true
          },
          {
            id: '456',
            name: 'cyril',
            isIdentity: true
          }
        ], layout: 'column', replyTag: 123})
        done()
      })
    })

    it('completes multiple with same name', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@krieger'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [
          {
            id: '567',
            name: 'krieger',
            isIdentity: true
          },
          {
            id: '678',
            name: 'krieger',
            isIdentity: true
          }
        ], layout: 'column', replyTag: 123})
        done()
      })
    })

    it('completes only identities for @', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@k'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [
          {
            id: '567',
            name: 'krieger',
            isIdentity: true
          },
          {
            id: '678',
            name: 'krieger',
            isIdentity: true
          }
        ], layout: 'column', replyTag: 123})
        done()
      })
    })

    it('completes only identities and channels for #', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#k'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [
          {
            id: '567',
            name: 'krieger',
            isIdentity: true
          },
          {
            id: '678',
            name: 'krieger',
            isIdentity: true
          },
          {
            id: '987',
            name: 'kgb'
          }
        ], layout: 'column', replyTag: 123})
        done()
      })
    })

    it('ignores completed entities at start', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'hi @krieger', entities: [{id: '567', isIdentity: true, start: 3, length: 8}]}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('ignores completed entities at start', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@krieger', entities: [{id: '567', isIdentity: true, start: 0, length: 8}]}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('mentions ambiguous identity', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'Who is @krieger and who is the clone?'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: 'Who is @krieger and who is the clone?',
          entities: [{id: '567', isIdentity: true, start: 7, length: 8}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('preserves mention of two different identities with same alias', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@krieger is the clone, this is the real @krieger ', entities: [{id: '678', isIdentity: true, start: 0, length: 8}, {id: '567', isIdentity: true, start: 40, length: 8}]}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('applies selected completion', done => {
      core.userAgent.emit('ACTIVATE_CHAT_COMPLETE_RESULT', {action: 'default', result: {id: '678', name: 'krieger', isIdentity: true}, message: {text: 'The clone is @krieg'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: 'The clone is @krieger',
          entities: [{id: '678', isIdentity: true, start: 13, length: 8}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('ignores unknown channel', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#pam '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('mentions subchannel by name', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#espionage '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: '#espionage ',
          entities: [{id: '890', isIdentity: false, start: 0, length: 10}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('mentions subchannel by full path', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#isis/espionage '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: '#isis/espionage ',
          entities: [{id: '890', isIdentity: false, start: 0, length: 15}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('ignores incorrect parent', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#cia/espionage '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })

    it('completes subchannels', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '#isis/'}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(2)
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [
          {
            id: '890',
            name: 'isis/espionage'
          }
        ], layout: 'column', replyTag: 123})
        done()
      })
    })

    it('mentions identity subchannel', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: '@archer/dangerzone '}, tag: 123})
      setImmediate(() => {
        expect(core.userAgent.emit.calls.count()).toEqual(3)
        expect(core.userAgent.emit).toHaveBeenCalledWith('UPDATE_STAGED_MESSAGE', {message: {
          text: '@archer/dangerzone ',
          entities: [{id: '901', isIdentity: true, start: 0, length: 18}]
        }, replyTag: 123})
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: [], replyTag: 123})
        done()
      })
    })
  })

  describe('media links', () => {
    it('recognize vimeo link', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'https://vimeo.com/channels/staffpicks/182359265'}, tag: 123})
      setImmediate(() => {
        const result = [{media: {type: 'video', url: 'https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/1471/7/182359265/598591373.mp4?token=580bd041_0x7c0f833a1498c994291875b53acdb7a682c60bb3', size: {height: 1080, width: 1920}}}]
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: result, replyTag: 123})
      })
    })

    it('recognize instagram link', done => {
      core.userAgent.emit('SET_STAGED_MESSAGE', {message: {text: 'https://www.instagram.com/p/5XcsWuERgS/?taken-by=azaaza'}, tag: 123})
      setImmediate(() => {
        const result = [{media: {type: "video", url: 'https://scontent.cdninstagram.com/t50.2886-16/11773248_1618146288461442_1339867767_n.mp4', size: {height: 640, width: 640}}}]
        expect(core.userAgent.emit).toHaveBeenCalledWith('SET_CHAT_COMPLETE_RESULTS', {results: result, replyTag: 123})
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
