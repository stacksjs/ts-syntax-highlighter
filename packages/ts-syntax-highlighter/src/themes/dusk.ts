import type { Theme } from '../types'
import { defineTheme } from './palette'

export const dusk: Theme = defineTheme({
  name: 'Dusk',
  type: 'dark',
  description: 'A purple dark theme, kept legible by a green and a teal.',
  palette: {
    background: '#16121f',
    foreground: '#d5cde0',
    surface: '#1e1929',
    selection: '#322a45',
    comment: '#8b81a1',
    string: '#9ad9a0',
    number: '#f0b26a',
    keyword: '#a78bfa',
    storage: '#8ab4f8',
    function: '#e2b0ff',
    type: '#7fd6d0',
    variable: '#d5cde0',
    constant: '#ff9db0',
    tag: '#a78bfa',
    attribute: '#7fd6d0',
    punctuation: '#9d94b0',
    operator: '#f0b26a',
  },
})
