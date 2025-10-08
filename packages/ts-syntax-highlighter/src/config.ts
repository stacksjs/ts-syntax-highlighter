import type { SyntaxHighlighterConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: SyntaxHighlighterConfig = {
  verbose: false,
  theme: 'github-dark',
  defaultLanguage: 'javascript',
  cache: true,
  plugins: [],
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: SyntaxHighlighterConfig = await loadConfig({
  name: 'syntax',
  defaultConfig,
})

/**
 * Get a specific config value
 */
export function getConfig<K extends keyof SyntaxHighlighterConfig>(
  key: K,
): SyntaxHighlighterConfig[K] {
  return config[key]
}

/**
 * Check if verbose mode is enabled
 */
export function isVerbose(): boolean {
  return config.verbose
}
