import test from 'node:test'
import { deepStrictEqual as equal } from 'assert'
import { pick, omit } from '../src/object.js'

test('Pick', _ => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  equal(pick(o, 'a', 'c'), { a: 1, c: 3 }, 'should pick "a", "c" fields')
  equal(pick(o, 'b', 'd'), { b: 2, d: 4 }, 'should pick "b", "d" fields')
  console.log('Pick')
})

test('Omit', _ => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  equal(omit(o, 'a', 'c'), { b: 2, d: 4 }, 'should omit "a", "c" fields')
  equal(omit(o, 'b', 'd'), { a: 1, c: 3 }, 'should omit "b", "d" fields')
  console.log('Omit')
})

