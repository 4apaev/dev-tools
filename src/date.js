
import { hrtime } from 'node:process'

export const Units = [
  [ 'year', 31536000000 ], // 60 * 60 * 24 * 365
  [ 'month', 2628000000 ], // 60 * 60 * 24 * 365 / 12
  [ 'day', 86400000 ],     // 60 * 60 * 24
  [ 'hour', 3600000 ],     // 60 * 60
  [ 'minute', 60000 ],     // 60
  [ 'second', 1000 ],      // 1
]

export const DTF = new Intl.DateTimeFormat([], {
  // year: 'numeric',
  // weekday: 'short',
  month: 'short',

  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  // dayPeriod: 'long',
  // era: 'long',
})

export function date(d = new Date) {
  return DTF.format(d)
}

export function range(a, b = Date.now()) {
  a > b || ([ a, b ] = [ b, a ])
  return period(+b - +a)
}

export function period(ms) {
  const buf = []
  for (let [ unit, value ] of Units) {
    const x = +ms / value
    const i =  0 | x
    if (i) {
      buf.push(i.toLocaleString('en', {
        unit,
        style: 'unit',
        unitDisplay: 'long',
      }))
      ms = (x - i) * value
    }
  }
  return buf
}

export function uptime() {
  return period(process.uptime() * 1000)
}

export function now(start) {
  return start ? ((a, b) => Math.round((a * 1000) + (b / 1000000)))(...hrtime(start)) : hrtime()
}

