import { µ, use } from './object.js'

export const N = Number

export function random(a, b, r = Math.random()) {
  return a == µ
    ? r
    : Math.round(b == µ
      ? r * a
      : r * (b - a) + a)
}

export function combinations(n, r) {
  const p = n - r
  return factorial(n) / factorial(p)
}

export function factorial(n) {
  let re = n
  while (--n > 0)
    re *= n
  return re
}

use(random, {
  valueOf: Math.random,
  get bool() { return random > .5 },
  get bin() { return N(random.bool) },
  get uid() { return globalThis.crypto.randomUUID() },

  string(size, prev = '') {
    prev += Array.from('abcdefghijklmnopqrstuvwxyz')
        .sort(() => random.bool ? 1 : -1)
        .join('')
    return prev.length < size
      ? random.string(size, prev)
      : prev.slice(0, size)
  },
})

