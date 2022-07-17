import { use } from './object.js'

export function where(s, rx, cb) {
  return Array.from(
    s.matchAll(rx),
    cb ??= x => x?.groups ?? x,
  )
}

export function Rx(s, ...a) {
  let fl = ''; let pttr = s?.raw ? String.raw(s, ...a) : s
  pttr = pttr.replace(/( +)?\n+( +)?/g, '').trim()
  pttr = pttr.replace(/\/([gimdsuy]+)\/?$/, (_, f) => (fl += f, '')).trim()
  return new RegExp(pttr, fl)
}

export function dedent(s, ...a) {
  const x = s?.raw ? String.raw(s, ...a) : s
  const i = x.length - x.trimLeft().length - 1
  return i > 0
    ? x.split('\n').map(x => x.slice(i)).join('\n')
    : x
}

use(String.prototype, {
  get up()    { return this.toUpperCase() },
  get low()   { return this.toLowerCase() },
  get log()   { return console.info('%s', this) },
  get char()  { return this.charCodeAt() },
  get point() { return this.codePointAt() },
})
