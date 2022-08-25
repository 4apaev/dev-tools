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

export function Len(it) {
  return it?.length ?? it?.size
}

export function pluck(it, k) {
  return it.map(x => x[ k ])
}

export function unique(it) {
  return Array.from(new Set(it))
}

export function where(it, iter, ctx) {
  return it.filter(predicate(iter), ctx)
}

export function fill(n, fx = x => x) {
  return typeof fx == 'function'
    ? Array.from({ length: n }, (_, i) => fx(i))
    : Array(n).fill(fx)
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

export function chop(it, n) {
  const re = []
  const cb = n === +n ? (_, i) => 0 === i % n : n

  for (let tmp, i = 0; i < it.length; i++) {
    cb(it[ i ], i) && re.push(tmp = [])
    tmp.push(it[ i ])
  }
  return re
}

export function invoke(it, fn, ...a) {
  return it.map(typeof fn == 'function'
    ? x => fn.apply(x, a)
    : typeof it?.[ 0 ]?.[ fn ] == 'function'
      ? x => x[ fn ].apply(x, a)
      : x => x[ fn ])
}

export function compact(it) {
  return it.filter(x =>
    Boolean(typeof x == 'string'
      ? x.trim()
      : x != null))
}

export function rotor(n) {
  const r = Array(n)
  r.i = 0
  r.add = x => {
    r.head = r[ r.cursor = r.i++ % n ] = x
    return r.i
  }
  return r
}

export function insert(it, x, pos) {
  let i = it.length

  if (i === pos) {
    it.push(x)
    return it
  }

  pos += i
  pos %= i

  if (i < 1) {
    it.unshift(x)
    return it
  }

  while (i) {
    if (i === pos) {
      it[ i ] = x
      break
    }
    else {
      it[ i-- ] = it[ i ]
    }
  }
  return it
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
    return re.push(Array.from(it))

  for (let j, i = 0, m = n - 1; i < n; i++) {
    permute(it, m, re)

    j = n % 2 ? 0 : i; [

      it[ j ], it[ m ] ] = [
      it[ m ], it[ j ] ]
  }
  return re
}

export function* permuteGen(it, n = it.length) {
  if (n <= 1) {
    yield Array.from(it)
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
  if (typeof x == 'function')
    return x

  if (Array.isArray(x))
    return o => x.every(k => k in o)

  const ks = Object.keys(x)
  return o => ks.every(k => o[ k ] === x[ k ])
}
