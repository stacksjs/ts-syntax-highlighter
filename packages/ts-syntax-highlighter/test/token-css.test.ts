// Token classes as CSS.
//
// The property that matters: a consumer that writes the class `tokenClass`
// gives it, and ships the rules `themeTokenCss` builds, sees the same colours
// the renderer would have written inline.

import { describe, expect, test } from 'bun:test'
import { resolveGrammar } from '../src/lazy'
import { getTheme, themes } from '../src/themes'
import {
  resolveThemeScope,
  themeTokenColors,
  themeTokenCss,
  themeTokenVariables,
  TOKEN_CLASS_SCOPES,
  TOKEN_CLASSES,
  tokenClass,
  tokenClassCss,
} from '../src/token-css'
import { classifyScope, Tokenizer } from '../src/tokenizer'

const githubLight = getTheme('github-light')!
const githubDark = getTheme('github-dark')!

describe('tokenClass', () => {
  test('folds the tokenizer\'s fast-path names into what a stylesheet colours', () => {
    expect(tokenClass('line')).toBe('comment')
    expect(tokenClass('block')).toBe('comment')
    expect(tokenClass('double')).toBe('string')
    expect(tokenClass('single')).toBe('string')
    expect(tokenClass('template')).toBe('string')
  })

  test('passes a class through unchanged', () => {
    for (const name of TOKEN_CLASSES)
      expect(tokenClass(name)).toBe(name)
  })

  test('gives text and whitespace no class, so they need no wrapper', () => {
    expect(tokenClass('text')).toBe('')
    expect(tokenClass('whitespace')).toBe('')
    expect(tokenClass('something-new')).toBe('')
  })

  test('every scope a class stands for classifies back to that class', () => {
    for (const [name, scope] of Object.entries(TOKEN_CLASS_SCOPES))
      expect(classifyScope(`${scope}.ts`)).toBe(name)
  })

  test('covers every type the tokenizer produces for real code', async () => {
    const grammar = await resolveGrammar('typescript')
    const source = [
      '/* block */ // line',
      'export async function load<T>(id: number): Promise<T> {',
      '  const row = await User.where("id", id).first() ?? null',
      '  return `${row}` as T',
      '}',
    ]
    const { lines } = new Tokenizer(grammar!).tokenizeLinesFrom(source)
    const seen = new Set(lines.flatMap(line => line.tokens.map(token => token.type)))

    for (const type of seen) {
      if (type === 'text' || type === 'whitespace')
        continue
      expect(tokenClass(type), type).not.toBe('')
    }
  })
})

describe('resolveThemeScope', () => {
  test('the longer theme scope wins, so an operator is not a keyword', () => {
    // A palette theme lists `keyword` and `keyword.operator` as separate
    // entries, and both cover an operator. The longer one has to win.
    const theme = getTheme('daylight')!
    const operatorEntry = theme.tokenColors.find(entry => entry.scope.includes('keyword.operator'))!
    const keywordEntry = theme.tokenColors.find(entry => entry.scope.includes('keyword.control'))!

    expect(resolveThemeScope(theme, 'keyword.operator.ts')).toBe(operatorEntry.settings)
    expect(resolveThemeScope(theme, 'keyword.control.ts')).toBe(keywordEntry.settings)
  })

  test('a scope no theme entry covers answers with nothing', () => {
    expect(resolveThemeScope(githubLight, 'nothing.at.all')).toEqual({})
  })

  test('a prefix has to end on a dot: `string` does not cover `stringent`', () => {
    expect(resolveThemeScope(githubLight, 'stringent')).toEqual({})
  })
})

describe('themeTokenColors', () => {
  test('every first-party theme colours every class', () => {
    for (const theme of themes) {
      const colors = themeTokenColors(theme)
      for (const name of TOKEN_CLASSES)
        expect(colors[name]!.foreground, `${theme.name} ${name}`).toMatch(/^#/)
    }
  })

  test('agrees with the renderer about a keyword', async () => {
    const { Renderer } = await import('../src/renderer')
    const grammar = await resolveGrammar('typescript')
    const { lines } = new Tokenizer(grammar!).tokenizeLinesFrom(['return 1'])
    const html = new Renderer(githubLight).render(lines).html
    const inline = /color:\s*(#[0-9a-f]+)[^>]*>return</i.exec(html)?.[1]

    expect(inline).toBeDefined()
    expect(themeTokenColors(githubLight).keyword!.foreground!.toLowerCase()).toBe(inline!.toLowerCase())
  })
})

describe('the CSS', () => {
  test('variables carry the panel colours and one colour per class', () => {
    const css = themeTokenVariables(githubDark)

    expect(css).toContain(`--syntax-background: ${githubDark.colors['editor.background']};`)
    expect(css).toContain(`--syntax-foreground: ${githubDark.colors['editor.foreground']};`)
    for (const name of TOKEN_CLASSES)
      expect(css).toContain(`--syntax-${name}: `)
    // Declarations only: where they apply is the caller's decision.
    expect(css).not.toContain('{')
  })

  test('rules read the variables and fall back to the theme', () => {
    const css = tokenClassCss(githubLight)
    const keyword = themeTokenColors(githubLight).keyword!.foreground

    expect(css).toContain(`.syntax .tok-keyword { color: var(--syntax-keyword, ${keyword}); }`)
    expect(css).toContain('.syntax .tok-comment { color: var(--syntax-comment,')
    expect(css).toMatch(/\.tok-comment \{[^}]*font-style: italic;/)
  })

  test('rules without a theme inherit, so an unthemed page stays legible', () => {
    expect(tokenClassCss()).toContain('.syntax .tok-keyword { color: var(--syntax-keyword, inherit); }')
  })

  test('selector and prefixes are the caller\'s', () => {
    const css = themeTokenCss(githubLight, { selector: '.editor', classPrefix: 't-', variablePrefix: '--code-' })

    expect(css).toContain('.editor {\n--code-background:')
    expect(css).toContain('.editor .t-string { color: var(--code-string,')
    expect(css).not.toContain('.syntax')
  })

  test('two palettes differ only in their variables', () => {
    // What makes a light and a dark palette switchable with a media query.
    expect(themeTokenVariables(githubLight)).not.toBe(themeTokenVariables(githubDark))
    expect(tokenClassCss(undefined)).toBe(tokenClassCss(undefined))
  })
})
