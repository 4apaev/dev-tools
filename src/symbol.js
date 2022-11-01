export default function Sym(s, ...a) {
  return Symbol(s?.raw ? String.raw(s, ...a) : s)
}

export const HAS  = Sym.has  = Symbol.hasOwnProperty
export const ITER = Sym.iter = Symbol.iterator

export const OK    = Sym.ok    = Sym`✅ OK`
export const NO    = Sym.no    = Sym`❎ NO`
export const ID    = Sym.id    = Sym`🆔 ID`
export const END   = Sym.end   = Sym`🏁 END`
export const ONCE  = Sym.once  = Sym`🔂 ONCE`
export const STOP  = Sym.stop  = Sym`⛔️ STOP`
export const START = Sym.start = Sym`🎬 START`
export const HELP  = Sym.help  = Sym`🆘 HELP`
export const FLAG  = Sym.flag  = Sym`🚩 FLAG`
export const FLIP  = Sym.flip  = Sym`🩴 FLIP`
