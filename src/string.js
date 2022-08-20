import {
  use,
  alias,
} from './object.js'

export const { raw } = String

export function where(s, rx, cb) {
  return Array.from(
    s.matchAll(rx),
    cb ??= x => x?.groups ?? x,
  )
}

export function Tmpl(s, ...a) {
  if (s?.raw == null)
    return s.replace(/\$(\d)/g, (_, i) => a[ i ])

  let re = [ s.raw[ 0 ] ]
  for (let i = 0; i < a.length;)
    re = re.concat(a[ i++ ], s.raw[ i ])
  return re.join('')
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

alias(String.prototype, 'includes', 'has')
