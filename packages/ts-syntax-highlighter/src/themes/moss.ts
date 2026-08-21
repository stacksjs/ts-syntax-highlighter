import type { Theme } from '../types'
import { defineTheme } from './palette'

export const moss: Theme = defineTheme({
  name: 'Moss',
  type: 'dark',
  description: 'A green dark theme with enough blue in it to keep the roles apart.',
  palette: {
    background: '#101613',
    foreground: '#cfdcd2',
    surface: '#16201b',
    selection: '#24382c',
    comment: '#7d928a',
    string: '#a8d5a2',
    number: '#e0b56a',
    keyword: '#6fc2a0',
    storage: '#8ab6d6',
    function: '#b8d97a',
    type: '#7fd0c0',
    variable: '#cfdcd2',
    constant: '#e2857a',
    tag: '#6fc2a0',
    attribute: '#7fd0c0',
    punctuation: '#96a99e',
    operator: '#e0b56a',
  },
})
