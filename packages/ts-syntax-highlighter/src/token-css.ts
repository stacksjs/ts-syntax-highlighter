/**
 * Token colours as CSS, keyed on what a token *is*.
 *
 * The renderer writes each colour into a `style` attribute, which is the right
 * answer for a string of HTML handed to somebody else and the wrong one for
 * anything live: an editor repaints a line on every keystroke and wants to
 * write `<span class="tok-keyword">`, a page wants to switch between a light
 * and a dark palette with a media query, and neither can do that against a
 * colour that is already inline.
 *
 * So this is the other half: the fourteen classes `classifyScope` produces,
 * and for a theme, the colour each of them gets. A consumer writes the class,
 * and ships either the rules or the custom properties this builds.
 */

import type { Theme, TokenSettings } from './types'

/**
 * The classes a stylesheet can colour, with the scope each stands for.
 *
 * The scope is what the theme is asked about: a theme does not know what a
 * `numeric` is, but it does know `constant.numeric`.
 */
export const TOKEN_CLASS_SCOPES: Readonly<Record<string, string>> = {
  keyword: 'keyword.control',
  string: 'string.quoted',
  comment: 'comment.line',
  numeric: 'constant.numeric',
  constant: 'constant.language',
  function: 'entity.name.function',
  operator: 'keyword.operator',
  punctuation: 'punctuation',
  type: 'entity.name.type',
  variable: 'variable.other',
  tag: 'entity.name.tag',
  attribute: 'entity.other.attribute-name',
}

/** Every class `tokenClass` can answer with, in a stable order. */
export const TOKEN_CLASSES: readonly string[] = Object.keys(TOKEN_CLASS_SCOPES)

/**
 * The tokenizer's own names for the shapes it recognises on a fast path, which
 * are more specific than a stylesheet wants: a line comment and a block comment
 * are the same colour, and so are the three kinds of string.
 */
const ALIASES: Readonly<Record<string, string>> = {
  line: 'comment',
  block: 'comment',
  double: 'string',
  single: 'string',
  template: 'string',
  number: 'numeric',
}

/**
 * The class to put on a token, or an empty string for one that needs none.
 *
 * Ordinary text and whitespace answer empty, on purpose. They are most of a
 * file, and a consumer that skips the wrapper for them writes roughly half the
 * elements it otherwise would - which in an editor is the difference between a
 * line that repaints inside a frame and one that does not.
 *
 * @example
 * tokenClass('line') // 'comment'
 * tokenClass('keyword') // 'keyword'
 * tokenClass('text') // ''
 */
export function tokenClass(type: string): string {
  const resolved = ALIASES[type] ?? type
  return resolved in TOKEN_CLASS_SCOPES ? resolved : ''
}

function scopeMatches(tokenScope: string, themeScope: string): boolean {
  return tokenScope === themeScope || tokenScope.startsWith(`${themeScope}.`)
}

/**
 * What a theme says about one scope: the longest theme scope that covers it.
 *
 * The same rule the renderer applies, kept separate from it so that asking a
 * theme a question does not need a renderer, or the tokens of a document.
 */
export function resolveThemeScope(theme: Theme, scope: string): TokenSettings {
  let best: TokenSettings = {}
  let bestScore = 0

  for (const tokenColor of theme.tokenColors) {
    const scopes = Array.isArray(tokenColor.scope) ? tokenColor.scope : [tokenColor.scope]

    for (const candidate of scopes) {
      if (!scopeMatches(scope, candidate))
        continue

      const score = candidate.split('.').length
      if (score > bestScore) {
        best = tokenColor.settings
        bestScore = score
      }
    }
  }

  return best
}

/** The colour and font style a theme gives each token class. */
export function themeTokenColors(theme: Theme): Record<string, TokenSettings> {
  const colors: Record<string, TokenSettings> = {}

  for (const name of TOKEN_CLASSES)
    colors[name] = resolveThemeScope(theme, TOKEN_CLASS_SCOPES[name]!)

  return colors
}

export interface TokenCssOptions {
  /** What the rules are scoped under. Default `.syntax`. */
  selector?: string
  /** Prefix of the class on each token. Default `tok-`, so `tok-keyword`. */
  classPrefix?: string
  /** Prefix of the custom properties. Default `--syntax-`. */
  variablePrefix?: string
}

/**
 * A theme as custom properties: `--syntax-keyword: #cf222e`, and so on.
 *
 * Declarations only, with no selector, so the caller decides where they apply -
 * `:root`, a `.dark` ancestor, the inside of a media query. That is what makes
 * two palettes switchable: the rules below read the properties, and only the
 * properties change.
 */
export function themeTokenVariables(theme: Theme, options: TokenCssOptions = {}): string {
  const prefix = options.variablePrefix ?? '--syntax-'
  const colors = themeTokenColors(theme)
  const declarations = [
    `${prefix}background: ${theme.colors['editor.background']};`,
    `${prefix}foreground: ${theme.colors['editor.foreground']};`,
  ]

  const lineHighlight = theme.colors['editor.lineHighlightBackground']
  if (lineHighlight)
    declarations.push(`${prefix}line-highlight: ${lineHighlight};`)

  const selection = theme.colors['editor.selectionBackground']
  if (selection)
    declarations.push(`${prefix}selection: ${selection};`)

  for (const name of TOKEN_CLASSES) {
    const settings = colors[name]!
    if (settings.foreground)
      declarations.push(`${prefix}${name}: ${settings.foreground};`)
  }

  return declarations.join('\n')
}

/**
 * The rules that colour token classes from the custom properties.
 *
 * Theme independent: every colour is a `var()` with the theme's own value as
 * the fallback when a theme is given, and `inherit` when it is not. So the
 * same sheet serves a page that sets the properties itself and one that never
 * heard of them.
 */
export function tokenClassCss(theme?: Theme, options: TokenCssOptions = {}): string {
  const selector = options.selector ?? '.syntax'
  const classPrefix = options.classPrefix ?? 'tok-'
  const variablePrefix = options.variablePrefix ?? '--syntax-'
  const colors = theme ? themeTokenColors(theme) : {}

  return TOKEN_CLASSES.map((name) => {
    const settings = colors[name] ?? {}
    const fallback = settings.foreground ?? 'inherit'
    const declarations = [`color: var(${variablePrefix}${name}, ${fallback});`]

    if (settings.fontStyle?.includes('italic'))
      declarations.push('font-style: italic;')
    if (settings.fontStyle?.includes('bold'))
      declarations.push('font-weight: bold;')
    if (settings.fontStyle?.includes('underline'))
      declarations.push('text-decoration: underline;')

    return `${selector} .${classPrefix}${name} { ${declarations.join(' ')} }`
  }).join('\n')
}

/**
 * Everything a page needs to colour token classes under one theme.
 *
 * The properties on the selector, then the rules. For two palettes, call
 * `themeTokenVariables` for the second and put it wherever the switch is.
 */
export function themeTokenCss(theme: Theme, options: TokenCssOptions = {}): string {
  const selector = options.selector ?? '.syntax'

  return `${selector} {\n${themeTokenVariables(theme, options)}\n}\n${tokenClassCss(theme, options)}`
}
