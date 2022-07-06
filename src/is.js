export default function Is(a, b) {
  return arguments.length < 2
    ? a != null
    : a === b?.constructor
}

export function T(x) {
  return toString.call(x).slice(8, -1)
}

Is.a = Array.isArray
Is.n = Number.isFinite
Is.i = Number.isInteger
Is.I = x => Symbol.iterator in Object(x)
Is.O = x => Object === x?.constructor
Is.o = x => typeof x == 'object' && !!x
Is.f = x => typeof x == 'function'
Is.b = x => typeof x == 'boolean'
Is.s = x => typeof x == 'string'
Is.S = x => typeof x == 'symbol'

Is.cmplx = x => Object(x) === x
Is.prmtv = x => Object(x) !== x
Is.ctor = x => Is.f(x) && x === x?.prototype?.constructor

Is.empty = x => {
  for (let k in x)
    return false
  return true
}

Is.inst = (a, b) => a[ Symbol.hasInstance ](b)

Is.equal = (a, b) => {
  if (a === b)
    return true

  let t = T(a)

  if (t != T(b))
    return false

  if (t == 'Object')
    t = 'Array', a = Object.entries(a), b = Object.entries(b)

  else if (t == 'Set' || t == 'Map')
    t = 'Array', a = Array.from(a), b = Array.from(b)

  if (t == 'Array')
    return a.length === b.length && a.every((x, i) => Is.equal(x, b[ i ]))

  else
    return String(a) === String(b)
}

Is.some = (...a) => {
  const x = a.pop()
  return a.some(Fx => Is(Fx, x))
}

Is.every = (...a) => {
  const x = a.pop()
  return a.every(Fx => Is.inst(Fx, x))
}
