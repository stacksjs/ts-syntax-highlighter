import type { Theme } from '../types'
import { defineTheme } from './palette'

export const tritanopiaDark: Theme = defineTheme({
  name: 'Tritanopia Dark',
  type: 'dark',
  description: 'Blue-yellow safe: the roles split on teal against magenta, which stays distinct under tritanopia.',
  palette: {
    background: '#14121a',
    foreground: '#ded6e2',
    surface: '#1d1a25',
    selection: '#33293c',
    comment: '#9b90a6',
    string: '#4fd1c5',
    number: '#ff8fd0',
    keyword: '#ff6ec7',
    storage: '#c58af0',
    function: '#7fe3d8',
    type: '#ff9ecb',
    variable: '#ded6e2',
    constant: '#ff7a9c',
    tag: '#ff6ec7',
    attribute: '#7fe3d8',
    punctuation: '#a99eb3',
    operator: '#ff8fd0',
  },
})
