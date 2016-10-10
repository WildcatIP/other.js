// Copyright 2016 Post Social, inc.

if (global.__forcePromisePolyfill) {
  // TODO: The native Promise implementation is crashy in iOS 10. This appears to
  // be fixed in the first service pack, but for now we clear the global Promise
  // so that the polyfill is always used.
  Promise = require('es6-promise').Promise  // eslint-disable-line no-native-reassign
}

import 'babel-polyfill'
import CommandListener from './lib/CommandListener'
import Feature from './lib/Feature'
import TokenListener from './lib/TokenListener'
import WordListener from './lib/WordListener'
import fetch from './lib/fetch'

export {CommandListener, Feature, TokenListener, WordListener, fetch}
