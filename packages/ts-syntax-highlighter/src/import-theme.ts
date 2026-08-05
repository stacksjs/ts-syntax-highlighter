import type { Theme, ThemeColors, TokenColor } from './types'

/**
 * Reading a VS Code, TextMate or Shiki theme.
 *
 * `export-textmate.ts` goes the other way, and this is the higher-value
 * direction by a long way: it makes every theme anybody has ever published work
 * here, with no grammar work at all. A theme is a colour map plus a list of
 * scope rules, and this library already tokenizes into TextMate scopes - so the
 * only thing standing between a published theme and this renderer is the file
 * being read tolerantly.
 *
 * Tolerantly is the operative word. These files are hand-written by thousands
 * of people over fifteen years, and the format has drifted:
 *
 * - `scope` is sometimes an array, sometimes one string, and sometimes a
 *   comma-separated list in one string.
 * - Very old themes, converted from `.tmTheme`, put everything in a `settings`
 *   array instead of `tokenColors`, and give the editor's own colours as the
 *   first entry with no scope at all.
 * - `type` is often missing, and has to be inferred from the background.
 * - Colours come as `#rgb`, `#rrggbb`, `#rrggbbaa`, and occasionally with no
 *   `#` at all.
 * - `include` names another theme to inherit from, which cannot be resolved
 *   without a filesystem, so the caller supplies it if they want it.
 *
 * A theme that cannot be read at all throws. A theme with *parts* that cannot
 * be read drops those parts and keeps the rest, because a colour scheme missing
 * one scope rule is a working colour scheme and a thrown error is a blank page.
 */

/** A theme file as published, before anything has been checked. */
export interface RawTheme {
  name?: string
  type?: string
  include?: string
  colors?: Record<string, unknown>
  tokenColors?: unknown
  /** Old `.tmTheme` conversions put everything here instead. */
  settings?: unknown
  [key: string]: unknown
}

export interface ImportThemeOptions {
  /**
   * Resolve an `include`, if the caller has a way to.
   *
   * Called with whatever the file says, which is a path relative to the theme
   * being read. This module has no filesystem and no opinion about where themes
   * live, so a caller that wants inheritance passes a reader.
   */
  resolveInclude?: (reference: string) => RawTheme | null
  /** Used when the file has no name of its own. */
  fallbackName?: string
}

/**
 * Normalise one colour.
 *
 * Returns null rather than a guess for anything unrecognised, so a mistyped
 * colour is dropped and the theme's default shows through instead of the token
 * rendering in whatever `#zzz` computes to, which is transparent black.
 */
export function normalizeColor(value: unknown): string | null {
  if (typeof value !== 'string')
    return null

  const trimmed = value.trim()
  if (trimmed === '')
    return null

  const hex = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  if (!/^[0-9a-f]+$/i.test(hex))
    return null

  // `#rgb` and `#rgba` are shorthand for doubled digits.
  if (hex.length === 3 || hex.length === 4)
    return `#${[...hex].map(digit => digit + digit).join('').toLowerCase()}`

  if (hex.length === 6 || hex.length === 8)
    return `#${hex.toLowerCase()}`

  return null
}

/**
 * How light a colour is, 0 to 1.
 *
 * Used only to guess whether a theme is light or dark when it does not say.
 * The coefficients are the usual perceptual weights: green carries most of the
 * apparent brightness, blue almost none, which is why a saturated blue
 * background is a dark theme and a saturated yellow one is not.
 */
export function relativeLuminance(color: string): number {
  const hex = normalizeColor(color)
  if (hex == null)
    return 0

  const red = Number.parseInt(hex.slice(1, 3), 16) / 255
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** Every scope a rule applies to, however the file spelled them. */
export function normalizeScopes(scope: unknown): string[] {
  if (typeof scope === 'string') {
    // A comma-separated list in one string is legal and common.
    return scope.split(',').map(entry => entry.trim()).filter(Boolean)
  }

  if (Array.isArray(scope))
    return scope.flatMap(entry => normalizeScopes(entry))

  return []
}

/** `italic bold underline` in any order, kept only if it is one of those. */
function normalizeFontStyle(value: unknown): string | undefined {
  if (typeof value !== 'string')
    return undefined

  const styles = value.toLowerCase().split(/\s+/)
    .filter(style => style === 'italic' || style === 'bold' || style === 'underline' || style === 'strikethrough')

  return styles.length > 0 ? styles.join(' ') : undefined
}

/** One scope rule, or null when there is nothing usable in it. */
function importTokenColor(entry: unknown): TokenColor | null {
  if (entry === null || typeof entry !== 'object')
    return null

  const raw = entry as Record<string, unknown>
  const settings = raw.settings
  if (settings === null || typeof settings !== 'object')
    return null

  const scope = normalizeScopes(raw.scope)
  if (scope.length === 0)
    return null

  const values = settings as Record<string, unknown>
  const foreground = normalizeColor(values.foreground)
  const background = normalizeColor(values.background)
  const fontStyle = normalizeFontStyle(values.fontStyle)

  // A rule that sets nothing is not a rule. Keeping it would mean the renderer
  // matched a scope and then had nothing to say about it, which is slower than
  // not matching and identical to look at.
  if (foreground == null && background == null && fontStyle == null)
    return null

  return {
    name: typeof raw.name === 'string' ? raw.name : undefined,
    scope,
    settings: {
      ...(foreground == null ? {} : { foreground }),
      ...(background == null ? {} : { background }),
      ...(fontStyle == null ? {} : { fontStyle }),
    },
  }
}

/**
 * The editor colours out of an old `.tmTheme` conversion.
 *
 * Those files have one `settings` array where the first entry has no scope and
 * carries the editor's own foreground and background. Read as a scope rule it
 * matches nothing; read as nothing at all, the theme has no background.
 */
function legacyEditorColors(entries: unknown[]): Partial<ThemeColors> {
  for (const entry of entries) {
    if (entry === null || typeof entry !== 'object')
      continue

    const raw = entry as Record<string, unknown>
    if (raw.scope !== undefined)
      continue

    const settings = raw.settings
    if (settings === null || typeof settings !== 'object')
      continue

    const values = settings as Record<string, unknown>
    const background = normalizeColor(values.background)
    const foreground = normalizeColor(values.foreground)
    const selection = normalizeColor(values.selection)
    const lineHighlight = normalizeColor(values.lineHighlight)

    return {
      ...(background == null ? {} : { 'editor.background': background }),
      ...(foreground == null ? {} : { 'editor.foreground': foreground }),
      ...(selection == null ? {} : { 'editor.selectionBackground': selection }),
      ...(lineHighlight == null ? {} : { 'editor.lineHighlightBackground': lineHighlight }),
    }
  }

  return {}
}

/** Read a published theme into the shape this library renders from. */
export function importTheme(raw: RawTheme, options: ImportThemeOptions = {}): Theme {
  if (raw === null || typeof raw !== 'object')
    throw new TypeError('A theme must be an object')

  const included = typeof raw.include === 'string' && options.resolveInclude
    ? options.resolveInclude(raw.include)
    : null

  // The including file wins on every key, which is what `include` means.
  const base = included == null ? null : importTheme(included, options)

  const colors: ThemeColors = {
    'editor.background': base?.colors['editor.background'] ?? '#ffffff',
    'editor.foreground': base?.colors['editor.foreground'] ?? '#000000',
    ...(base?.colors ?? {}),
  }

  const legacyEntries = Array.isArray(raw.settings) ? raw.settings : []
  for (const [key, value] of Object.entries(legacyEditorColors(legacyEntries)))
    colors[key] = value as string

  for (const [key, value] of Object.entries(raw.colors ?? {})) {
    const color = normalizeColor(value)
    if (color != null)
      colors[key] = color
  }

  const entries = Array.isArray(raw.tokenColors)
    ? raw.tokenColors
    : legacyEntries

  const tokenColors: TokenColor[] = [
    ...(base?.tokenColors ?? []),
    ...entries.map(entry => importTokenColor(entry)).filter((entry): entry is TokenColor => entry != null),
  ]

  const declaredType = typeof raw.type === 'string' ? raw.type.toLowerCase() : ''
  const type: Theme['type'] = declaredType === 'dark' || declaredType === 'light'
    ? declaredType
    // Not stated, so it is whatever the background says. Half of the themes on
    // the marketplace do not set it.
    : (relativeLuminance(colors['editor.background']) < 0.5 ? 'dark' : 'light')

  return {
    name: typeof raw.name === 'string' && raw.name !== ''
      ? raw.name
      : (options.fallbackName ?? base?.name ?? 'Imported theme'),
    type,
    colors,
    tokenColors,
  }
}

/** Read a theme from the JSON text of a published file. */
export function importThemeFromJson(json: string, options: ImportThemeOptions = {}): Theme {
  let parsed: unknown

  try {
    parsed = JSON.parse(stripJsonComments(json))
  }
  catch (error) {
    throw new TypeError(`That is not a readable theme: ${error instanceof Error ? error.message : 'unparseable'}`)
  }

  return importTheme(parsed as RawTheme, options)
}

/**
 * Remove `//` and block comments and trailing commas.
 *
 * VS Code reads its own theme files as JSONC, so a great many published themes
 * have comments in them and are not valid JSON. Refusing those would refuse
 * exactly the themes somebody hand-wrote and cared about.
 */
export function stripJsonComments(text: string): string {
  let out = ''
  let index = 0
  let inString = false
  let escaped = false

  while (index < text.length) {
    const character = text[index]!

    if (inString) {
      out += character
      if (escaped)
        escaped = false
      else if (character === '\\')
        escaped = true
      else if (character === '"')
        inString = false

      index += 1
      continue
    }

    if (character === '"') {
      inString = true
      out += character
      index += 1
      continue
    }

    if (character === '/' && text[index + 1] === '/') {
      const end = text.indexOf('\n', index)
      index = end < 0 ? text.length : end
      continue
    }

    if (character === '/' && text[index + 1] === '*') {
      const end = text.indexOf('*/', index + 2)
      index = end < 0 ? text.length : end + 2
      continue
    }

    out += character
    index += 1
  }

  // A trailing comma before a closing brace or bracket, which JSONC allows.
  return out.replace(/,(\s*[}\]])/g, '$1')
}

/**
 * The colours the interface around the code should use.
 *
 * A themed page where only the code pane is themed reads as a code pane pasted
 * into an application. These are the five values that make the rest of the page
 * belong to the same surface, taken from the theme where it says and derived
 * from the background where it does not - so every imported theme yields a
 * complete set rather than a set with holes the caller has to fill.
 */
export interface ThemeChrome {
  background: string
  foreground: string
  /** A surface slightly off the background: panels, gutters, headers. */
  surface: string
  border: string
  muted: string
  selection: string
}

export function themeChrome(theme: Theme): ThemeChrome {
  const background = normalizeColor(theme.colors['editor.background']) ?? '#ffffff'
  const foreground = normalizeColor(theme.colors['editor.foreground']) ?? '#000000'
  const dark = theme.type === 'dark'

  const pick = (...keys: string[]): string | null => {
    for (const key of keys) {
      const color = normalizeColor(theme.colors[key])
      if (color != null)
        return color
    }
    return null
  }

  return {
    background,
    foreground,
    surface: pick('editorGroupHeader.tabsBackground', 'sideBar.background', 'editor.lineHighlightBackground')
      ?? shade(background, dark ? 0.06 : -0.03),
    border: pick('editorGroup.border', 'panel.border', 'contrastBorder')
      ?? shade(background, dark ? 0.14 : -0.1),
    muted: pick('editorLineNumber.foreground', 'descriptionForeground')
      ?? mix(foreground, background, 0.45),
    selection: pick('editor.selectionBackground') ?? shade(background, dark ? 0.2 : -0.12),
  }
}

/** Move a colour towards white (positive) or black (negative). */
function shade(color: string, amount: number): string {
  const hex = normalizeColor(color) ?? '#000000'
  const channel = (at: number) => {
    const value = Number.parseInt(hex.slice(at, at + 2), 16)
    const moved = amount >= 0 ? value + (255 - value) * amount : value * (1 + amount)
    return Math.max(0, Math.min(255, Math.round(moved)))
  }

  return toHex(channel(1), channel(3), channel(5))
}

/** Blend two colours, `weight` being how much of the second one to use. */
function mix(a: string, b: string, weight: number): string {
  const first = normalizeColor(a) ?? '#000000'
  const second = normalizeColor(b) ?? '#ffffff'
  const channel = (at: number) => Math.round(
    Number.parseInt(first.slice(at, at + 2), 16) * (1 - weight)
    + Number.parseInt(second.slice(at, at + 2), 16) * weight,
  )

  return toHex(channel(1), channel(3), channel(5))
}

function toHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue].map(value => value.toString(16).padStart(2, '0')).join('')}`
}
