/* eslint-disable */
import { define } from './object.js'

export default function Log(s, ...a) {
  s?.raw
    ? console.log(String.raw(s, ...a))
    : console.log(s, ...a)
}

define(Log, 1, 1, 1, console, {
  g: console.group,
  ge: console.groupEnd,
  gc: console.groupCollapsed,
  end: console.groupEnd,

  color(c, ...a) {
    Log('%c', `color: ${ color(c) };`, ...a)
  },
})

export function color(c) {
  let n = isFinite(c) ? c : parseInt('0x' + c)
  return isFinite(n)
    ? '#' + n.toString(16)
    : c
}


/*

B: 30 39
r: 31 39
g: 32 39
y: 33 39
b: 34 39
m: 35 39
c: 36 39
w: 37 39

BG
  B: 40 49
  r: 41 49
  g: 42 49
  y: 43 49
  b: 44 49
  m: 45 49
  c: 46 49
  w: 47 49

Bright
  B: 90 , 39
  r: 91 , 39
  g: 92 , 39
  y: 93 , 39
  b: 94 , 39
  m: 95 , 39
  c: 96 , 39
  w: 97 , 39
  BG
    B: 100, 49
    r: 101, 49
    g: 102, 49
    y: 103, 49
    b: 104, 49
    m: 105, 49
    c: 106, 49
    w: 107, 49

  reset    : 0  , 0

  b        : 1  , 22
  i        : 3  , 23
  u        : 4  , 24
  s        : 9  , 29
  uu       : 21 , 24
  frame    : 51 , 54
  over     : 53 , 55

  dim      : 2  , 22
  blink    : 5  , 25
  inverse  : 7  , 27
  hidden   : 8  , 28

 */
