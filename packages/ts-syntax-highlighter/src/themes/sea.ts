import type { Theme } from '../types'
import { defineTheme } from './palette'

export const sea: Theme = defineTheme({
  name: 'Sea',
  type: 'light',
  description: 'A cool light theme, teal and slate, for long sittings.',
  palette: {
    background: '#f7fbfb',
    foreground: '#1f3336',
    surface: '#eaf3f3',
    selection: '#cfe6e6',
    comment: '#57696c',
    string: '#0d6b52',
    number: '#8a4700',
    keyword: '#0a5c8a',
    storage: '#6b3fa0',
    function: '#0d7a8f',
    type: '#0b6b63',
    variable: '#1f3336',
    constant: '#a32040',
    tag: '#0a5c8a',
    attribute: '#0b6b63',
    punctuation: '#4d5f62',
    operator: '#8a4700',
  },
})
