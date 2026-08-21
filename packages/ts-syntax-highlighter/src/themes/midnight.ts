import type { Theme } from '../types'
import { defineTheme } from './palette'

export const midnight: Theme = defineTheme({
  name: 'Midnight',
  type: 'dark',
  description: 'A cool blue-violet dark theme, the default dark surface of this library.',
  palette: {
    background: '#10131c',
    foreground: '#c8d0e0',
    surface: '#171b28',
    selection: '#263049',
    comment: '#8790a8',
    string: '#7fd6a2',
    number: '#f2a97e',
    keyword: '#7aa2f7',
    storage: '#9d7cd8',
    function: '#7dcfff',
    type: '#4fd6be',
    variable: '#c8d0e0',
    constant: '#f7768e',
    tag: '#7aa2f7',
    attribute: '#4fd6be',
    punctuation: '#98a1b8',
    operator: '#89ddff',
  },
})
