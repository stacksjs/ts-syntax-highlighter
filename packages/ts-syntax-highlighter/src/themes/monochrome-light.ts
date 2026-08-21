import type { Theme } from '../types'
import { defineTheme } from './palette'

export const monochromeLight: Theme = defineTheme({
  name: 'Monochrome Light',
  type: 'light',
  description: 'No hue at all, on white: the light half of the pair for readers no colour scheme can serve.',
  palette: {
    background: '#ffffff',
    foreground: '#3e3e3e',
    surface: '#e8e8e8',
    selection: '#d7d7d7',
    comment: '#757575',
    string: '#636363',
    number: '#1b1b1b',
    keyword: '#000000',
    storage: '#2c2c2c',
    function: '#000000',
    type: '#505050',
    variable: '#3e3e3e',
    constant: '#1b1b1b',
    tag: '#2c2c2c',
    attribute: '#505050',
    punctuation: '#757575',
    operator: '#2c2c2c',
  },
  /*
   * With no hue to spend, weight and slope carry what colour carries
   * everywhere else. The lightness ramp still separates the roles a reader
   * compares side by side - a string from a number, a call from the variable
   * it was assigned to - and style separates the rest, which is why `keyword`
   * and `function` can share a value: one of them is bold.
   */
  styles: {
    comment: 'italic',
    keyword: 'bold',
    storage: 'bold',
    type: 'italic',
    constant: 'bold',
    tag: 'bold',
    attribute: 'italic',
  },
})
