import type { SyntaxHighlighterConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: SyntaxHighlighterConfig = {
  verbose: false,
  theme: 'github-dark',
  defaultLanguage: 'javascript',
  cache: true,
  plugins: [],
}

// Lazy-loaded config to avoid top-level await (enables bun --compile)
let _config: SyntaxHighlighterConfig | null = null

export async function getConfig(): Promise<SyntaxHighlighterConfig> {
  if (!_config) {
    _config = await loadConfig({
      name: 'syntax',
      defaultConfig,
    })
  }
  return _config
}

// For backwards compatibility - synchronous access with default fallback
export const config: SyntaxHighlighterConfig = defaultConfig

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
