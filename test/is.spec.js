import test from 'node:test'
import {
  strictEqual as eq,
  // deepStrictEqual as equal,
} from 'assert'

import Is from '../src/is.js'

test('Is object', () => {
  eq(1, +Is(Object, {}), '{} must object')
  eq(0, +Is(Object, []), '[] isnt object')
  eq(0, +Is(Object, 3), '3 isnt object')
})
