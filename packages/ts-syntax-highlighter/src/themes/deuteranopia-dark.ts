import type { Theme } from '../types'
import { defineTheme } from './palette'

export const deuteranopiaDark: Theme = defineTheme({
  name: 'Deuteranopia Dark',
  type: 'dark',
  description: 'Red-green safe: every role separated on the blue-to-amber axis, which survives protanopia and deuteranopia.',
  palette: {
    background: '#12141a',
    foreground: '#d3d8e0',
    surface: '#1a1d26',
    selection: '#2a3040',
    comment: '#8b94a5',
    string: '#f0b429',
    number: '#e08b2e',
    keyword: '#58a6ff',
    storage: '#b0c9ff',
    function: '#ffd98a',
    type: '#79c0ff',
    variable: '#d3d8e0',
    constant: '#c9760f',
    tag: '#58a6ff',
    attribute: '#8fb8ff',
    punctuation: '#9aa3b2',
    operator: '#ffd98a',
  },
})
