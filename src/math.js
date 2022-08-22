import { µ, use } from './object.js'

const B21 = 2 ** 21 - 1
const B32 = 2 ** 32 - 1
const TMPL = [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 // uuid template: 10000000-1000-4000-8000-100000000000

export const N = Number
export const U32 = Uint32Array
export const U16 = Uint16Array
export const U8 = Uint8Array
export const AB = ArrayBuffer
export const {
  min,
  max,
  ceil,
  floor,
  round,
  random,
} = Math

export default function rand(a, b, r = +rand) {
  return a == µ
    ? r
    : round(b == µ
      ? r * a
      : r * (b - a) + a)
}

export function hex(n) {
  return n.toString(16)
}

export function factorial(n) {
  let re = n
  while (--n > 0)
    re *= n
  return re
}

export function combinations(n, r) {
  const p = n - r
  return factorial(n) / factorial(p)
}

use(rand, {
  valueOf: random,
  string,
  buffer,
  values,
  sample,

  get bin() { return rand > .5 },
  get uuid() { return uuid() },
  get u32() { return new U32(rand.buffer(4))[ 0 ] },
  get u53() {
    const a = new U32(rand.buffer(8))
    return (a[ 0 ] & B21) * (B32 + 1) + (a[ 1 ] >>> 0)
  },

})

export function uuid(prefix = '') {
  return prefix + TMPL.replace(/[018]/g, c =>
    hex(c
        ^ rand.u32
        & 15
       >> c
        / 4))
}

export function values(a) /* crypto.getRandomValues */ {
  for (let i = 0; i < a.length; i++)
    a[ i ] = ceil((B32 * rand) >>> 0)
  return a
}

export function buffer(n) {
  const b = new AB(n)
  const a = new U8(b)
  rand.values(a)
  return b
}

export function sample(a) {
  return a[ floor(rand * a.length) ]
}

export function string(size, s = '') {
  while (size--)
    s += sample('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  return s
}

