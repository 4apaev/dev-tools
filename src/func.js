import { END } from './symbol.js'
import { µ, use } from './object.js'

export const F = Function
export const delay = setTimeout
delay.clear = clearTimeout

export const bind = F.prototype.bind.bind(F.prototype.call, F.prototype.call)

export function isf(x) {
  return typeof x == 'function'
}

export function echo(x) {
  return x
}

echo.argv = function argv() {
  return arguments
}

export function apply(fn, args, ctx) {
  return Reflect.apply(fn, ctx, args)
}

export function construct(Ctor, ...args) {
  return Reflect.construct(Ctor, args)
}

export function compose(f, ...fs) {
  return (...a) => fs.reduce((prev, next) => next(prev), f(...a))
}

export function box(x) {
  return () => x
}

export function thunk(prev) {
  return next => next(prev)
}

export function sleep(ms, x) {
  return new Promise(ok => delay(ok, ms, x))
}

export function once(fn, ctx) {
  let ok, re
  return function () {
    return ok
      ? re
      : re = apply(fn, arguments, ctx ?? this, ok = 1)
  }
}

export function debounce(fn, ms, ctx) {
  let id
  let re = []

  const stop = () => delay.clear(id)
  const start = a => re.push(apply(fn, a, ctx, id = µ))
  const next = () => stop(id = delay(start, ms, arguments))

  return use(next, {
    stop,
    start,
    get result() { return re },
    get value() { return re.at(-1) },
  })
}

export function Co(fn, ...args) {
  let end, prev, value
  const gen = fn(...args)

  const next = (...a) => {
    if (end === END)
      return console.warn('cannot call next after end'), END

    const re = gen.next(...a)
    return re.done
      ? end = END
      : prev = value, value = re.value
  }

  return use(next, {
    next,
    get end()  { return end === END },
    get prev() { return prev },
    get value() { return value },
  })
}

