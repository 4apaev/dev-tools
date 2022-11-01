/* eslint-disable no-unused-vars */

import Is from './is.js'
import { concat } from './array.js'
import { STOP } from './symbol.js'

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

export const define = use
export function use() /* exp */ {
  if (arguments.length === 0)
    return Object.create(null)

  if (arguments.length === 1)
    return Object(arguments[ 0 ])

  if (arguments.length === 2) {
    return Object.defineProperties(arguments[ 0 ],
      Object.getOwnPropertyDescriptors(arguments[ 1 ]))
  }

  // eslint-disable-next-line one-var
  let x, dsc = {}, cew = [], trg = [], src = []
  for (x of arguments) {
    Object(x) === x
      ? cew.length ? src.push(x) : trg.push(x)
      : cew.push(x)
  }

  trg.length || trg.push(src.pop())

  if (trg.length === 0) throw new Error('Invalid definition. missing target')
  if (src.length === 0) throw new Error('Invalid definition. missing source')

  for (x of src)
    Object.assign(dsc, Object.getOwnPropertyDescriptors(x))

      /* eslint-disable indent, brace-style */
      for (x in dsc) {     (dsc[ x ].get ?? (
          cew[ 2 ] != µ && (dsc[ x ].writable     = cew[ 2 ])))
          cew[ 1 ] != µ && (dsc[ x ].enumerable   = cew[ 1 ])
          cew[ 0 ] != µ && (dsc[ x ].configurable = cew[ 0 ])
      } /* eslint-enable indent, brace-style */

  for (x of trg) Object.defineProperties(x, dsc)
  return x
}

export function alias(a, b, c, d) {
  Is.cmplx(c) && (d = c, c = b)
  return Object.defineProperty(d ?? a, c ?? b,
    Object.getOwnPropertyDescriptor(a, b))
}

export function entries(x) {
  if (Symbol.iterator in Object(x)) {
    let tmp = x?.entries?.()
    return Array.from(tmp ?? x, tmp
      ? undefined
      : (v, k) => [ k, v ])
  }
  return Object.entries(x)
}

export function pick(it, ...a) {
  let re = {}
  return each(it, (k, v) => a.includes(k) && (re[ k ] = v), re)
}

export function omit(it, ...a) {
  let re = {}
  return each(it, (k, v) => a.includes(k) || (re[ k ] = v), re)
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

export function each(it, fx, ctx = this) {
  for (const [ k, v ] of entries(it)) {
    if (STOP === fx.call(ctx, k, v))
      break
  }
  return ctx
}

export function reduce(it, fx, acc, ctx = this) {
  for (const [ k, v ] of entries(it)) {
    const re = fx.call(ctx, k, v)
    if (STOP === re)
      break
    else
      acc = re
  }
  return acc
}

each.STOP = STOP
each.kv = each
each.vk = (it, fx, ctx) => each(it, (k, v) => fx.call(ctx, v, k), ctx)

reduce.STOP = STOP
reduce.mkv = reduce
reduce.mvk = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, m, v, k), m, ctx)
reduce.kvm = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, k, v, m), m, ctx)
reduce.vkm = (it, fx, m, ctx) => reduce(it, (m, k, v) => fx.call(ctx, v, k, m), m, ctx)

use(Object, use, define, 1, 0, {
  get o() {
    return O.create(null)
  },
})
