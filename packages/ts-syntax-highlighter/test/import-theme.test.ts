/**
 * Reading a theme somebody else published.
 *
 * The format has drifted over fifteen years and thousands of authors, so most
 * of these are about tolerating a shape rather than about colour. The rule
 * throughout: a file that cannot be read at all throws, and a file with one
 * unreadable *part* loses that part and keeps the rest - because a colour
 * scheme missing one scope rule is a working colour scheme, and a thrown error
 * is a blank page.
 */

import { describe, expect, it } from 'bun:test'
import {
  importTheme,
  importThemeFromJson,
  normalizeColor,
  normalizeScopes,
  relativeLuminance,
  stripJsonComments,
  themeChrome,
} from '../src/import-theme'

describe('normalizeColor', () => {
  it('expands the three and four digit forms', () => {
    expect(normalizeColor('#abc')).toBe('#aabbcc')
    expect(normalizeColor('#abcd')).toBe('#aabbccdd')
  })

  it('lowercases, and accepts a missing hash', () => {
    expect(normalizeColor('#AABBCC')).toBe('#aabbcc')
    expect(normalizeColor('aabbcc')).toBe('#aabbcc')
  })

  it('keeps the alpha channel, because a selection colour needs one', () => {
    expect(normalizeColor('#264f7855')).toBe('#264f7855')
  })

  /**
   * A guess here would be worse than nothing: `#zzz` computes to transparent
   * black in a browser, so a mistyped colour would render invisible text rather
   * than falling back to the theme's own foreground.
   */
  it('refuses anything it cannot read rather than guessing', () => {
    for (const value of ['#zzz', 'rebeccapurple', '', '   ', '#12345', null, 42, undefined])
      expect(normalizeColor(value)).toBeNull()
  })
})

describe('normalizeScopes', () => {
  it('takes an array', () => {
    expect(normalizeScopes(['comment', 'string'])).toEqual(['comment', 'string'])
  })

  it('takes one scope as a bare string', () => {
    expect(normalizeScopes('comment')).toEqual(['comment'])
  })

  /** Legal, common, and the shape a naive reader silently gets wrong. */
  it('takes a comma-separated list inside one string', () => {
    expect(normalizeScopes('comment, string.quoted , keyword')).toEqual(['comment', 'string.quoted', 'keyword'])
  })

  it('is empty for anything else', () => {
    expect(normalizeScopes(undefined)).toEqual([])
    expect(normalizeScopes(42)).toEqual([])
  })
})

describe('importTheme', () => {
  const published = {
    name: 'Test Dark',
    type: 'dark',
    colors: { 'editor.background': '#0d1117', 'editor.foreground': '#c9d1d9' },
    tokenColors: [
      { name: 'Comment', scope: 'comment, punctuation.definition.comment', settings: { foreground: '#8b949e', fontStyle: 'italic' } },
      { scope: ['keyword'], settings: { foreground: '#f97583' } },
    ],
  }

  it('reads a well-formed theme unchanged', () => {
    const theme = importTheme(published)

    expect(theme.name).toBe('Test Dark')
    expect(theme.type).toBe('dark')
    expect(theme.colors['editor.background']).toBe('#0d1117')
    expect(theme.tokenColors).toHaveLength(2)
    expect(theme.tokenColors[0]!.scope).toEqual(['comment', 'punctuation.definition.comment'])
  })

  it('keeps only the font styles that mean something', () => {
    const theme = importTheme({
      colors: {},
      tokenColors: [{ scope: 'a', settings: { foreground: '#fff', fontStyle: 'ITALIC bold sparkly' } }],
    })

    expect(theme.tokenColors[0]!.settings.fontStyle).toBe('italic bold')
  })

  it('drops a rule that sets nothing rather than matching a scope and saying nothing', () => {
    const theme = importTheme({ colors: {}, tokenColors: [{ scope: 'a', settings: {} }] })

    expect(theme.tokenColors).toHaveLength(0)
  })

  it('drops a rule with no scope, and one with no settings', () => {
    const theme = importTheme({
      colors: {},
      tokenColors: [
        { settings: { foreground: '#fff' } },
        { scope: 'a' },
        { scope: 'b', settings: { foreground: '#fff' } },
      ],
    })

    expect(theme.tokenColors).toHaveLength(1)
    expect(theme.tokenColors[0]!.scope).toEqual(['b'])
  })

  /** Half the themes on the marketplace do not say which they are. */
  it('works out light or dark from the background when the file does not say', () => {
    expect(importTheme({ colors: { 'editor.background': '#0d1117' } }).type).toBe('dark')
    expect(importTheme({ colors: { 'editor.background': '#ffffff' } }).type).toBe('light')
  })

  it('believes the file over the background when it does say', () => {
    expect(importTheme({ type: 'light', colors: { 'editor.background': '#000000' } }).type).toBe('light')
  })

  it('always has a background and a foreground, whatever the file left out', () => {
    const theme = importTheme({ name: 'Bare' })

    expect(theme.colors['editor.background']).toBeTruthy()
    expect(theme.colors['editor.foreground']).toBeTruthy()
  })

  it('refuses something that is not a theme at all', () => {
    expect(() => importTheme(null as never)).toThrow()
  })
})

describe('an old .tmTheme conversion', () => {
  const legacy = {
    name: 'Old',
    settings: [
      { settings: { background: '#282c34', foreground: '#abb2bf', selection: '#3e4451' } },
      { name: 'Comment', scope: 'comment', settings: { foreground: '#5c6370', fontStyle: 'italic' } },
    ],
  }

  /**
   * Those files have one `settings` array and give the editor's own colours as
   * an entry with no scope. Read as a scope rule it matches nothing; ignored
   * entirely, the theme has no background at all.
   */
  it('reads the editor colours out of the entry that has no scope', () => {
    const theme = importTheme(legacy)

    expect(theme.colors['editor.background']).toBe('#282c34')
    expect(theme.colors['editor.foreground']).toBe('#abb2bf')
    expect(theme.colors['editor.selectionBackground']).toBe('#3e4451')
  })

  it('and reads the rest of the array as scope rules', () => {
    const theme = importTheme(legacy)

    expect(theme.tokenColors).toHaveLength(1)
    expect(theme.tokenColors[0]!.scope).toEqual(['comment'])
  })

  it('infers dark from the background it found there', () => {
    expect(importTheme(legacy).type).toBe('dark')
  })
})

describe('include', () => {
  const base = {
    name: 'Base',
    type: 'dark',
    colors: { 'editor.background': '#000000', 'editor.foreground': '#ffffff' },
    tokenColors: [{ scope: 'comment', settings: { foreground: '#888888' } }],
  }

  it('is ignored when the caller has no way to resolve it', () => {
    const theme = importTheme({ include: './base.json', colors: { 'editor.background': '#111111' } })

    expect(theme.tokenColors).toHaveLength(0)
  })

  it('is merged when the caller supplies a reader, with the including file winning', () => {
    const theme = importTheme(
      { name: 'Derived', include: './base.json', colors: { 'editor.background': '#111111' } },
      { resolveInclude: () => base },
    )

    expect(theme.name).toBe('Derived')
    expect(theme.colors['editor.background']).toBe('#111111')
    // Inherited, because the deriving file said nothing about it.
    expect(theme.colors['editor.foreground']).toBe('#ffffff')
    expect(theme.tokenColors).toHaveLength(1)
  })
})

describe('importThemeFromJson', () => {
  /**
   * VS Code reads its own theme files as JSONC, so a great many published
   * themes have comments in them and are not valid JSON. Refusing those would
   * refuse exactly the themes somebody hand-wrote and cared about.
   */
  it('reads a file with comments and a trailing comma', () => {
    const json = `{
      // The one true theme
      "name": "Commented",
      "type": "dark",
      /* and a block comment */
      "colors": { "editor.background": "#000000", },
    }`

    expect(importThemeFromJson(json).name).toBe('Commented')
  })

  it('leaves a comment-like sequence inside a string alone', () => {
    const json = '{"name": "http://example.com/*", "colors": {}}'

    expect(importThemeFromJson(json).name).toBe('http://example.com/*')
  })

  it('says so plainly when the file is not readable', () => {
    expect(() => importThemeFromJson('{oh no')).toThrow(/readable theme/)
  })
})

describe('stripJsonComments', () => {
  it('leaves an escaped quote inside a string alone', () => {
    expect(stripJsonComments('{"a": "say \\"hi\\" // not a comment"}'))
      .toBe('{"a": "say \\"hi\\" // not a comment"}')
  })
})

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5)
  })

  /** Green carries most of the apparent brightness, blue almost none. */
  it('weights the channels the way an eye does', () => {
    expect(relativeLuminance('#00ff00')).toBeGreaterThan(relativeLuminance('#0000ff'))
  })
})

describe('themeChrome', () => {
  it('takes the colours the theme states', () => {
    const chrome = themeChrome(importTheme({
      type: 'dark',
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editorGroup.border': '#30363d',
        'editor.selectionBackground': '#264f78',
        'editorLineNumber.foreground': '#6e7681',
      },
    }))

    expect(chrome).toMatchObject({
      background: '#0d1117',
      foreground: '#c9d1d9',
      border: '#30363d',
      selection: '#264f78',
      muted: '#6e7681',
    })
  })

  /**
   * The point of deriving rather than leaving holes: every imported theme
   * yields a complete set, so the page around the code is themed by the same
   * file rather than being a code pane pasted into an application.
   */
  it('derives every value the theme did not state', () => {
    const chrome = themeChrome(importTheme({ type: 'dark', colors: { 'editor.background': '#0d1117', 'editor.foreground': '#c9d1d9' } }))

    for (const value of Object.values(chrome))
      expect(value).toMatch(/^#[0-9a-f]{6,8}$/)
  })

  it('lightens on a dark theme and darkens on a light one', () => {
    const dark = themeChrome(importTheme({ type: 'dark', colors: { 'editor.background': '#000000', 'editor.foreground': '#ffffff' } }))
    const light = themeChrome(importTheme({ type: 'light', colors: { 'editor.background': '#ffffff', 'editor.foreground': '#000000' } }))

    expect(relativeLuminance(dark.surface)).toBeGreaterThan(relativeLuminance(dark.background))
    expect(relativeLuminance(light.surface)).toBeLessThan(relativeLuminance(light.background))
  })
})
