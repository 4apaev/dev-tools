const µ = undefined
const has = Symbol.hasInstance

export default class Fail extends Error {
  name = 'Fail'
  opts = Object.create(null)

  static cache = Cache(4)
  static result = Cache(4)

  constructor(m, o) {
    if (o === +o)
      o = { code: o }
    else if (isErr(o) || typeof o == 'string')
      o = { cause: o }

    super(m, o)

    const Start = this.constructor
    const orig = Error.prepareStackTrace

    Error.prepareStackTrace = (_, cs) => cs
    Error.captureStackTrace(this, Start)

    // eslint-disable-next-line no-unused-vars
    const { stack } = this

    Error.prepareStackTrace = orig
    typeof o == 'object' && Object.assign(this.opts, o)
    Start.cache.set(this)
  }

  get code() {
    return this.opts.code ??= 0
  }

  static is = x => this[ has ](x)
  static as = (m, o) => new this(m, o)
  static assert = (x, m, o) => x || this.raise(m, o)
  static raise = (m, o) => {
    throw (this.cache = typeof o == 'function'
      ? new o(m)
      : new this(m, o))
  }

  static Try = (fx, ctx, Ctor = this) => function () {
    Ctor.result = Ctor.error = µ
    try {
      return [
        µ,
        Ctor.result = fx.apply(ctx ?? this, arguments),
      ]
    }
    catch (cause) {
      return [
        Ctor.error = new this(cause?.message ?? cause, {
          argv: Array.from(arguments),
          cause,
          fx,
        }),
        µ,
      ]
    }
  }
}

export function Cache(size) {
  const a = new Array(size)
  a.i = 0
  a.set = x => (a.head = a[ a.curr = a.i++ % size ] = x, a.i)
  a.get = i => a[ i % size ]
  return a
}

export function isErr(x) {
  return Error[ has ](x)
}

export const {
  Try,
  raise,
  assert,
} = Fail

