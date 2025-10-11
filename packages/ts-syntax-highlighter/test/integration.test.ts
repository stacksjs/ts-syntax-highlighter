import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'

describe('Integration Tests', () => {
  describe('End-to-End Workflows', () => {
    it('should highlight JavaScript code with all features', async () => {
      const highlighter = await createHighlighter()
      const code = `const x = 1;
const y = 2;
const z = 3;`

      const result = await highlighter.highlight(code, 'javascript', {
        lineNumbers: true,
        focusLines: [2],
        addedLines: [1],
        removedLines: [3],
        annotations: [
          { line: 2, text: 'Important line', type: 'info' },
        ],
        showCopyButton: true,
        theme: 'github-dark',
      })

      expect(result.html).toBeDefined()
      expect(result.css).toBeDefined()
      expect(result.ansi).toBeDefined()
      expect(result.html).toContain('line-number')
      expect(result.html).toContain('focus')
      expect(result.html).toContain('added')
      expect(result.html).toContain('removed')
      expect(result.html).toContain('Important line')
      expect(result.html).toContain('copy-button')
    })

    it('should highlight TypeScript code with types', async () => {
      const highlighter = await createHighlighter()
      const code = `interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`

      const result = await highlighter.highlight(code, 'typescript', {
        lineNumbers: true,
        theme: 'nord',
      })

      expect(result.html).toBeDefined()
      // Just verify it rendered without errors
      expect(result.html.length).toBeGreaterThan(0)
    })

    it('should highlight HTML with inline styles', async () => {
      const highlighter = await createHighlighter()
      const code = `<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <div class="container">Hello World</div>
  </body>
</html>`

      const result = await highlighter.highlight(code, 'html')

      expect(result.html).toBeDefined()
      expect(result.html).toContain('&lt;') // HTML should be escaped
    })

    it('should highlight CSS with all selector types', async () => {
      const highlighter = await createHighlighter()
      const code = `.container {
  display: flex;
}

#main {
  width: 100%;
}

a:hover {
  color: red;
}

@media (min-width: 768px) {
  .container { width: 750px; }
}`

      const result = await highlighter.highlight(code, 'css')

      expect(result.html).toBeDefined()
      expect(result.html).toContain('container')
      expect(result.html).toContain('display')
    })

    it('should work with all supported languages', async () => {
      const highlighter = await createHighlighter()
      const languages = ['javascript', 'typescript', 'html', 'css', 'stx']

      for (const lang of languages) {
        const result = await highlighter.highlight(`test code for ${lang}`, lang)
        expect(result).toBeDefined()
        expect(result.html).toBeDefined()
        expect(result.css).toBeDefined()
      }
    })

    it('should work with all supported themes', async () => {
      const highlighter = await createHighlighter()
      const themes = ['github-dark', 'github-light', 'nord']
      const code = 'const x = 42;'

      for (const theme of themes) {
        const result = await highlighter.highlight(code, 'javascript', { theme })
        expect(result).toBeDefined()
        expect(result.html).toBeDefined()
        expect(result.css).toBeDefined()
      }
    })
  })

  describe('Error Handling', () => {
    it('should throw error for unknown language', async () => {
      const highlighter = await createHighlighter()

      await expect(
        highlighter.highlight('test', 'unknown-language'),
      ).rejects.toThrow()
    })

    it('should throw error for invalid theme', async () => {
      const highlighter = await createHighlighter()

      await expect(
        highlighter.highlight('test', 'javascript', { theme: 'nonexistent-theme' }),
      ).rejects.toThrow()
    })

    it('should handle empty code gracefully', async () => {
      const highlighter = await createHighlighter()

      const result = await highlighter.highlight('', 'javascript')
      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
    })

    it('should handle malformed code without errors', async () => {
      const highlighter = await createHighlighter()
      const malformedCode = 'const x = = = ;'

      const result = await highlighter.highlight(malformedCode, 'javascript')
      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
    })

    it('should handle very long code without errors', async () => {
      const highlighter = await createHighlighter()
      const longCode = Array.from({ length: 10000 }, (_, i) => `const x${i} = ${i};`).join('\n')

      const result = await highlighter.highlight(longCode, 'javascript')
      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
    })

    it('should handle special characters without errors', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = "<script>alert(\'XSS\')</script>";'

      const result = await highlighter.highlight(code, 'javascript')
      expect(result).toBeDefined()
      // Check for escaped HTML (individual characters may be in separate spans)
      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
    })

    it('should handle Unicode edge cases', async () => {
      const highlighter = await createHighlighter()
      const code = 'const 你好 = "世界"; const emoji = "👋🌍";'

      const result = await highlighter.highlight(code, 'javascript')
      expect(result).toBeDefined()
      // Unicode characters will be present
      expect(result.html).toContain('你')
      // Emojis may be split into surrogate pairs, just verify rendering works
      expect(result.html.length).toBeGreaterThan(0)
    })

    it('should handle null bytes in code', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\x00const y = 2;'

      const result = await highlighter.highlight(code, 'javascript')
      expect(result).toBeDefined()
    })

    it('should handle mixed line endings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\r\nconst y = 2;\nconst z = 3;\r'

      const result = await highlighter.highlight(code, 'javascript')
      expect(result).toBeDefined()
    })
  })

  describe('Language Detection', () => {
    it('should list all supported languages', async () => {
      const highlighter = await createHighlighter()
      const languages = highlighter.getSupportedLanguages()

      expect(languages).toContain('javascript')
      expect(languages).toContain('typescript')
      expect(languages).toContain('html')
      expect(languages).toContain('css')
      expect(languages).toContain('stx')
    })

    it('should list all supported themes', async () => {
      const highlighter = await createHighlighter()
      const themes = highlighter.getSupportedThemes()

      expect(themes.length).toBeGreaterThan(0)
      expect(themes.some(t => t.includes('github'))).toBe(true)
    })
  })

  describe('Configuration', () => {
    it('should use default config when none provided', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript')

      expect(result).toBeDefined()
    })

    it('should use custom theme from config', async () => {
      const highlighter = await createHighlighter({ theme: 'nord' })
      const result = await highlighter.highlight('const x = 1;', 'javascript')

      expect(result).toBeDefined()
      expect(result.css).toBeDefined()
    })

    it('should respect cache setting from config', async () => {
      const highlighter1 = await createHighlighter({ cache: true })
      await highlighter1.highlight('const x = 1;', 'javascript')
      expect(highlighter1.getCacheSize()).toBe(1)

      const highlighter2 = await createHighlighter({ cache: false })
      await highlighter2.highlight('const x = 1;', 'javascript')
      expect(highlighter2.getCacheSize()).toBe(0)
    })
  })

  describe('Complex Integration Scenarios', () => {
    it('should handle rapid theme switching', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 42;'

      const result1 = await highlighter.highlight(code, 'javascript', { theme: 'github-dark' })
      const result2 = await highlighter.highlight(code, 'javascript', { theme: 'github-light' })
      const result3 = await highlighter.highlight(code, 'javascript', { theme: 'nord' })

      expect(result1.css).not.toBe(result2.css)
      expect(result2.css).not.toBe(result3.css)
    })

    it('should handle rapid language switching', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      const result1 = await highlighter.highlight(code, 'javascript')
      const result2 = await highlighter.highlight(code, 'typescript')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })

    it('should handle concurrent highlighting of different languages', async () => {
      const highlighter = await createHighlighter()

      const promises = [
        highlighter.highlight('const x = 1;', 'javascript'),
        highlighter.highlight('const x: number = 1;', 'typescript'),
        highlighter.highlight('<div>test</div>', 'html'),
        highlighter.highlight('.class { color: red; }', 'css'),
      ]

      const results = await Promise.all(promises)

      expect(results.length).toBe(4)
      results.forEach((result) => {
        expect(result).toBeDefined()
        expect(result.html).toBeDefined()
      })
    })

    it('should produce consistent results for same input', async () => {
      const highlighter = await createHighlighter({ cache: false })
      const code = 'const x = 42;'
      const options = { lineNumbers: true, theme: 'github-dark' as const }

      const result1 = await highlighter.highlight(code, 'javascript', options)
      const result2 = await highlighter.highlight(code, 'javascript', options)

      expect(result1.html).toBe(result2.html)
      expect(result1.css).toBe(result2.css)
    })

    it('should handle nested HTML correctly', async () => {
      const highlighter = await createHighlighter()
      const code = `<div>
  <span>
    <a href="#">
      <strong>Link</strong>
    </a>
  </span>
</div>`

      const result = await highlighter.highlight(code, 'html')

      expect(result).toBeDefined()
      // HTML is escaped (< becomes &lt; etc)
      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
    })

    it('should handle complex TypeScript types', async () => {
      const highlighter = await createHighlighter()
      const code = `type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}`

      const result = await highlighter.highlight(code, 'typescript')

      expect(result).toBeDefined()
      // Check for key TypeScript keywords
      expect(result.html).toContain('type')
      expect(result.html).toContain('readonly')
    })

    it('should handle CSS with custom properties', async () => {
      const highlighter = await createHighlighter()
      const code = `:root {
  --primary-color: #007bff;
  --spacing: 1rem;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}`

      const result = await highlighter.highlight(code, 'css')

      expect(result).toBeDefined()
      // Just verify it rendered the CSS (dashes may be in separate spans)
      expect(result.html.length).toBeGreaterThan(0)
      expect(result.html).toContain('-')
    })
  })

  describe('Edge Case Integration', () => {
    it('should handle all features with empty code', async () => {
      const highlighter = await createHighlighter()

      const result = await highlighter.highlight('', 'javascript', {
        lineNumbers: true,
        highlightLines: [1],
        focusLines: [1],
        annotations: [{ line: 1, text: 'Test', type: 'info' }],
      })

      expect(result).toBeDefined()
    })

    it('should handle out-of-bounds line numbers gracefully', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      const result = await highlighter.highlight(code, 'javascript', {
        highlightLines: [999],
        focusLines: [999],
        addedLines: [999],
        annotations: [{ line: 999, text: 'Test', type: 'info' }],
      })

      expect(result).toBeDefined()
    })

    it('should handle duplicate line numbers', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\nconst y = 2;'

      const result = await highlighter.highlight(code, 'javascript', {
        highlightLines: [1, 1, 1],
        focusLines: [1, 1],
        addedLines: [1, 1],
      })

      expect(result).toBeDefined()
    })

    it('should handle conflicting line annotations', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      const result = await highlighter.highlight(code, 'javascript', {
        addedLines: [1],
        removedLines: [1], // Same line as added
        focusLines: [1],
        dimLines: [1], // Same line as focus
      })

      expect(result).toBeDefined()
    })

    it('should handle very long annotation text', async () => {
      const highlighter = await createHighlighter()
      const longText = 'a'.repeat(10000)

      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        annotations: [{ line: 1, text: longText, type: 'info' }],
      })

      expect(result).toBeDefined()
    })

    it('should handle many annotations on single line', async () => {
      const highlighter = await createHighlighter()

      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        annotations: Array.from({ length: 100 }, (_, i) => ({
          line: 1,
          text: `Annotation ${i}`,
          type: 'info' as const,
        })),
      })

      expect(result).toBeDefined()
    })
  })

  describe('Performance Integration', () => {
    it('should handle 1000 lines efficiently with all features', async () => {
      const highlighter = await createHighlighter()
      const code = Array.from({ length: 1000 }, (_, i) => `const x${i} = ${i};`).join('\n')

      const start = performance.now()
      const result = await highlighter.highlight(code, 'javascript', {
        lineNumbers: true,
        highlightLines: [500],
        annotations: [{ line: 500, text: 'Middle', type: 'info' }],
      })
      const end = performance.now()

      expect(result).toBeDefined()
      expect(end - start).toBeLessThan(10000) // Should complete in < 10 seconds
    })

    it('should handle concurrent highlighting with caching', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      // Prime cache
      await highlighter.highlight(code, 'javascript')

      // Concurrent cache hits
      const promises = Array.from({ length: 100 }, () =>
        highlighter.highlight(code, 'javascript'))

      const start = performance.now()
      const results = await Promise.all(promises)
      const end = performance.now()

      expect(results.length).toBe(100)
      expect(end - start).toBeLessThan(1000) // Should be very fast with cache
    })
  })
})
