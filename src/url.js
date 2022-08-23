import { O, append } from './object.js'

export default class QUrl extends URL {

  get path() {
    return this.pathname
  }

  set path(x) {
    let [ path, ...search ] = x.split('?')
    this.pathname = path
    this.query = search.join('?')
  }

  get query() {
    return append(O.o, this.searchParams)
  }

  set query(x) {
    append(this.searchParams, new URLSearchParams(x))
  }
}
