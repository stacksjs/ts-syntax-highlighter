// Core Configuration
export interface SyntaxHighlighterConfig {
  verbose: boolean
  theme: string | Theme
  defaultLanguage?: string
  cache?: boolean
  plugins?: Plugin[]
}

export type SyntaxHighlighterOptions = Partial<SyntaxHighlighterConfig>

// Token Types
export interface Token {
  type: string
  content: string
  scopes: string[]
  line: number
  offset: number
  // Advanced features
  dimmed?: boolean
  blurred?: boolean
  highlighted?: boolean
  highlightColor?: string
  emphasized?: boolean
  link?: string
}

export interface TokenLine {
  tokens: Token[]
  line: number
}

// Fast mode tokens (minimal overhead)
export interface FastToken {
  type: string
  content: string
}

export interface FastTokenLine {
  tokens: FastToken[]
}

// Grammar Types
export interface Grammar {
  name: string
  scopeName: string
  patterns: GrammarPattern[]
  repository?: Record<string, GrammarRule>
  injections?: Record<string, GrammarRule>
  keywords?: KeywordTable
}

export interface KeywordTable {
  [keyword: string]: string // keyword -> scope name
}

export interface GrammarPattern {
  match?: string
  begin?: string
  end?: string
  name?: string
  contentName?: string
  captures?: Record<string, { name: string }>
  beginCaptures?: Record<string, { name: string }>
  endCaptures?: Record<string, { name: string }>
  patterns?: GrammarPattern[]
  include?: string
}

export interface GrammarRule {
  name?: string
  match?: string
  begin?: string
  end?: string
  patterns?: GrammarPattern[]
  captures?: Record<string, { name: string }>
  beginCaptures?: Record<string, { name: string }>
  endCaptures?: Record<string, { name: string }>
  contentName?: string
}

// Theme Types
export interface Theme {
  name: string
  type: 'light' | 'dark'
  colors: ThemeColors
  tokenColors: TokenColor[]
}

export interface ThemeColors {
  'editor.background': string
  'editor.foreground': string
  'editor.lineHighlightBackground'?: string
  'editor.selectionBackground'?: string
  [key: string]: string | undefined
}

export interface TokenColor {
  name?: string
  scope: string | string[]
  settings: TokenSettings
}

export interface TokenSettings {
  foreground?: string
  background?: string
  fontStyle?: string
}

// Language Support
export interface Language {
  id: string
  name: string
  aliases?: string[]
  extensions?: string[]
  grammar: Grammar
}

// Renderer Types
export interface RenderOptions {
  lineNumbers?: boolean
  highlightLines?: number[]
  theme?: string | Theme
  lang?: string
  inline?: boolean
  focusLines?: number[]
  dimLines?: number[]
  addedLines?: number[]
  removedLines?: number[]
  annotations?: LineAnnotation[]
  showCopyButton?: boolean
  lineTransformers?: LineTransformer[]
  tokensTransformers?: TokenTransformer[]
}

export interface RenderedCode {
  html: string
  css?: string
  tokens: TokenLine[]
  ansi?: string
}

export interface LineAnnotation {
  line: number
  text: string
  type?: 'info' | 'warning' | 'error' | 'success'
  position?: 'above' | 'below' | 'inline'
}

export interface LineTransformer {
  name: string
  transform: (line: string, lineNumber: number) => string
}

export interface TokenTransformer {
  name: string
  shouldTransform: (token: Token) => boolean
  transform: (token: Token) => Token
}

// Plugin System
export interface Plugin {
  name: string
  languages?: Language[]
  themes?: Theme[]
  transformers?: Transformer[]
  grammars?: Grammar[]
}

export interface Transformer {
  name: string
  transform: (tokens: TokenLine[], options?: any) => TokenLine[]
}

// Highlighter Interface
export interface Highlighter {
  highlight: (code: string, lang: string, options?: RenderOptions) => Promise<RenderedCode>
  loadLanguage: (language: Language) => Promise<void>
  loadTheme: (theme: Theme) => Promise<void>
  getSupportedLanguages: () => string[]
  getSupportedThemes: () => string[]
}

// Cache Types
export interface CacheEntry {
  tokens: TokenLine[]
  timestamp: number
  hash: string
}
