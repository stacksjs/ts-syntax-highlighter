import type { Theme } from '../types'
import { defineTheme } from './palette'

export const paper: Theme = defineTheme({
  name: 'Paper',
  type: 'light',
  description: 'Ink on white, the highest-contrast light theme here.',
  palette: {
    background: '#ffffff',
    foreground: '#1a1a1a',
    surface: '#f2f2f2',
    selection: '#d9e5f2',
    comment: '#5f5f5f',
    string: '#0a6b2f',
    number: '#8a3d00',
    keyword: '#0033b3',
    storage: '#6a1b9a',
    function: '#00548a',
    type: '#005f56',
    variable: '#1a1a1a',
    constant: '#a3001b',
    tag: '#0033b3',
    attribute: '#005f56',
    punctuation: '#4a4a4a',
    operator: '#8a3d00',
  },
})
