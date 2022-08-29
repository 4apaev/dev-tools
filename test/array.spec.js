
import {
  it,
  describe,
} from 'node:test'

import {
  strictEqual as eq,
  deepStrictEqual as equal,
} from 'assert'

import Log from '../src/log.js'

import {
  A, from, // at, concat, pop, push, slice, sort, splice, join,
  first, last, head, tail,
  Len, unique, prop, pluck, compact,
  map, invoke, where, find,
  rm, insert, fill,
  chop, rotor, combo,
  permute, predicate,
} from '../src/array.js'

describe('array', () => {

  const s = 'abc'
  const a = from(s)
  const o = Object.fromEntries(a.entries())
  o.length = s.length

  describe('first', () => {
    it('string', () => eq('a', first(s)))
    it('array',  () => eq('a', first(a)))
    it('object', () => eq('a', first(o)))
  })

  describe('last', () => {
    it('string', () => eq('c', last(s)))
    it('array',  () => eq('c', last(a)))
    it('object', () => eq('c', last(o)))
  })

  describe('head', () => {
    it('string', () => equal([ 'a' ], head(s)))
    it('array',  () => equal([ 'a' ], head(a)))
    it('object', () => equal([ 'a' ], head(o)))

    it('string', () => equal([ 'a', 'b' ], head(s, 2)))
    it('array',  () => equal([ 'a', 'b' ], head(a, 2)))
    it('object', () => equal([ 'a', 'b' ], head(o, 2)))
  })

  describe('tail', () => {
    it('string', () => equal([ 'b', 'c' ], tail(s)))
    it('array',  () => equal([ 'b', 'c' ], tail(a)))
    it('object', () => equal([ 'b', 'c' ], tail(o)))

    it('string', () => equal([ 'c' ], tail(s, 2)))
    it('array',  () => equal([ 'c' ], tail(a, 2)))
    it('object', () => equal([ 'c' ], tail(o, 2)))
  })

  describe('Len', () => {
    const i = s.length
    it('string', () => equal(i, Len(s)))
    it('array',  () => equal(i, Len(a)))
    it('object', () => equal(i, Len(o)))

    it('map', () => equal(i, Len(new Set(s))))
    it('set',  () => equal(i, Len(new Map(a.entries()))))

    it('object size', () => equal(i, Len({ size: i })))
    it('object length', () => equal(i, Len({ length: i })))
  })

  describe('unique', () => {
    it('string', () => equal(a, unique(s + s)))
    it('array',  () => equal(a, unique(a.concat(a))))
  })

  describe('prop', () => {
    it('string', () => equal(s[ 1 ], prop(1)(s)))
    it('array',  () => equal(a[ 1 ], prop(1)(a)))
    it('object', () => equal(o[ 1 ], prop(1)(o)))
  })

  it('pluck',  () => {
    const rs = a.map((k, i) => ({ i, k }))
    equal(a, pluck(rs, 'k'))
    equal([ 0, 1, 2 ], pluck(rs, 'i'))
  })

  it('compact',  () => {
    equal([ 3, 2, 1 ], compact([
      undefined,   0,
      null,       1,
      false,      2,
      '',         3,
    ]))

  })

  describe('invoke', () => {
    const args = [ 2 ]
    const repeat = x => x.repeat(...args)
    const rs = map(a, repeat)

    it('method', () => equal(rs, invoke(a, 'repeat', ...args)))
    it('function', () => equal(rs, invoke(a, repeat, ...args)))
    it('property', () => equal(pluck(a, 'length'), invoke(a, 'length')))
  })

  describe('find', () => {
    const ar = [
      { id: 0, ok: 1, kind: 2, type: 1, a: 0, b: 0, c: 0 },
      { id: 1, ok: 0, kind: 1, type: 2, a: 0,       c: 0 },
      { id: 2, ok: 0, kind: 2, type: 1,       b: 0, c: 0 },
      { id: 3, ok: 1, kind: 1, type: 2, a: 0, b: 0       },
    ]

    it('query', () => {
      equal(ar[ 3 ], find(ar, { ok: 1 }))
      equal(ar[ 2 ], find(ar, { ok: 0 }))
      equal(ar[ 1 ], find(ar, { ok: 0, type: 2 }))
    })

    it('callback', () => {
      equal(ar[ 3 ], find(ar, x => x.ok === 1))
      equal(ar[ 2 ], find(ar, x => x.ok === 0))
      equal(ar[ 1 ], find(ar, x => x.ok === 0 && x.type === 2))
    })

    it('array', () => {
      equal(ar[ 3 ], find(ar, [ 'a', 'b' ]))
      equal(ar[ 2 ], find(ar, [      'b', 'c' ]))
      equal(ar[ 1 ], find(ar, [ 'a',      'c' ]))
    })
  })

  describe('where', () => {
    const ar = [
      { id: 0, ok: 1, kind: 2, type: 1,       b: 0, c: 0 },
      { id: 1, ok: 0, kind: 1, type: 2, a: 0,       c: 0 },
      { id: 2, ok: 0, kind: 2, type: 1, a: 0, b: 0, c: 0 },
      { id: 3, ok: 1, kind: 1, type: 2, a: 0, b: 0       },
    ]

    it('query', () => {
      equal([ ar[ 2 ], ar[ 1 ] ], where(ar, { ok: 0 }))
      equal([ ar[ 3 ], ar[ 1 ] ], where(ar, { kind: 1, type: 2 }))
      equal([ ar[ 2 ], ar[ 0 ] ], where(ar, { kind: 2, type: 1 }))
    })

    it('callback', () => {
      equal([ ar[ 2 ], ar[ 1 ] ], where(ar, x => x.ok === 0))
      equal([ ar[ 3 ], ar[ 1 ] ], where(ar, x => x.kind === 1 && x.type === 2))
      equal([ ar[ 2 ], ar[ 0 ] ], where(ar, x => x.kind === 2 && x.type === 1))
    })

    it('array', () => {
      equal([ ar[ 2 ], ar[ 0 ] ], where(ar, [ 'b', 'c' ]))
      equal([ ar[ 3 ], ar[ 2 ] ], where(ar, [ 'a', 'b' ]))
      equal([ ar[ 2 ], ar[ 1 ] ], where(ar, [ 'a', 'c' ]))
    })
  })

  describe('remove', () => {
    const arr = (...a) => [
      { ok: 1, kind: 2 },
      { ok: 0, kind: 1 },
      { ok: 0, kind: 2 },
      { ok: 1, kind: 1 },
    ]

    it('query', () => {
      const ar = arr()
      equal(rm(ar, { ok: 0 }), [
        { ok: 0, kind: 1 },
        { ok: 0, kind: 2 },
      ])
      equal(ar, [
        { ok: 1, kind: 2 },
        { ok: 1, kind: 1 },
      ])
    })

    it('callback', () => {
      const ar = arr()
      equal(rm(ar, x => x.ok === 0), [
        { ok: 0, kind: 1 },
        { ok: 0, kind: 2 },
      ])
      equal(ar, [
        { ok: 1, kind: 2 },
        { ok: 1, kind: 1 },
      ])
    })

    it('array', () => {
      const ar = [
        { ok: 1, kind: 2, a: 1, b: 1, c: 1 },
        { ok: 0, kind: 1, a: 1,       c: 1 },
        { ok: 0, kind: 2,       b: 1, c: 1 },
        { ok: 1, kind: 1, a: 1, b: 1       },
      ]
      equal(rm(ar, [ 'a', 'b' ]), [
        { ok: 1, kind: 2, a: 1, b: 1, c: 1 },
        { ok: 1, kind: 1, a: 1, b: 1       },
      ])
      equal(ar, [
        { ok: 0, kind: 1, a: 1,       c: 1 },
        { ok: 0, kind: 2,       b: 1, c: 1 },
      ])
    })

  })

  describe('insert', () => {
    const run = (exp, pos) => {
      it(`insert at ${ pos }`, () => {
        const arr = [ ...'...' ]
        equal(arr, insert(arr, '@', pos))
        equal(arr, from(exp))
      })
    }

    run('@...', 0) // unshift

    run('.@..', 1)
    run('..@.', 2)
    run('...@', 3) // push like

    run('.@..', 4)
    run('..@.', 5)

    run('@...', 6) // unshift
    run('.@..', 7)
    run('..@.', 8)

    run('@...', 9) // unshift
    run('.@..', 10)
    run('..@.', 11)

    run('@...', 12)
    run('.@..', 13)
    run('..@.', 14)

    run('@...', 15)
    run('.@..', 16)
    run('..@.', 17)

    run('..@.',  -1)
    run('.@..',  -2)
    run('@...',  -3)  // unshift
    run('@...',  -4)  // unshift

  })

})

