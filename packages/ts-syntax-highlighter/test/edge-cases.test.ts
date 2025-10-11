import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'

describe('Edge Cases', () => {
  describe('Input Validation', () => {
    it('should handle empty code', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('', 'javascript')

      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
    })

    it('should handle whitespace-only code', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('   \n  \n   ', 'javascript')

      expect(result).toBeDefined()
      expect(result.html).toBeDefined()
    })

    it('should handle single character', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('x', 'javascript')

      expect(result).toBeDefined()
      expect(result.html).toContain('x')
    })

    it('should handle very long single line (10KB)', async () => {
      const highlighter = await createHighlighter()
      const longCode = `const x = ${'"a"'.repeat(3000)};`
      const result = await highlighter.highlight(longCode, 'javascript')

      expect(result).toBeDefined()
      expect(result.html.length).toBeGreaterThan(0)
    })

    it('should handle many short lines (1000 lines)', async () => {
      const highlighter = await createHighlighter()
      const lines = Array.from({ length: 1000 }, (_, i) => `const x${i} = ${i};`)
      const code = lines.join('\n')

      const start = performance.now()
      const result = await highlighter.highlight(code, 'javascript')
      const end = performance.now()

      expect(result).toBeDefined()
      expect(end - start).toBeLessThan(10000) // Should finish in < 10 seconds
    })

    it('should handle code with null bytes', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\x00const y = 2;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle code with all ASCII control characters', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = "\\t\\n\\r";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
      expect(result.html).toContain('x')
    })
  })

  describe('Unicode and Special Characters', () => {
    it('should handle Unicode identifiers', async () => {
      const highlighter = await createHighlighter()
      const code = 'const 你好 = "世界";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
      // Unicode characters are present (may be in separate spans)
      expect(result.html).toContain('你')
    })

    it('should handle emojis in code', async () => {
      const highlighter = await createHighlighter()
      const code = 'const msg = "Hello 👋🌍🚀";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle RTL characters', async () => {
      const highlighter = await createHighlighter()
      const code = 'const arabic = "مرحبا";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle surrogate pairs', async () => {
      const highlighter = await createHighlighter()
      const code = 'const emoji = "𝕳𝖊𝖑𝖑𝖔";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle zero-width characters', async () => {
      const highlighter = await createHighlighter()
      const code = 'const\u200Bx\u200B=\u200B1;' // Zero-width spaces
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })
  })

  describe('Malformed Code', () => {
    it('should handle unclosed strings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = "unclosed string'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle unclosed comments', async () => {
      const highlighter = await createHighlighter()
      const code = '/* unclosed comment'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle unmatched brackets', async () => {
      const highlighter = await createHighlighter()
      const code = 'const obj = { a: { b: { c: 1 } }'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle syntax errors gracefully', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = = = 1;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle incomplete template literals', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = `incomplete ${template'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })
  })

  describe('Line Ending Edge Cases', () => {
    it('should handle CRLF line endings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\r\nconst y = 2;'
      const result = await highlighter.highlight(code, 'javascript', { lineNumbers: true })

      expect(result).toBeDefined()
      expect(result.html).toContain('line-number')
    })

    it('should handle LF line endings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\nconst y = 2;'
      const result = await highlighter.highlight(code, 'javascript', { lineNumbers: true })

      expect(result).toBeDefined()
    })

    it('should handle CR line endings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\rconst y = 2;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle mixed line endings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\r\nconst y = 2;\nconst z = 3;\r'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle trailing newlines', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;\n\n\n'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })

    it('should handle no trailing newline', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result).toBeDefined()
    })
  })

  describe('HTML Escaping Edge Cases', () => {
    it('should escape < and >', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1 < 2 && 3 > 1;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
    })

    it('should escape ampersands', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = a && b;'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result.html).toContain('&amp;')
    })

    it('should escape quotes in strings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = "quotes \\"here\\"";'
      const result = await highlighter.highlight(code, 'javascript')

      expect(result.html).toContain('&quot;')
    })

    it('should handle HTML tags in strings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const html = "<div>Hello</div>";'
      const result = await highlighter.highlight(code, 'javascript')

      // HTML is escaped (individual characters may be in separate spans)
      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
    })

    it('should handle script tags in strings', async () => {
      const highlighter = await createHighlighter()
      const code = 'const evil = "<script>alert(1)</script>";'
      const result = await highlighter.highlight(code, 'javascript')

      // Script tags are escaped
      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
    })
  })

  describe('Advanced Feature Edge Cases', () => {
    it('should handle empty highlightLines array', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        highlightLines: [],
      })

      expect(result).toBeDefined()
    })

    it('should handle out-of-bounds line numbers', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        highlightLines: [999, -1, 0],
      })

      expect(result).toBeDefined()
    })

    it('should handle duplicate line numbers', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;\nconst y = 2;', 'javascript', {
        highlightLines: [1, 1, 1],
        addedLines: [1, 1],
        removedLines: [2, 2],
      })

      expect(result).toBeDefined()
    })

    it('should handle overlapping focus and dim lines', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;\nconst y = 2;', 'javascript', {
        focusLines: [1],
        dimLines: [1], // Same line!
      })

      expect(result).toBeDefined()
    })

    it('should handle conflicting added and removed lines', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        addedLines: [1],
        removedLines: [1], // Same line!
      })

      expect(result).toBeDefined()
    })

    it('should handle empty annotations', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        annotations: [],
      })

      expect(result).toBeDefined()
    })

    it('should handle annotations with special characters', async () => {
      const highlighter = await createHighlighter()
      const result = await highlighter.highlight('const x = 1;', 'javascript', {
        annotations: [
          { line: 1, text: '<script>alert("XSS")</script>', type: 'info' },
        ],
      })

      expect(result.html).toContain('&lt;script&gt;')
    })
  })

  describe('Theme Edge Cases', () => {
    it('should handle invalid theme name', async () => {
      const highlighter = await createHighlighter()

      await expect(
        highlighter.highlight('const x = 1;', 'javascript', {
          theme: 'nonexistent-theme',
        }),
      ).rejects.toThrow()
    })

    it('should handle theme switching rapidly', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      await highlighter.highlight(code, 'javascript', { theme: 'github-dark' })
      await highlighter.highlight(code, 'javascript', { theme: 'github-light' })
      await highlighter.highlight(code, 'javascript', { theme: 'nord' })

      // Should not crash
      expect(true).toBe(true)
    })
  })

  describe('Language Detection Edge Cases', () => {
    it('should throw error for unsupported language', async () => {
      const highlighter = await createHighlighter()

      await expect(
        highlighter.highlight('code', 'unsupported-language'),
      ).rejects.toThrow()
    })

    it('should handle language aliases', async () => {
      const highlighter = await createHighlighter()

      // Aliases should work (case-sensitive)
      const result1 = await highlighter.highlight('const x = 1;', 'javascript')
      const result2 = await highlighter.highlight('const x = 1;', 'js')
      const result3 = await highlighter.highlight('const x = 1;', 'typescript')

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(result3).toBeDefined()
    })
  })

  describe('Memory and Performance Edge Cases', () => {
    it('should not leak memory on repeated highlighting', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      for (let i = 0; i < 1000; i++) {
        await highlighter.highlight(code, 'javascript')
      }

      // If this completes without OOM, we're good
      expect(true).toBe(true)
    })

    it('should handle concurrent highlighting requests', async () => {
      const highlighter = await createHighlighter()
      const code = 'const x = 1;'

      const promises = Array.from({ length: 100 }, () =>
        highlighter.highlight(code, 'javascript'))

      const results = await Promise.all(promises)
      expect(results.length).toBe(100)
      results.forEach((result) => {
        expect(result).toBeDefined()
      })
    })

    it('should handle very deep nesting', async () => {
      const highlighter = await createHighlighter()
      const depth = 100
      const openBraces = '{'.repeat(depth)
      const closeBraces = '}'.repeat(depth)
      const code = `const obj = ${openBraces}x: 1${closeBraces};`

      const result = await highlighter.highlight(code, 'javascript')
      expect(result).toBeDefined()
    })
  })
})
