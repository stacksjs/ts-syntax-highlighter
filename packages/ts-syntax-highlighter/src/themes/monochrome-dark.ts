import type { Theme } from '../types'
import { defineTheme } from './palette'

export const monochromeDark: Theme = defineTheme({
  name: 'Monochrome Dark',
  type: 'dark',
  description: 'No hue at all: roles separated by lightness, weight and slope, which is what is left when no colour pair can be relied on.',
  palette: {
    background: '#101010',
    foreground: '#c6c6c6',
    surface: '#1b1b1b',
    selection: '#3e3e3e',
    comment: '#8b8b8b',
    string: '#a0a0a0',
    number: '#e8e8e8',
    keyword: '#ffffff',
    storage: '#d7d7d7',
    function: '#ffffff',
    type: '#b6b6b6',
    variable: '#c6c6c6',
    constant: '#e8e8e8',
    tag: '#d7d7d7',
    attribute: '#b6b6b6',
    punctuation: '#8b8b8b',
    operator: '#d7d7d7',
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
