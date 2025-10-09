import type { Language } from '../types'
import { cssGrammar } from './css'
import { htmlGrammar } from './html'
import { javascriptGrammar } from './javascript'
import { jsonGrammar } from './json'
import { stxGrammar } from './stx'
import { typescriptGrammar } from './typescript'

export const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    aliases: ['js', 'jsx'],
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    grammar: javascriptGrammar,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    aliases: ['ts', 'tsx'],
    extensions: ['.ts', '.tsx', '.mts', '.cts'],
    grammar: typescriptGrammar,
  },
  {
    id: 'html',
    name: 'HTML',
    aliases: ['htm'],
    extensions: ['.html', '.htm'],
    grammar: htmlGrammar,
  },
  {
    id: 'css',
    name: 'CSS',
    aliases: [],
    extensions: ['.css'],
    grammar: cssGrammar,
  },
  {
    id: 'json',
    name: 'JSON',
    aliases: [],
    extensions: ['.json', '.jsonc'],
    grammar: jsonGrammar,
  },
  {
    id: 'stx',
    name: 'STX',
    aliases: [],
    extensions: ['.stx'],
    grammar: stxGrammar,
  },
]

export function getLanguage(id: string): Language | undefined {
  return languages.find(
    lang =>
      lang.id === id
      || lang.aliases?.includes(id)
      || lang.extensions?.includes(`.${id}`)
      || lang.extensions?.includes(id),
  )
}

export function getLanguageByExtension(ext: string): Language | undefined {
  const extension = ext.startsWith('.') ? ext : `.${ext}`
  return languages.find(lang => lang.extensions?.includes(extension))
}

export * from './javascript'
export * from './typescript'
export * from './html'
export * from './css'
export * from './json'
export * from './stx'
