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
  /**
   * Whether the tokenizer's root-level character fast paths may run.
   *
   * On by default, and right for every source language: at the top level of C
   * or TypeScript, a digit begins a number, a backtick begins a template, `//`
   * begins a comment, and a bracket is punctuation with no further meaning. The
   * fast paths answer those without touching the pattern list, which is most of
   * why this tokenizer is quick.
   *
   * Markup languages invert that. In markdown a digit begins an ordered list, a
   * backtick begins a code span, a bracket begins a link, and `//` is the middle
   * of a URL - so the fast paths answer first and answer wrongly, and the
   * grammar's own patterns never get to run. Set this false and the patterns
   * come first.
   */
  fastPaths?: boolean
  /**
   * Words the identifier fast path must not answer alone, decided by the one
   * character that follows them.
   *
   * The fast path reads a word, asks the keyword table about it, asks whether a
   * `(` comes next, and otherwise calls it plain text. That is right for a
   * language whose identifiers mean nothing until they are used, and wrong for
   * two shapes that are common enough to matter: `println!` in Rust is a macro
   * and `name:` in YAML is a key, and in both the word is ordinary and the
   * character after it carries the whole meaning. A grammar pattern cannot say
   * so, because the fast path has already answered and returned.
   *
   * So a grammar declares the suffix instead. It stays O(1) - one character
   * read, one map lookup - which is the property the fast path exists for; a
   * grammar that declares none pays a single undefined check.
   */
  wordSuffixes?: WordSuffixRule[]
  /**
   * The characters the string fast path may treat as opening a string.
   *
   * Defaults to `"`, `'` and a backtick, which is right for most languages and
   * wrong for the ones where a single quote means something else. In Rust `'a`
   * is a lifetime and `'a'` is a char literal, and the fast path read the first
   * of those as a string running to the next quote several tokens away - so
   * every lifetime in the language was swallowed along with the code beside it.
   *
   * Narrowing this hands those characters back to the grammar's own patterns,
   * which is where a language with its own rule about them wants them.
   */
  stringQuotes?: string
  /**
   * Punctuation characters this grammar's own patterns must be asked about.
   *
   * `{ } ( ) [ ] ; ,` are punctuation in every language and the fast path
   * answers them without consulting a pattern, which is right nearly always and
   * wrong where a language gives one of them a meaning. C# opens an attribute
   * with `[`, so `[Serializable]` came back as three plain tokens while the
   * `attributes` rule sat in the grammar unreachable.
   *
   * Named as exceptions rather than as a whole set, because the whole set is
   * what the fast path is for: CSS spends most of its bytes on `{`, `}`, `;`
   * and `,`, and handing those to the pattern loop costs a fifth of its
   * throughput to answer them the same way.
   */
  reservedPunctuation?: string
}

/**
 * A word renamed by the character after it. See `Grammar.wordSuffixes`.
 */
export interface WordSuffixRule {
  /** The single character that must directly follow the word, with no space. */
  follows: string
  /** The scope the word takes when it does. */
  scope: string
  /**
   * Characters that cancel the rule when they come after `follows`.
   *
   * `a != b` is not a macro call and `http://x` is not a key, and both are the
   * same mistake: the suffix character is real and belongs to something longer.
   */
  unless?: string
  /** Whether the suffix character joins the word rather than standing alone. */
  consume?: boolean
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
  /**
   * What this theme is for, in one line.
   *
   * A theme picker with ten entries needs to say more than ten names, and the
   * colour-vision-deficiency variants need it most: "Deuteranopia Dark" tells a
   * reader nothing about whether it is the one they want.
   */
  description?: string
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

/**
 * A language listed without its grammar attached.
 *
 * The point of the split: answering "what language is `src/main.rs`" needs the
 * extension table and nothing else, and a browser bundle should not carry forty
 * eight grammars to answer it. `load()` fetches exactly the one that was asked
 * for, and `resolveGrammar` in `lazy.ts` caches the result.
 */
export interface LanguageDescriptor {
  id: string
  name: string
  aliases: string[]
  extensions: string[]
  /** The grammar's own scope name, needed before the grammar is loaded. */
  scopeName: string
  load: () => Promise<Grammar>
}

/**
 * Where a tokenizer is, part way through a document.
 *
 * Serializable on purpose. Two things depend on that: tokenizing in a worker,
 * which has to post the state across a boundary that cannot carry a RegExp or a
 * reference into a grammar; and tokenizing a diff hunk, which starts at line
 * four hundred of a file and would otherwise have no idea whether line four
 * hundred is inside a block comment.
 *
 * Restoring a state into a different grammar is refused rather than producing
 * confidently wrong output, which is why `scopeName` is carried.
 */
export interface TokenizerState {
  /** The grammar this state came from. */
  scopeName: string
  frames: TokenizerStateFrame[]
}

export interface TokenizerStateFrame {
  scopes: string[]
  /**
   * Which pattern opened this frame, as its position in the grammar.
   *
   * A path of indices (`"3.1.0"`) rather than a reference, since the state has
   * to survive `JSON.stringify`. Null for the root frame, which no pattern
   * opened, and for a frame the tokenizer opened itself.
   */
  pattern: string | null
  /** Everything up to the closing marker is content rather than code. */
  raw?: boolean
  /** The closing marker, as a regular expression source. */
  end?: string
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
