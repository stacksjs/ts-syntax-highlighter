import type {
  CacheEntry,
  Highlighter as IHighlighter,
  Language,
  Plugin,
  RenderedCode,
  RenderOptions,
  SyntaxHighlighterConfig,
  Theme,
  TokenLine,
} from './types'
import { getLanguage, languages } from './grammars'
import { Renderer } from './renderer'
import { getTheme, themes } from './themes'
import { Tokenizer } from './tokenizer'

export class Highlighter implements IHighlighter {
  private config: SyntaxHighlighterConfig
  private languages: Map<string, Language> = new Map()
  private themes: Map<string, Theme> = new Map()
  private cache: Map<string, CacheEntry> = new Map()
  private plugins: Plugin[] = []

  constructor(config: SyntaxHighlighterConfig) {
    this.config = config
    this.initializeDefaults()
  }

  /**
   * Initialize default languages and themes
   */
  private initializeDefaults(): void {
    // Load default languages
    for (const lang of languages) {
      this.languages.set(lang.id, lang)
      if (lang.aliases) {
        for (const alias of lang.aliases) {
          this.languages.set(alias, lang)
        }
      }
    }

    // Load default themes
    for (const theme of themes) {
      this.themes.set(theme.name.toLowerCase(), theme)
    }

    // Load plugins
    if (this.config.plugins) {
      for (const plugin of this.config.plugins) {
        this.loadPlugin(plugin)
      }
    }
  }

  /**
   * Load a plugin
   */
  private async loadPlugin(plugin: Plugin): Promise<void> {
    this.plugins.push(plugin)

    // Load plugin languages
    if (plugin.languages) {
      for (const lang of plugin.languages) {
        await this.loadLanguage(lang)
      }
    }

    // Load plugin themes
    if (plugin.themes) {
      for (const theme of plugin.themes) {
        await this.loadTheme(theme)
      }
    }
  }

  /**
   * Highlight code
   */
  async highlight(code: string, lang: string, options: RenderOptions = {}): Promise<RenderedCode> {
    const language = this.getLanguageById(lang)
    if (!language) {
      throw new Error(`Language "${lang}" not found. Available languages: ${this.getSupportedLanguages().join(', ')}`)
    }

    // Check cache
    const cacheKey = this.getCacheKey(code, lang, options)
    if (this.config.cache) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        const theme = this.resolveTheme(options.theme)
        const renderer = new Renderer(theme)
        return renderer.render(cached.tokens, options)
      }
    }

    // Tokenize
    const tokenizer = new Tokenizer(language.grammar)
    let tokens = tokenizer.tokenize(code)

    // Apply transformers from plugins
    for (const plugin of this.plugins) {
      if (plugin.transformers) {
        for (const transformer of plugin.transformers) {
          tokens = transformer.transform(tokens)
        }
      }
    }

    // Cache tokens
    if (this.config.cache) {
      this.cache.set(cacheKey, {
        tokens,
        timestamp: Date.now(),
        hash: cacheKey,
      })
    }

    // Render
    const theme = this.resolveTheme(options.theme)
    const renderer = new Renderer(theme)

    return renderer.render(tokens, options)
  }

  /**
   * Load a language
   */
  async loadLanguage(language: Language): Promise<void> {
    this.languages.set(language.id, language)
    if (language.aliases) {
      for (const alias of language.aliases) {
        this.languages.set(alias, language)
      }
    }
  }

  /**
   * Load a theme
   */
  async loadTheme(theme: Theme): Promise<void> {
    this.themes.set(theme.name.toLowerCase(), theme)
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    const uniqueLanguages = new Set<string>()
    for (const [key, lang] of this.languages.entries()) {
      if (key === lang.id) {
        uniqueLanguages.add(lang.id)
      }
    }
    return Array.from(uniqueLanguages)
  }

  /**
   * Get supported themes
   */
  getSupportedThemes(): string[] {
    return Array.from(this.themes.keys())
  }

  /**
   * Get language by ID or alias
   */
  private getLanguageById(id: string): Language | undefined {
    return this.languages.get(id) || getLanguage(id)
  }

  /**
   * Resolve theme from string or Theme object
   */
  private resolveTheme(themeOption?: string | Theme): Theme {
    if (!themeOption) {
      return this.resolveTheme(this.config.theme)
    }

    if (typeof themeOption === 'string') {
      // Try exact match first
      let theme = this.themes.get(themeOption.toLowerCase())

      // If not found, try with space-separated format (e.g., "github-dark" -> "github dark")
      if (!theme) {
        const spaceFormat = themeOption.replace(/-/g, ' ')
        theme = this.themes.get(spaceFormat.toLowerCase())
      }

      // Fallback to getTheme helper
      if (!theme) {
        theme = getTheme(themeOption)
      }

      if (!theme) {
        throw new Error(`Theme "${themeOption}" not found. Available themes: ${this.getSupportedThemes().join(', ')}`)
      }
      return theme
    }

    return themeOption
  }

  /**
   * Generate cache key
   */
  private getCacheKey(code: string, lang: string, options: RenderOptions): string {
    const optionsStr = JSON.stringify(options)
    return `${lang}:${this.hashCode(code + optionsStr)}`
  }

  /**
   * Simple hash function for cache keys
   */
  private hashCode(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(36)
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }
}

/**
 * Create a new highlighter instance
 */
export async function createHighlighter(
  config: Partial<SyntaxHighlighterConfig> = {},
): Promise<Highlighter> {
  const defaultConfig: SyntaxHighlighterConfig = {
    verbose: false,
    theme: 'github-dark',
    cache: true,
    plugins: [],
  }

  const mergedConfig = { ...defaultConfig, ...config }
  return new Highlighter(mergedConfig)
}
