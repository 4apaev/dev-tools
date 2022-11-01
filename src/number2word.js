const BIG = `
thousand
million
billion
trillion`.split('\n')

const SMALL = `
one
two
three
four
five
six
seven
eight
nine
ten
eleven
twelve
thirteen
fourteen
fifteen
sixteen
seventeen
eighteen
nineteen`.split('\n')

const TENS = `

twenty
thirty
forty
fifty
sixty
seventy
eighty
ninety`.split('\n')

export default function num2words(num) {
  num = +num
  let word = ''

  for (let i = 0; i < BIG.length; i++) {
    let pwr = 1000 ** i
    let tmp = num % (100 * pwr)
    let div = tmp / pwr | 0

    if (div) {
      word = `${
        div < 20
          ? SMALL[ div ]
          : TENS[ 0 | tmp / (10 * pwr) ] + ' ' + SMALL[ div % 10 ]
      } ${ BIG[ i ] } ${ word }`
    }

    tmp = num % (1000 ** (i + 1))
    if (tmp = 0 | tmp / (100 * pwr))
      word = SMALL[ tmp ] + ' hunderd ' + word
  }
  return word.trim()
}

/* eslint-disable max-len *//*
123                  one hunderd twenty three
123_234              one hunderd twenty three thousand two hunderd thirty four
123_234_345          one hunderd twenty three million  two hunderd thirty four thousand three hunderd forty five
123_234_345_456      one hunderd twenty three billion  two hunderd thirty four million  three hunderd forty five thousand four hunderd fifty six
123_234_345_456_567  one hunderd twenty three trillion two hunderd thirty four billion  three hunderd forty five million four hunderd fifty six thousand five hunderd sixty seven

console.log('123                 ', num2words(123))
console.log('123_234             ', num2words(123_234))
console.log('123_234_345         ', num2words(123_234_345))
console.log('123_234_345_456     ', num2words(123_234_345_456))
console.log('123_234_345_456_567 ', num2words(123_234_345_456_567))

thousand
million
billion
trillion
quadrillion
quintrillion
sextillion
septillion
octillion
nonillion
decillion
*//* eslint-enable max-len */
