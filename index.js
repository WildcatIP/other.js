// Copyright (C) 2016 Post Social, inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

if (global.__forcePromisePolyfill) {
  // TODO: The native Promise implementation is crashy in iOS 10. This appears to
  // be fixed in the first service pack, but for now we clear the global Promise
  // so that the polyfill is always used.
  Promise = require('es6-promise').Promise  // eslint-disable-line no-global-assign, no-native-reassign
}

import 'babel-polyfill'
import CommandListener from './lib/CommandListener'
import Feature from './lib/Feature'
import TokenListener from './lib/TokenListener'
import WordListener from './lib/WordListener'
import fetch from './lib/fetch'

export {CommandListener, Feature, TokenListener, WordListener, fetch}
