import { end as END } from './symbol.js'
import { use } from './object.js'

const µ = undefined

export const delay = setTimeout
delay.clear = clearTimeout

export function echo(x) {
  return x
}

export function apply(fn, args, ctx) {
  return Reflect.apply(fn, ctx, args)
}

export function bind(fn, ...a) {
  return Reflect.apply(fn.call, fn.bind, a)
}

export function construct(Ctor, ...args) {
  return Reflect.construct(Ctor, args)
}

export function sleep(...a) {
  return new Promise(ok => delay(ok, ...a))
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

export function Co(fn, ...argv) {
  let end, prev, value
  const gen = fn(...argv)

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

