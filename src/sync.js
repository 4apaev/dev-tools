import Is from './is.js'

import {
  µ,
  O,
  each,
  assign,
} from './object.js'

export const Mim = O.o

export default class Sync {
  static Head = new Headers
  static Base = location.origin

  url = new URL(Sync.Base)
  headers = new Headers(Sync.Head)
  method = 'GET'
  body = µ
  #opt = O.o

  constructor(m, u = '/') {
    this.method = m.toUpperCase()
    if (/^https?:/i.test(u = String(u)))
      this.url = new URL(u)
    else
      this.url.pathname = u
  }

  has(k) {
    return this.headers.has(k)
  }

  get(k) {
    return this.headers.get(k) ?? ''
  }

  set(k, v) {
    if (Is(O, k))
      each(k, this.headers.set, this.headers)
    else if (v != µ)
      this.headers.set(k, v)
    return this
  }

  opts(k, v) {
    // credentials : omit | include | same-origin
    // mode        : cors | no-cors | same-origin
    // cache       : default | no-store | reload | no-cache | force-cache | only-if-cached
    if (Is(O, k))
      assign(this.#opt, k)
    else
      this.#opt[ k ] = v
    return this
  }

  query(k, v) {
    if (Is(O, k))
      each(k, this.url.searchParams.set, this.url.searchParams)
    else if (v != µ)
      this.url.searchParams.set(k, v)
    return this
  }

  type(k) {
    return k
      ? this.set(Mim.CT, Mim.get(k, k))
      : this.get(Mim.CT)
  }

  send(x) {
    if (x == µ)
      return this

    if (Is(HTMLFormElement, x))
      x = O.fromEntries(new FormData(x))

    else if (Is(FormData, x))
      x = O.fromEntries(x)

    if (Is(O, x)) {
      this.body = JSON.stringify(x)
      this.type() || this.type('json')
    }

    else {
      this.body = String(x)
    }

    return this.set(Mim.CL, this?.body?.length)
  }

  then(...a) {
    return this.end()
        .then(this.parse)
        .then(...a)
  }

  end() {
    return fetch(this.url, {
      ...this.#opt,
      body: this.body,
      method: this.method,
      headers: this.headers,
    })
  }

  async parse(re) {
    // TODO: handle streams

    const payload = {
      ok: re.ok,
      status: re.status,
      headers: re.headers,
    }

    try {
      payload.body = Mim.is('json', re.headers)
        ? await re.json()
        : await re.text()
    }
    catch (e) {
      payload.error = e
    }

    return re.ok ? payload : Promise.reject(payload)
  }

  static get(url, body)  {
    return new Sync('get', url).query(body)
  }

  static put(url, body)  {
    return new Sync('put', url).send(body)
  }

  static post(url, body) {
    return new Sync('post', url).send(body)
  }

  static del(url, body)  {
    return new Sync('delete', url).send(body)
  }
}

assign(Mim, {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  csv: 'text/csv',
  jsx: 'text/jsx',
  yml: 'text/yaml',
  png: 'image/png',
  ico: 'image/x-icon',
  zip: 'application/zip',
  json: 'application/json',
  js: 'application/javascript',
  form: 'multipart/form-data',
  query: 'application/x-www-form-urlencoded',

  CT: 'content-type',
  CL: 'content-length',

  get(k, u) {
    return Mim[ k ] ?? u
  },

  is(k, x) {
    const v = x?.get?.(Mim.CT) ?? x?.[ Mim.CT ] ?? x
    return Mim.get(k, k) === Mim.get(v, v)
  },
})
