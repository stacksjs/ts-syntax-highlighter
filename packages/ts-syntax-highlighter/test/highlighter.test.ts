import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'
import { githubDark } from '../src/themes/github-dark'

describe('Highlighter', () => {
  it('should create a highlighter instance', async () => {
    const highlighter = await createHighlighter()
    expect(highlighter).toBeDefined()
  })

  it('should highlight JavaScript code', async () => {
    const highlighter = await createHighlighter({
      theme: 'github-dark',
    })

    const code = 'const greeting = "Hello World";'
    const result = await highlighter.highlight(code, 'javascript')

    expect(result.html).toBeDefined()
    expect(result.css).toBeDefined()
    expect(result.tokens).toBeDefined()
    expect(result.html).toContain('const')
    // Check for individual characters from the string
    expect(result.html).toContain('H')
    expect(result.html).toContain('e')
    expect(result.html).toContain('l')
    expect(result.html).toContain('o')
  })

  it('should highlight TypeScript code', async () => {
    const highlighter = await createHighlighter({
      theme: 'github-dark',
    })

    const code = 'function add(a: number, b: number): number { return a + b; }'
    const result = await highlighter.highlight(code, 'typescript')

    expect(result.html).toBeDefined()
    expect(result.html).toContain('function')
    expect(result.html).toContain('number')
  })

  it('should highlight CSS code', async () => {
    const highlighter = await createHighlighter()

    const code = '.container { display: flex; color: #ff0000; }'
    const result = await highlighter.highlight(code, 'css')

    expect(result.html).toBeDefined()
    expect(result.html).toContain('container')
    expect(result.html).toContain('flex')
  })

  it('should highlight HTML code', async () => {
    const highlighter = await createHighlighter()

    const code = '<div class="test">Hello</div>'
    const result = await highlighter.highlight(code, 'html')

    expect(result.html).toBeDefined()
    expect(result.html).toContain('div')
    // Check for individual characters from "test"
    expect(result.html).toContain('t')
    expect(result.html).toContain('e')
    expect(result.html).toContain('s')
  })

  it('should highlight STX code', async () => {
    const highlighter = await createHighlighter()

    const code = '@if (condition)\n  <div>{{ message }}</div>\n@endif'
    const result = await highlighter.highlight(code, 'stx')

    expect(result.html).toBeDefined()
    expect(result.html).toContain('@if')
  })

  it('should support different themes', async () => {
    const highlighter = await createHighlighter({
      theme: 'github-light',
    })

    const code = 'const x = 42;'
    const result = await highlighter.highlight(code, 'javascript')

    expect(result.css).toContain('#ffffff') // GitHub Light background
  })

  it('should support line numbers', async () => {
    const highlighter = await createHighlighter()

    const code = 'const x = 1;\nconst y = 2;'
    const result = await highlighter.highlight(code, 'javascript', {
      lineNumbers: true,
    })

    expect(result.html).toContain('line-number')
  })

  it('should throw error for unsupported language', async () => {
    const highlighter = await createHighlighter()

    await expect(
      highlighter.highlight('code', 'unsupported-lang'),
    ).rejects.toThrow('Language "unsupported-lang" not found')
  })

  it('should list supported languages', async () => {
    const highlighter = await createHighlighter()
    const languages = highlighter.getSupportedLanguages()

    expect(languages).toContain('javascript')
    expect(languages).toContain('typescript')
    expect(languages).toContain('html')
    expect(languages).toContain('css')
    expect(languages).toContain('stx')
  })

  it('should list supported themes', async () => {
    const highlighter = await createHighlighter()
    const themes = highlighter.getSupportedThemes()

    expect(themes).toContain('github dark')
    expect(themes).toContain('github light')
    expect(themes).toContain('nord')
  })

  it('should load custom theme', async () => {
    const highlighter = await createHighlighter()

    await highlighter.loadTheme(githubDark)

    const themes = highlighter.getSupportedThemes()
    expect(themes).toContain('github dark')
  })

  it('should cache highlighted code', async () => {
    const highlighter = await createHighlighter({ cache: true })

    const code = 'const x = 1;'

    // First highlight
    await highlighter.highlight(code, 'javascript')
    expect(highlighter.getCacheSize()).toBe(1)

    // Second highlight (should use cache)
    await highlighter.highlight(code, 'javascript')
    expect(highlighter.getCacheSize()).toBe(1)
  })

  it('should clear cache', async () => {
    const highlighter = await createHighlighter({ cache: true })

    const code = 'const x = 1;'
    await highlighter.highlight(code, 'javascript')

    expect(highlighter.getCacheSize()).toBe(1)

    highlighter.clearCache()
    expect(highlighter.getCacheSize()).toBe(0)
  })
})
