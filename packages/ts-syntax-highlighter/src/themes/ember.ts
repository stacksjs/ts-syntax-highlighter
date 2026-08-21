import type { Theme } from '../types'
import { defineTheme } from './palette'

export const ember: Theme = defineTheme({
  name: 'Ember',
  type: 'dark',
  description: 'A warm dark theme, amber and salmon with a teal counterweight.',
  palette: {
    background: '#191210',
    foreground: '#e8d9cf',
    surface: '#221917',
    selection: '#3a2823',
    comment: '#9d8378',
    string: '#b8cf7a',
    number: '#f0a05a',
    keyword: '#ff8f6b',
    storage: '#e0987a',
    function: '#ffc36b',
    type: '#7fc3c0',
    variable: '#e8d9cf',
    constant: '#ff8078',
    tag: '#ff8f6b',
    attribute: '#7fc3c0',
    punctuation: '#ab9086',
    operator: '#f0a05a',
  },
})
