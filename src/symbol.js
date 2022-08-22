export default function Sym(s, ...a) {
  return Symbol(s?.raw ? String.raw(s, ...a) : s)
}

export const ok = Sym.ok = Sym`✅`
export const no = Sym.no = Sym`❎`
export const id = Sym.id = Sym`🆔`
export const end = Sym.end = Sym`🏁`
export const once = Sym.once = Sym`🔂`
export const stop = Sym.stop = Sym`⛔️`
export const start = Sym.start = Sym`🎬`
export const help = Sym.help = Sym`🆘`
export const flag = Sym.flag = Sym`🚩`
export const flip = Sym.flip = Sym`🩴`

