import test from 'node:test'
import { deepStrictEqual as equal } from 'assert'
import Log, { color } from '../src/log.js'

test('Color', () => {
  equal('red', color('red'), 'should return "red" color')
  equal('rgb(32, 64, 128)', color('rgb(32, 64, 128)'), 'should return "rgb(32, 64, 128)" color')

  let a = color(0xbada55)
  let b = color('bada55')
  let c = color('#bada55')

  Log`+++++++++++++++++++++++++++++++++++++`
  Log('A 0xbada55', a)
  Log('B   bada55', b)
  Log('C  #bada55', c)
  Log`====================================`

  equal('#bada55', a, '[hex] should prefix "0xbada55" with "#"')
  equal('#bada55', b, '[str] should prefix "  bada55" with "#"')
  equal('#bada55', c, '[str] should return " #bada55"')
})
