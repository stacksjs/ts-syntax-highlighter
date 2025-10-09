import type { SyntaxHighlighterConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: SyntaxHighlighterConfig = {
  verbose: true,
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: SyntaxHighlighterConfig = await loadConfig({
  name: 'syntax',
  defaultConfig,
})
