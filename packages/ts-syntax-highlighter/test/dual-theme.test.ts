import type { TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { renderDualTheme } from '../src/dual-theme'
import { githubDark } from '../src/themes/github-dark'
import { githubLight } from '../src/themes/github-light'

describe('renderDualTheme', () => {
  const tokens: TokenLine[] = [
    {
      line: 1,
      tokens: [
        { type: 'keyword', content: 'const', scopes: ['source.js', 'storage.type.js'], line: 1, offset: 0 },
        { type: 'text', content: ' x = ', scopes: ['source.js'], line: 1, offset: 5 },
        { type: 'number', content: '42', scopes: ['source.js', 'constant.numeric.js'], line: 1, offset: 10 },
      ],
    },
  ]

  it('does not bake either theme color into the HTML as an inline style', () => {
    const result = renderDualTheme(tokens, {
      lightTheme: githubLight,
      darkTheme: githubDark,
      selector: '.dark-root',
    })

    // A theme color inlined here could never be overridden by any
    // stylesheet, dark or light - that was the bug.
    expect(result.html).not.toContain('style="color:')
  })

  it('emits a light-mode color rule for a scope with no selector prefix', () => {
    const result = renderDualTheme(tokens, {
      lightTheme: githubLight,
      darkTheme: githubDark,
      selector: '.dark-root',
    })

    const lightKeywordColor = githubLight.tokenColors.find(
      t => (Array.isArray(t.scope) ? t.scope : [t.scope]).some(s => s.includes('storage.type')),
    )?.settings.foreground

    expect(lightKeywordColor).toBeTruthy()
    expect(result.css).toContain(`color: ${lightKeywordColor}`)
  })

  it('emits the dark-mode color rule scoped under the given selector, not applied by default', () => {
    const result = renderDualTheme(tokens, {
      lightTheme: githubLight,
      darkTheme: githubDark,
      selector: '.dark-root',
    })

    const darkKeywordColor = githubDark.tokenColors.find(
      t => (Array.isArray(t.scope) ? t.scope : [t.scope]).some(s => s.includes('storage.type')),
    )?.settings.foreground

    expect(darkKeywordColor).toBeTruthy()
    expect(result.css).toContain('.dark-root.dark')
    expect(result.css).toContain(`color: ${darkKeywordColor}`)

    // Every occurrence of the dark color must sit after some occurrence of
    // the dark-mode selector prefix, i.e. inside a scoped rule - not as a
    // bare, always-applied rule sitting ahead of any `.dark-root.dark ...`.
    const firstPrefixIndex = result.css!.indexOf('.dark-root.dark')
    const colorIndex = result.css!.indexOf(`color: ${darkKeywordColor}`)
    expect(firstPrefixIndex).toBeGreaterThanOrEqual(0)
    expect(colorIndex).toBeGreaterThan(firstPrefixIndex)
  })

  it('renders identical markup regardless of which theme colors were requested', () => {
    const first = renderDualTheme(tokens, { lightTheme: githubLight, darkTheme: githubDark })
    const second = renderDualTheme(tokens, { lightTheme: githubDark, darkTheme: githubLight })

    expect(first.html).toBe(second.html)
  })
})
