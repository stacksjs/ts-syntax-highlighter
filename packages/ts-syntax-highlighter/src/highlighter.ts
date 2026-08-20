import type {
  CacheEntry,
  FastTokenLine,
  Highlighter as IHighlighter,
  Language,
  Plugin,
  RenderedCode,
  RenderOptions,
  SyntaxHighlighterConfig,
  Theme,
} from './types'
import { FastTokenizer } from './fast-tokenizer'
import { getLanguage, languages } from './grammars'
import { Renderer } from './renderer'
import { getTheme, themes } from './themes'
import { Tokenizer } from './tokenizer'

export class Highlighter implements IHighlighter {
  private config: SyntaxHighlighterConfig
  private languages: Map<string, Language> = new Map()
  private themes: Map<string, Theme> = new Map()
  private cache: Map<string, CacheEntry> = new Map()
  /** Theme name to the theme it names, so the lookup runs once per name. */
  private resolvedThemes: Map<string, Theme> = new Map()
  /**
   * One renderer per theme, rather than one per call.
   *
   * A `Renderer` holds the theme's colour lookup, and building it per
   * `highlight` call rebuilt that lookup for every snippet on a page. Keyed by
   * the theme object, so a caller passing a theme inline gets a renderer per
   * distinct theme rather than one that never matches.
   */
  private renderers: WeakMap<Theme, Renderer> = new WeakMap()
  private plugins: Plugin[] = []

  constructor(config: SyntaxHighlighterConfig) {
    this.config = config
    this.initializeDefaults()
  }

  /**
   * Initialize default languages and themes
   */
  private initializeDefaults(): void {
    /*
     * The built-in languages and themes are **not** copied in here.
     *
     * They used to be: every construction walked all forty-eight grammars and
     * every theme, inserting each under its id and each of its aliases. That is
     * a few hundred map writes per highlighter, and worse, it pulled the whole
     * catalogue into memory to answer questions most callers never ask - a
     * worker that highlights TypeScript loaded Fortran to do it.
     *
     * `getLanguageById` and `resolveTheme` already fall back to the catalogue
     * lookups, so the maps are needed only for what a *plugin* registers. What
     * they hold now is the difference between this instance and the defaults,
     * which is also what makes `loadTheme` and `loadPlugin` meaningful rather
     * than redundant.
     */

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
   * Highlight code (synchronous, faster for basic use cases)
   */
  highlightSync(code: string, lang: string, options: RenderOptions = {}): RenderedCode {
    const language = this.getLanguageById(lang)
    if (!language) {
      throw new Error(`Language "${lang}" not found. Available languages: ${this.getSupportedLanguages().join(', ')}`)
    }

    // Check cache
    const cacheKey = this.getCacheKey(code, lang, options)
    if (this.config.cache) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        return this.rendererFor(this.resolveTheme(options.theme)).render(cached.tokens, options)
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
    return this.rendererFor(this.resolveTheme(options.theme)).render(tokens, options)
  }

  /**
   * Highlight code (async wrapper for compatibility)
   */
  async highlight(code: string, lang: string, options: RenderOptions = {}): Promise<RenderedCode> {
    return this.highlightSync(code, lang, options)
  }

  /**
   * Ultra-fast highlighting (minimal overhead, no scopes/themes)
   * Use this when you need highlight.js-level performance and don't need advanced features
   * Returns minimal token info: just type and content
   */
  highlightFast(code: string, lang: string): FastTokenLine[] {
    const language = this.getLanguageById(lang)
    if (!language) {
      throw new Error(`Language "${lang}" not found. Available languages: ${this.getSupportedLanguages().join(', ')}`)
    }

    const tokenizer = new FastTokenizer(language.grammar)
    return tokenizer.tokenize(code)
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
    // A name may now resolve differently, so what was resolved before it is no
    // longer an answer this instance may reuse.
    this.resolvedThemes.clear()
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    // The built-ins plus whatever a plugin added. Read from the catalogue
    // rather than from the map, because the map no longer mirrors it.
    const unique = new Set<string>(languages.map(language => language.id))

    for (const [key, language] of this.languages.entries()) {
      if (key === language.id)
        unique.add(language.id)
    }

    return Array.from(unique)
  }

  /**
   * Get supported themes
   */
  getSupportedThemes(): string[] {
    return Array.from(new Set([
      ...themes.map(theme => theme.name.toLowerCase()),
      ...this.themes.keys(),
    ]))
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
      // Resolved once per name. Every `highlight` call asks for this, and the
      // answer cannot change for a name the instance already knows: a theme is
      // registered by `loadTheme`, which clears this.
      const resolved = this.resolvedThemes.get(themeOption)

      if (resolved)
        return resolved

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

      this.resolvedThemes.set(themeOption, theme)

      return theme
    }

    return themeOption
  }

  /** The renderer for a theme, built once. */
  private rendererFor(theme: Theme): Renderer {
    const held = this.renderers.get(theme)

    if (held)
      return held

    const renderer = new Renderer(theme)
    this.renderers.set(theme, renderer)

    return renderer
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
