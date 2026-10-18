import type { SyntaxHighlighterConfig } from './types'

export const defaultConfig: SyntaxHighlighterConfig = {
  verbose: false,
  theme: 'github-dark',
  defaultLanguage: 'javascript',
  cache: true,
  plugins: [],
}

// Lazy-loaded config to avoid top-level await (enables bun --compile)
let _config: SyntaxHighlighterConfig | null = null

export async function loadSyntaxHighlighterConfig(): Promise<SyntaxHighlighterConfig> {
  if (!_config) {
    // `bunfig` reads config files from disk and is Node/Bun-only, so it is
    // imported dynamically here rather than at module scope. A static
    // top-level import would drag its own eager, unguarded `process.env`
    // access into every consumer's bundle purely by importing this
    // package's index, crashing immediately in a browser even for callers
    // who never touch config loading.
    const { loadConfig } = await import('bunfig')
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
