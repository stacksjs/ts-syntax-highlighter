import type { Theme } from '../types'
import { defineTheme } from './palette'

export const tritanopiaLight: Theme = defineTheme({
  name: 'Tritanopia Light',
  type: 'light',
  description: 'Blue-yellow safe on a white page: teals against magentas, with no pair resting on blue against yellow.',
  palette: {
    background: '#fffcff',
    foreground: '#241f28',
    surface: '#f5eef6',
    selection: '#f0d9ec',
    comment: '#635a68',
    string: '#006d63',
    number: '#a3004f',
    keyword: '#b0007a',
    storage: '#6a3fb0',
    function: '#00566b',
    type: '#8a0060',
    variable: '#241f28',
    constant: '#8a0030',
    tag: '#b0007a',
    attribute: '#00566b',
    punctuation: '#575060',
    operator: '#a3004f',
  },
})
