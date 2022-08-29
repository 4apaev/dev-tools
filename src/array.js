import Is from './is.js'
import { bind } from './func.js'

export const A = Array
export const at            = bind([].at)
export const concat        = bind([].concat, [])
export const pop           = bind([].pop)
export const push          = bind([].push)
export const slice         = bind([].slice)
export const sort          = bind([].sort)
export const splice        = bind([].splice)
export const join          = bind([].join)

export const { from } = Array

export function first(it)   { return it?.[ 0 ] }
export function last(it)    { return at(it, -1) }
export function head(it, i) { return slice(it, 0, i ?? 1) }
export function tail(it, i) { return slice(it, i ?? 1) }

export function Len(it) { return it?.length ?? it?.size }

export function unique(it) { return from(new Set(it)) }

export function prop(k)     { return o => o[ k ] }
export function pluck(it, k) { return map(it, prop(k)) }
export function compact(it) { return where(it, Boolean) }

export function map(it, cb, ctx) {
  let i = Len(it)
  let a = Array(i)
  for (; i--;)
    a[ i ] = cb.call(ctx, at(it, i), i)
  return a
}

export function invoke(it, fn, ...a) {
  if (Is.f(fn))
    return map(it, x => fn.call(x, x, ...a))

  if (Is.f(at(it)?.[ fn ]))
    return map(it, x => x[ fn ].apply(x, a))

  return map(it, prop(fn))
}

export function where(it, iter, ctx) {
  let a = []
  for (let x, i = Len(it), cb = predicate(iter); i--;) {
    cb.call(ctx, x = at(it, i), i)
      && a.push(x)
  }
  return a
}

export function find(it, iter, ctx) {
  for (let x, i = Len(it), cb = predicate(iter); i--;) {
    if (cb.call(ctx, x = at(it, i), i))
      return x
  }
}

export function rm(it, iter, ctx) {
  let j = 0
  let re = []
  for (let x, i = 0, cb = predicate(iter); i < it.length; i++) {
    cb.call(ctx, x = it[ i ], i)
      ? re.push(x)
      : it[ j++ ] = it[ i ]
  }
  it.length = j
  return re
}

export function insert(it, x, pos) {
  let i = Len(it)
  Number.isInteger(pos = +pos) || (pos = i)

  if (pos === i)
    return it.push(x), it

  pos += i
  pos %= i

  if (pos < 1)
    return it.unshift(x), it

  while (i) {
    if (i === pos) return (it[ i ] = x), it
    it[ i-- ] = it[ i ]
  }
  return it
}

export function fill(n, fx = x => x) {
  return Is.f(fx)
    ? from({ length: n }, (_, i) => fx(i))
    : Array(n).fill(fx)
}

export function chop(it, n) {
  const re = []
  const cb = n === +n ? (_, i) => 0 === i % n : n

  for (let tmp, i = 0; i < it.length; i++) {
    cb(it[ i ], i) && re.push(tmp = [])
    tmp.push(it[ i ])
  }
  return re
}

export function rotor(n) {
  const r = Array(n)
  r.index = 0
  r.add = x => {
    r.head = r[ r.cursor = r.index++ % n ] = x
    return r.index
  }
  return r
}

export function combo(n, cb = x => x) {
  const re = Array(1 << n)
  for (let z, y = re.length; y--;) {
    re[ y ] = Array(n)
    for (let x = n; x--;) {
      z = y & 1 << x
      re[ y ][ x ] = cb(+!!z, { x, y, z })
    }
  }
  return re
}

export function permute(it, n = it.length, re = []) {
  if (n === 1)
    return re.push(from(it))

  for (let j, i = 0, m = n - 1; i < n; i++) {
    permute(it, m, re)
    j = n % 2 ? 0 : i;
    [
      it[ j ], it[ m ],
    ] = [
      it[ m ], it[ j ],
    ]
  }
  return re
}

export function* permuteGen(it, n = it.length) {
  if (n <= 1) {
    yield from(it)
  }
  else {
    for (let j, i = 0, m = n - 1; i < n; i++) {
      yield *permuteGen(it, m)
      j = n % 2 ? 0 : i;  [
        it[ m ], it[ j ] ] = [
        it[ j ], it[ m ] ]
    }
  }
}

export function predicate(x) {
  if (Is.f(x))
    return x

  if (Is.a(x))
    return o => x.every(k => k in o)

  const ks = Object.keys(x)
  return o => ks.every(k => o[ k ] === x[ k ])
}
