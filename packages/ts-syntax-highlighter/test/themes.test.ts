import { describe, expect, it } from 'bun:test'
import { getTheme, themes } from '../src/themes'

describe('Themes', () => {
  it('should export all themes', () => {
    expect(themes).toBeDefined()
    expect(themes.length).toBe(3) // github-dark, github-light, nord
  })

  it('should get theme by name', () => {
    const theme = getTheme('GitHub Dark')
    expect(theme).toBeDefined()
    expect(theme?.name).toBe('GitHub Dark')
  })

  it('should get theme case-insensitively', () => {
    const theme = getTheme('github dark')
    expect(theme).toBeDefined()
    expect(theme?.name).toBe('GitHub Dark')
  })

  it('should return undefined for unknown theme', () => {
    const theme = getTheme('unknown')
    expect(theme).toBeUndefined()
  })

  it('should have valid properties for each theme', () => {
    for (const theme of themes) {
      expect(theme.name).toBeDefined()
      expect(theme.type).toBeDefined()
      expect(['light', 'dark'].includes(theme.type)).toBe(true)
      expect(theme.colors).toBeDefined()
      expect(theme.colors['editor.background']).toBeDefined()
      expect(theme.colors['editor.foreground']).toBeDefined()
      expect(theme.tokenColors).toBeDefined()
      expect(Array.isArray(theme.tokenColors)).toBe(true)
    }
  })

  it('should have token color rules for common scopes', () => {
    for (const theme of themes) {
      const scopes = theme.tokenColors.flatMap(tc =>
        Array.isArray(tc.scope) ? tc.scope : [tc.scope],
      )

      expect(scopes.some(s => s.includes('comment'))).toBe(true)
      expect(scopes.some(s => s.includes('string'))).toBe(true)
      expect(scopes.some(s => s.includes('keyword'))).toBe(true)
    }
  })
})
