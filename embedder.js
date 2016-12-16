if (global.__forcePromisePolyfill) {
  // TODO: The native Promise implementation is crashy in iOS 10. This appears to
  // be fixed in the first service pack, but for now we clear the global Promise
  // so that the polyfill is always used.
  Promise = require('es6-promise').Promise  // eslint-disable-line no-global-assign, no-native-reassign
}

import 'babel-polyfill'
import FeatureHost from './lib/embedder/FeatureHost'
import fetch from './lib/fetch'

export {FeatureHost, fetch}
