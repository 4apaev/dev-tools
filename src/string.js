import {
  µ,
  alias,
  define,
} from './object.js'

import Is from './is.js'
import { bind } from './func.js'

export const S = String
export const { raw } = S
export const up = bind(''.toUpperCase)
export const low = bind(''.toLowerCase)
export const char = bind(''.charCodeAt)
export const point = bind(''.codePointAt)
export const match = bind(''.match)
export const repl = bind(''.replace)
export const trim = bind(''.trim)

trim.left = bind(''.trimStart)
trim.right = bind(''.trimEnd)
trim.lines = s => trim(repl(s, /( +)?\n+( +)?/g, ''))

pad.right = bind(''.padEnd)
pad.left = bind(''.padStart)

export function where(s, rx, cb) {
  return Array.from(
    s.matchAll(rx),
    cb ??= x => x?.groups ?? x,
  )
}

function resolve(a, b) {
  let m = b.match(/^\s*\/(\w+)(.*)/)
  return m
    ? [ Is.empty(a) ? m[ 1 ] : a, m[ 2 ] ]
    : [ a, b ]
}

export function Tmpl(str, ...argv) {
  if (str?.raw == µ) {
    return str.replace(/\$(\d)(?:\/(\w+))?/g, (_, a, b) => Is.empty(argv[ a ])
      ? b ?? _
      : argv[ a ])
  }

  let rs = [ str.raw[ 0 ] ]
  for (let i = 0; i < argv.length;)
    rs = rs.concat(...resolve(argv[ i++ ], str.raw[ i ]))
  return rs.join('')
}

export function Rx(s, ...a) {
  let fl = ''
  let pttr = s?.raw ? raw(s, ...a) : s
  pttr = pttr.replace(/( +)?\n+( +)?/g, '').trim()
  pttr = pttr.replace(/\/([gimdsuy]+)\/?$/, (_, f) => (fl += f, '')).trim()
  return new RegExp(pttr, fl)
}

export function dedent(s, ...a) {
  const x = s?.raw ? raw(s, ...a) : s
  const i = x.length - x.trimLeft().length - 1
  return i > 0
    ? x.split('\n').map(x => x.slice(i)).join('\n')
    : x
}

export function pad(s, n) {
  let re = ' '
  let flag = 0
  while (n > s.length) {
    s = (flag ^= 1)
      ? s + re
      : re + s
  }
  return s
}

export function cat(s, ...a) {
  let i = s.indexOf(...a)
  return i < 0
    ? [ s, '' ]
    : [ s.slice(0, i), s.slice(++i) ]
}

export function extend() {
  /* eslint-disable indent */
define(String.prototype, 1, 0, {
  get up()    { return this.toUpperCase() },
  get low()   { return this.toLowerCase() },
  get log()   { return console.info('%s', this) },
  get char()  { return this.charCodeAt() },
  get point() { return this.codePointAt() },
})

alias(String, 'fromCodePoint', 'from')
alias(String.prototype, 'includes', 'has')
  /* eslint-enable indent */
}
