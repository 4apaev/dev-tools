
export default class Fail extends Error {

  name = 'Fail'
  opts = Object.create(null)

  constructor(msg, opt) {
    if (opt === +opt)
      opt = { code: opt }

    else if (typeof opt == 'string' || Error[ Symbol.hasInstance ](opt))
      opt = { cause: opt }

    super(msg, opt)

    const orig = Error.prepareStackTrace

    Error.prepareStackTrace = (_, cs) => cs
    Error.captureStackTrace(this, this.Ctor) // eslint-disable-next-line no-unused-vars
    const { stack } = this
    Error.prepareStackTrace = orig

    Object(opt) === opt
    && Object.assign(this.opts, opt)

    this.Ctor.prev = this.Ctor.curr
    this.Ctor.curr = this
  }

  get Ctor() { return this.constructor }
  get code() { return this.opts.code ??= 0 }

  static prev
  static curr
  static SThrow = Symbol('🧨 throw 🧨')

  static is = x => this[ Symbol.hasInstance ](x)
  static raise = (m, c) => { throw new this(m, c) }
  static assert = (x, m, c) => !!x || this.raise(m, c)

  static Try(fn, ctx, thrw) {
    const { raise, SThrow } = this
    thrw = SThrow === thrw

    return function exec() {
      exec.re = exec.er = undefined

      try {
        exec.re = fn.apply(ctx ?? this, arguments)
        return thrw
          ? exec.re
          : true
      }
      catch (e) {
        fn.er = e
        thrw && raise('Try Fail', e)
        return false
      }
    }
  }

}

export const {
  Try,
  raise,
  assert,
} = Fail

Try.thrw = (fn, ctx) => Try(fn, ctx, Fail.SThrow)

