import type { Theme, TokenColor } from '../types'

/**
 * A syntax theme as the twelve colours it actually is.
 *
 * Every theme in this directory maps the same scopes to the same roles, and the
 * three that were written by hand proved it: `nord.ts`, `github-dark.ts` and
 * `github-light.ts` are the same seventeen entries in the same order with
 * different hex values, and the two GitHub ones had already drifted apart in
 * which scopes they covered. A fourth hand-written theme would drift again, and
 * a tenth would guarantee it.
 *
 * So a theme declares its palette and this builds the rest. What is left to
 * choose is the part that is a choice - the colours - and what is shared is the
 * part that is not: which scope is a keyword, and that a comment is italic.
 *
 * The roles are named for what the reader is looking at rather than for a
 * colour, because that is what makes a palette portable: "the colour of a
 * string" survives being rethought and "green" does not.
 */
export interface Palette {
  /** The page behind the code. */
  background: string
  /** Ordinary code with no more specific role. */
  foreground: string
  /** The current line, and any surface sitting on the background. */
  surface: string
  /** Selected text. */
  selection: string
  comment: string
  string: string
  number: string
  keyword: string
  /** `const`, `static`, `public` - the words that modify rather than control. */
  storage: string
  function: string
  /** A class, an interface, a type name. */
  type: string
  variable: string
  /** `true`, `null`, an escape sequence. */
  constant: string
  /** A markup tag, a YAML key. */
  tag: string
  /** A markup attribute, a CSS property. */
  attribute: string
  punctuation: string
  operator: string
}

/**
 * The scope-to-role map every theme in this directory shares.
 *
 * Ordered from most to least specific in the sense that matters here: a later
 * entry with a longer scope wins in the renderer's own resolution, so `keyword`
 * before `keyword.operator` is what lets an operator be its own colour without
 * repeating every keyword scope.
 */
const ROLES: Array<{ name: string, scope: string[], role: keyof Palette, italic?: boolean }> = [
  { name: 'Comment', scope: ['comment', 'comment.line', 'comment.block'], role: 'comment', italic: true },
  { name: 'String', scope: ['string', 'string.quoted'], role: 'string' },
  { name: 'Template String', scope: ['string.template'], role: 'string' },
  { name: 'Number', scope: ['constant.numeric'], role: 'number' },
  { name: 'Keyword', scope: ['keyword', 'keyword.control'], role: 'keyword' },
  { name: 'Storage Type', scope: ['storage.type', 'storage.modifier'], role: 'storage' },
  { name: 'Function', scope: ['entity.name.function', 'support.function'], role: 'function' },
  { name: 'Class', scope: ['entity.name.type', 'entity.name.class'], role: 'type' },
  { name: 'Variable', scope: ['variable', 'variable.other'], role: 'variable' },
  { name: 'Constant', scope: ['constant.language', 'constant.character'], role: 'constant' },
  { name: 'Tag', scope: ['entity.name.tag'], role: 'tag' },
  { name: 'Attribute', scope: ['entity.other.attribute-name'], role: 'attribute' },
  { name: 'Punctuation', scope: ['punctuation'], role: 'punctuation' },
  { name: 'Operator', scope: ['keyword.operator'], role: 'operator' },
  { name: 'CSS Property', scope: ['support.type.property-name.css'], role: 'attribute' },
  { name: 'CSS Value', scope: ['support.constant.property-value.css'], role: 'string' },
  { name: 'Color', scope: ['constant.other.color'], role: 'number' },
]

export interface ThemeDefinition {
  name: string
  type: 'dark' | 'light'
  palette: Palette
  /**
   * What this theme is for, in one line, so a picker can say something more
   * useful than its name. Carried on the theme rather than in a table beside
   * it, because a table beside it is a table that goes stale.
   */
  description?: string
  /**
   * Font styles per role, for a theme that has to separate two roles without
   * using colour.
   *
   * The monochrome pair is the reason this exists: with no hue to spend, weight
   * and slope are the only cues left, and a theme that cannot reach them is a
   * theme where every token is the same grey.
   */
  styles?: Partial<Record<keyof Palette, string>>
  /**
   * Extra token colours appended after the shared set, for a theme that needs
   * to say something the roles do not cover.
   */
  extra?: TokenColor[]
}

/** Build a full theme from a palette. */
export function defineTheme(definition: ThemeDefinition): Theme {
  const { palette } = definition

  const tokenColors: TokenColor[] = ROLES.map((entry) => {
    const style = definition.styles?.[entry.role] ?? (entry.italic ? 'italic' : undefined)

    return {
      name: entry.name,
      scope: entry.scope,
      settings: style ? { foreground: palette[entry.role], fontStyle: style } : { foreground: palette[entry.role] },
    }
  })

  return {
    name: definition.name,
    type: definition.type,
    description: definition.description,
    colors: {
      'editor.background': palette.background,
      'editor.foreground': palette.foreground,
      'editor.lineHighlightBackground': palette.surface,
      'editor.selectionBackground': palette.selection,
    },
    tokenColors: [...tokenColors, ...(definition.extra ?? [])],
  }
}

/** The palette roles that carry code, as opposed to the ones that carry chrome. */
export const CODE_ROLES: Array<keyof Palette> = [
  'foreground',
  'comment',
  'string',
  'number',
  'keyword',
  'storage',
  'function',
  'type',
  'variable',
  'constant',
  'tag',
  'attribute',
  'punctuation',
  'operator',
]
