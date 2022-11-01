/* eslint-disable no-unused-vars */
import test from 'node:test'
import { deepStrictEqual as equal } from 'assert'
import {
  µ,
  O,
  from,
  pick,
  omit,
  entries,
  alias,
} from '../src/object.js'

test('Pick', _ => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  equal(pick(o, 'a', 'c'), { a: 1, c: 3 }, 'should pick "a", "c" fields')
  equal(pick(o, 'b', 'd'), { b: 2, d: 4 }, 'should pick "b", "d" fields')

})

test('Omit', _ => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  equal(omit(o, 'a', 'c'), { b: 2, d: 4 }, 'should omit "a", "c" fields')
  equal(omit(o, 'b', 'd'), { a: 1, c: 3 }, 'should omit "b", "d" fields')
})

test('Entries', async t => {
  const ab = 'ab'
  const expected = [[ 0, 'a' ], [ 1, 'b' ]]
  await t.test('string', _ => equal(expected, entries(ab), 'should get string entries'))
  await t.test('array ', _ => equal(expected, entries([ ...ab ]), 'should get array entries'))
  await t.test('object', _ => equal(
    expected.map(kv => kv.map(String)),
    entries(from(expected)),
    'should get object entries'))
})

test('Alias', async t => {
  const v = 'A'
  const o = { get a() { return v } }

  equal(v, o.a)
  equal(µ, o.b)

  await t.test('add: should alias property', _ => {
    equal(v, alias(o, 'a', 'b').b, 'o.a === o.b')
    equal(
      O.getOwnPropertyDescriptor(o, 'a'),
      O.getOwnPropertyDescriptor(o, 'b'),
    )
  })

  await t.test('should copy property "a" from `source` to `target`', _ => {
    const source = { get a() { return v } }
    const target = {  }
    alias(source, 'a', target)

    equal(source.a, v)
    equal(source.a, target.a)
    equal(
      O.getOwnPropertyDescriptor(source, 'a'),
      O.getOwnPropertyDescriptor(target, 'a'),
    )
  })

  await t.test('should copy property "a" from "source" to "target" and rename it to "b"', _ => {
    const source = { get a() { return v } }
    const target = {  }

    alias(source, 'a', 'b', target)
    equal(source.a,         target.b)
    equal(v,                target.b)
    equal(µ,                target.a)

    equal(
      O.getOwnPropertyDescriptor(source, 'a'),
      O.getOwnPropertyDescriptor(target, 'b'),
    )
  })

})

