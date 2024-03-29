import Is from './is.js'
import Sym from './symbol.js'
import { rm } from './array.js'
import {
  µ,
  use,
  each,
  from,
  alias,
  assign,
} from './object.js'

const doc = document
const EVT = Sym.EVT = Sym`📡 events`

export default function $(q, el = doc, cb) {
  Is(Node, el, 1) || (cb = el, el = doc)
  return cb ?? /^\++/.test(q)
    ? Array.from(el.query(q.replace(/^\++/, '')), Is.f(cb ??= x => x) ? cb : x => x[ cb ])
    : el.find(q)
}

use($, {
  get frag() {
    return doc.createDocumentFragment()
  },

  text() {
    return doc.createTextNode.apply(doc, arguments)
  },

  stop(e) {
    return e.preventDefault(
      e.stopPropagation(
        e.stopImmediatePropagation()))
  },

  create(tag, o, ...ch) {
    const el = doc.createElement(tag)
    o != µ && (Is(Object, o) ? el.attr(o) : el.append(o))
    el.append(...ch)
    return el
  },
})

alias(Node.prototype, 'textContent',  'text')
alias(Node.prototype, 'parentElement',  'parent')

alias(Element.prototype, 'classList',  'clas')
alias(Element.prototype, 'hasAttribute',  'has')
alias(Element.prototype, 'toggleAttribute',  'toggle')
alias(Element.prototype, 'lastElementChild',  'last')
alias(Element.prototype, 'firstElementChild',  'first')
alias(Element.prototype, 'nextElementSibling',  'next')
alias(Element.prototype, 'previousElementSibling',  'prev')

alias(Element.prototype, 'querySelectorAll',  'query')
alias(Element.prototype, 'querySelector',  'find')
alias(Document.prototype, 'querySelector',  'find')
alias(Document.prototype, 'querySelectorAll',  'query')

use(Element.prototype, {
  get attrs() {
    return this.attr()
  },

  $(s, cb) {
    return $(s, this, cb)
  },

  html(s) {
    return s == µ
      ? this.innerHTML
      : this.empty().insert(s?.raw
        ? String.raw.apply(String, arguments)
        : s)
  },

  empty() {
    while (this.firstChild) {
      EVT in this.firstChild && this.firstChild.off()
      this.removeChild(this.firstChild)
    }
    return this
  },

  insert(x, pos = 'beforeEnd') {
    this[ Is(Element, x) ? 'insertAdjacentElement' : 'insertAdjacentHTML' ](pos, x)
    return this
  },

  get(k) {
    if (k == µ)
      return this.attr()
    const v = this.getAttribute(k)
    return v === '' ? true : v
  },

  set(k, v) {
    if (v == µ || Is.b(v))
      return this.toggle(k, v)

    if (k.startsWith('clas')) {
      Array.isArray(v) || Is.s(v)
        ? this.classList.add(...[ v ].concat(v))
        : each(v, this.classList.toggle, this.classList)
    }

    else if (Is.o(v)) {
      Is.o(this[ k ])
        ? assign(this[ k ], v)
        : this[ k ] = v
    }

    else {
      this.setAttribute(k, v)
    }
    return this
  },

  attr(k, v) {
    const i = arguments.length
    return i === 0
      ? from(Array.from(this.attributes, a => [ a.name,  this.get(a.name) ]))
      : i === 1
        ? Is.o(k)
          ? each(k, this.set, this)
          : this.get(k)
        : this.set(k, v)
  },

  on(ch, query, cb) {
    Is.f(query) && ([ query, cb ] = [ cb, query ])

    const listener = query
      ? e => e.target.matches(query) && cb(e, e.target, $.stop)
      : e => cb(e, e.target, $.stop)

    const off = (a, b) => (a == µ || a === ch && b == µ || b === cb)
      ? (this.removeEventListener(ch, listener), 1)
      : 0

    this[ EVT ] ??= []
    this[ EVT ].push(off)
    this.addEventListener(ch, listener)
    return this
  },

  off(e, cb) {
    if (EVT in this) {
      Is.f(e) && (cb = e, e = µ)
      rm(this[ EVT ], fx => fx(e, cb))
      this[ EVT ].length === 0 && (delete this[ EVT ])
    }
    return this
  },

  emit(e, detail = {}) {
    this.dispatchEvent(use(new CustomEvent(e, {
      detail,
      bubbles: true,
      cancelable: true,
    }), {
      target: this,
      currentTarget: this,
    }))
    return this
  },
});

`
  script  link  style br  hr div nav ol ul li
  dl dt dd table col  colgroup  caption tr td
  th thead tbody tfoot  main  header aside h1
  h2 h3 footer hgroup h4 h5  h6 article p i q
  b u s em span pre code del dfn ins kbd mark
  samp section abbr acronym time address cite
  blockquote sub sup big small strong  strike
  figure figcaption  audio video  picture img
  svg textarea canvas a button dialog details
  summary form data datalist  fieldset legend
  label  input  output meter  select optgroup
  option             progress             use
`.match(/\S+/g).forEach(t => $[ t ] = $.create.bind($, t))
