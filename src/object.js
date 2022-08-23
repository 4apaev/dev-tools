/* eslint-disable no-unused-vars */

import Is from './is.js'
import { concat } from './array.js'
import {
  stop as STOP,
  flip as FLIP,
} from './symbol.js'

export const µ = undefined
export const O = Object
export const {
  keys,
  assign,
  hasOwn: own,
  fromEntries: from,
} = O

export const {
  parse,
  stringify,
} = JSON

export function mix(...a) {
  return assign(O.o, ...a)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export function set(a, b, c) {
  return c
    ? O.defineProperty(a, b, c)
    : O.defineProperties(a, b)
}

export function use(a, b) {
  return set(a, get(b))
}

export function alias(a, b, c = b, d = a) {
  return set(d, c, get(a, b))
}

export function entries(x) {
  return Symbol.iterator in O(x)
    ? x?.entries?.() ?? Array.from(x, (v, k) => [ k, v ])
    : O.entries(x)
}

export function pick(it, ...a) {
  return reduce(it, (re, k, v) => {
    if (a.includes(k))
      re[ k ] = v
    return re
  }, {})
}

export function omit(it, ...a) {
  return reduce(it, (re, k, v) => {
    if (!a.includes(k))
      re[ k ] = v
    return re
  }, {})
}

export function tost(x, n) {
  const seen = new WeakSet
  return stringify(x, (k, v) => {
    if (Is.cmplx(v)) {
      if (seen.has(v))
        return `[ Circular:${ k } ]`
      seen.add(v)
    }
    return  v
  }, n ?? 2)
}

export function define() {
  if (arguments.length < 2)
    return O(arguments[ 0 ])

  let a // eslint-disable-next-line one-var
  const dsc = {}, trg = [], src = [], cew = []

  for (a of arguments)
    Is.cmplx(a) ? cew.length ? trg.push(a) : src.push(a) : cew.push(a)

  if (src.length === 0)
    src.push(trg.shift())

  else if (trg.length === 0)
    trg.push(src.pop())

  if (src.length === 0)
    throw 'Impossible Definition. missing source'

  if (trg.length === 0)
    throw 'Impossible Definition. missing target'

  for (a of trg)
    assign(dsc, get(a))

  if (cew.length) {                                       // eslint-disable-next-line brace-style
    for (a in dsc) { (dsc[ a ].get ?? (                   // eslint-disable-next-line indent
      cew[ 2 ] == µ || (dsc[ a ].writable = cew[ 2  ])))  // eslint-disable-next-line indent
      cew[ 1 ] == µ || (dsc[ a ].enumerable = cew[ 1 ])   // eslint-disable-next-line indent
      cew[ 0 ] == µ || (dsc[ a ].configurable = cew[ 0 ])
    }
  }

  for (a of src)
    set(a, dsc)
  return a
}

export function append(a, b) {
  const cb = Is.f(a?.set)
    ? Is.f(a?.append)
      ? (k, v) => a[ a.has(k) ? 'append' : 'set' ](k, v)
      : (k, v) => a.set(k, a.has(k) ? concat(a.get(k), v) : v)
    : (k, v) => a[ k ] = k in a ? concat(a[ k ], v) : v

  for (const [ k, v ] of entries(b))
    cb(k, v)
  return a
}

export function each(it, fx, ctx, sym) {
  let k = 0
  let v = 1

  if (FLIP === it)
    k = 1, v = 0, it = fx, fx = ctx, ctx = sym

  else if (FLIP === ctx)
    k = 1, v = 0, ctx = sym, sym = FLIP

  else if (FLIP === sym)
    k = 1, v = 0

  for (const kv of entries(it))
    fx.call(ctx, kv[ k ], kv[ v ])
  return ctx
}

export function reduce(it, fx, memo, ctx = this) {
  for (const [ k, v ] of entries(it)) {
    const re = fx.call(ctx, memo, k, v)
    if (stop === re)
      break
    memo = re
  }
  return memo
}

each.kv = each
each.vk = (it, fx, ctx) => each(it, (k, v) => fx.call(ctx, v, k), ctx)

reduce.mkv = reduce
reduce.mkv = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, m, k, v), m, ctx)
reduce.mvk = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, m, v, k), m, ctx)
reduce.kvm = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, k, v, m), m, ctx)
reduce.vkm = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, v, k, m), m, ctx)

define(O, use, define, 1, 0, {
  get o() {
    return O.create(null)
  },
})
