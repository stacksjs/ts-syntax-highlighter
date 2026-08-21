import type { Theme } from '../types'
import { defineTheme } from './palette'

export const deuteranopiaLight: Theme = defineTheme({
  name: 'Deuteranopia Light',
  type: 'light',
  description: 'Red-green safe on a white page: blues and ambers only, no pair that needs red-green vision to tell apart.',
  palette: {
    background: '#ffffff',
    foreground: '#1c2430',
    surface: '#f0f3f8',
    selection: '#d6e4f7',
    comment: '#5b6675',
    string: '#8a5a00',
    number: '#6b4300',
    keyword: '#0b4fa8',
    storage: '#2f5fb8',
    function: '#a06a00',
    type: '#0a6bbd',
    variable: '#1c2430',
    constant: '#5a3800',
    tag: '#0b4fa8',
    attribute: '#2f5fb8',
    punctuation: '#4d5866',
    operator: '#6b4300',
  },
})
