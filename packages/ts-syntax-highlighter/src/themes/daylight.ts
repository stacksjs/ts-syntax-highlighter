import type { Theme } from '../types'
import { defineTheme } from './palette'

export const daylight: Theme = defineTheme({
  name: 'Daylight',
  type: 'light',
  description: 'A warm neutral light theme for reading code on paper-coloured pages.',
  palette: {
    background: '#fdfbf7',
    foreground: '#33302c',
    surface: '#f3efe7',
    selection: '#e3dcce',
    comment: '#6f6960',
    string: '#2f7d52',
    number: '#a35a17',
    keyword: '#1e5fbf',
    storage: '#7a3fb5',
    function: '#0b6b8f',
    type: '#0f6b5f',
    variable: '#33302c',
    constant: '#b3253c',
    tag: '#1e5fbf',
    attribute: '#0f6b5f',
    punctuation: '#635e58',
    operator: '#8a4a12',
  },
})
