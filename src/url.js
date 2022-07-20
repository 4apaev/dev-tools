export default class QUrl extends URL {

  get path() {
    return this.pathname
  }

  set path(x) {
    let [ path, ...search ] = x.split('?')
    this.pathname = path
    this.search = search.join('?')
  }

  get query() {
    const o = {}
    for (const [ k, v ] of this.searchParams)
      o[ k ] = k in o ? [].concat(o[ k ], v) : v
    return o
  }

  set query(x) {
    for (const [ k, v ] of new URLSearchParams(x)) {
      this.searchParams[ this.searchParams.has(k)
        ? 'append'
        : 'set' ](k, v)
    }
  }
}
