import { describe, expect, it } from 'bun:test'
import { githubDark } from '../src/themes/github-dark'
import { githubLight } from '../src/themes/github-light'
import { nord } from '../src/themes/nord'
import { Renderer } from '../src/renderer'
import type { TokenLine } from '../src/types'

describe('Renderer', () => {
  const mockTokens: TokenLine[] = [
    {
      line: 1,
      tokens: [
        {
          type: 'keyword',
          content: 'const',
          scopes: ['source.js', 'storage.type.js'],
          line: 1,
          offset: 0,
        },
        {
          type: 'text',
          content: ' x = ',
          scopes: ['source.js'],
          line: 1,
          offset: 5,
        },
        {
          type: 'number',
          content: '42',
          scopes: ['source.js', 'constant.numeric.js'],
          line: 1,
          offset: 10,
        },
      ],
    },
  ]

  const multiLineTokens: TokenLine[] = [
    {
      line: 1,
      tokens: [
        { type: 'keyword', content: 'const', scopes: ['source.js', 'storage.type.js'], line: 1, offset: 0 },
        { type: 'text', content: ' x = 1;', scopes: ['source.js'], line: 1, offset: 5 },
      ],
    },
    {
      line: 2,
      tokens: [
        { type: 'keyword', content: 'const', scopes: ['source.js', 'storage.type.js'], line: 2, offset: 0 },
        { type: 'text', content: ' y = 2;', scopes: ['source.js'], line: 2, offset: 5 },
      ],
    },
    {
      line: 3,
      tokens: [
        { type: 'keyword', content: 'const', scopes: ['source.js', 'storage.type.js'], line: 3, offset: 0 },
        { type: 'text', content: ' z = 3;', scopes: ['source.js'], line: 3, offset: 5 },
      ],
    },
  ]

  describe('Basic Rendering', () => {
    it('should render tokens to HTML', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      expect(result.html).toBeDefined()
      expect(result.html).toContain('const')
      expect(result.html).toContain('42')
    })

    it('should generate CSS', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      expect(result.css).toBeDefined()
      expect(result.css).toContain('.syntax')
      expect(result.css).toContain(githubDark.colors['editor.background'])
    })

    it('should render with line numbers', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens, { lineNumbers: true })

      expect(result.html).toContain('line-number')
    })

    it('should render inline code', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens, { inline: true })

      expect(result.html).toContain('syntax-inline')
      expect(result.html).not.toContain('<pre')
    })

    it('should highlight specific lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens, { highlightLines: [1] })

      expect(result.html).toContain('highlighted')
    })

    it('should apply theme colors to tokens', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      // Should contain color styles
      expect(result.html).toContain('color:')
    })
  })

  describe('Empty and Minimal Input', () => {
    it('should handle empty token array', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render([])

      expect(result.html).toBeDefined()
      expect(result.css).toBeDefined()
    })

    it('should handle line with no tokens', () => {
      const emptyLine: TokenLine[] = [
        { line: 1, tokens: [] },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(emptyLine)

      expect(result.html).toBeDefined()
    })

    it('should handle token with empty content', () => {
      const emptyContent: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(emptyContent)

      expect(result.html).toBeDefined()
    })

    it('should handle single character tokens', () => {
      const singleChar: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: 'x', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(singleChar)

      expect(result.html).toContain('x')
    })
  })

  describe('HTML Escaping', () => {
    it('should escape < and >', () => {
      const tokensWithHtml: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '<div>', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokensWithHtml)

      expect(result.html).toContain('&lt;div&gt;')
      expect(result.html).not.toContain('<div>')
    })

    it('should escape ampersands', () => {
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: 'a && b', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokens)

      expect(result.html).toContain('&amp;&amp;')
    })

    it('should escape quotes', () => {
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'string', content: '"hello"', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokens)

      expect(result.html).toContain('&quot;')
    })

    it('should escape script tags', () => {
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '<script>alert("XSS")</script>', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokens)

      expect(result.html).toContain('&lt;script&gt;')
      expect(result.html).not.toContain('<script>')
    })

    it('should escape all HTML entities together', () => {
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '<div class="test" & \'other\'>', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokens)

      expect(result.html).toContain('&lt;')
      expect(result.html).toContain('&gt;')
      expect(result.html).toContain('&amp;')
      expect(result.html).toContain('&quot;')
    })
  })

  describe('Line Numbers', () => {
    it('should render line numbers for multiple lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { lineNumbers: true })

      expect(result.html).toContain('line-number')
      expect(result.html).toContain('<span class="line-number">1</span>')
      expect(result.html).toContain('<span class="line-number">2</span>')
      expect(result.html).toContain('<span class="line-number">3</span>')
    })

    it('should handle large line numbers (1000+)', () => {
      const largeLineTokens: TokenLine[] = [
        {
          line: 1000,
          tokens: [
            { type: 'text', content: 'line 1000', scopes: ['source.js'], line: 1000, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(largeLineTokens, { lineNumbers: true })

      expect(result.html).toContain('1000')
    })

    it('should render line numbers with empty lines', () => {
      const tokensWithEmpty: TokenLine[] = [
        { line: 1, tokens: [{ type: 'text', content: 'line 1', scopes: ['source.js'], line: 1, offset: 0 }] },
        { line: 2, tokens: [] },
        { line: 3, tokens: [{ type: 'text', content: 'line 3', scopes: ['source.js'], line: 3, offset: 0 }] },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(tokensWithEmpty, { lineNumbers: true })

      expect(result.html).toContain('<span class="line-number">1</span>')
      expect(result.html).toContain('<span class="line-number">2</span>')
      expect(result.html).toContain('<span class="line-number">3</span>')
    })
  })

  describe('Advanced Features - Focus Mode', () => {
    it('should render focus lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { focusLines: [2] })

      expect(result.html).toContain('focus')
    })

    it('should render dim lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { dimLines: [1, 3] })

      expect(result.html).toContain('dim')
    })

    it('should handle both focus and dim lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        focusLines: [2],
        dimLines: [1, 3],
      })

      expect(result.html).toContain('focus')
      expect(result.html).toContain('dim')
    })

    it('should handle overlapping focus and dim lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        focusLines: [2],
        dimLines: [2], // Same line
      })

      expect(result.html).toBeDefined()
    })

    it('should handle empty focus/dim arrays', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        focusLines: [],
        dimLines: [],
      })

      expect(result.html).toBeDefined()
    })
  })

  describe('Advanced Features - Diff Highlighting', () => {
    it('should render added lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { addedLines: [1] })

      expect(result.html).toContain('added')
      expect(result.html).toContain('diff-indicator add')
    })

    it('should render removed lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { removedLines: [2] })

      expect(result.html).toContain('removed')
      expect(result.html).toContain('diff-indicator remove')
    })

    it('should handle both added and removed lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        addedLines: [1],
        removedLines: [3],
      })

      expect(result.html).toContain('added')
      expect(result.html).toContain('removed')
    })

    it('should handle conflicting added and removed on same line', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        addedLines: [2],
        removedLines: [2], // Same line
      })

      expect(result.html).toBeDefined()
    })

    it('should handle out-of-bounds line numbers', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        addedLines: [999],
        removedLines: [-1, 0],
      })

      expect(result.html).toBeDefined()
    })
  })

  describe('Advanced Features - Annotations', () => {
    it('should render info annotations', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'Info message', type: 'info' },
        ],
      })

      expect(result.html).toContain('Info message')
      expect(result.html).toContain('annotation')
    })

    it('should render warning annotations', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'Warning!', type: 'warning' },
        ],
      })

      expect(result.html).toContain('Warning!')
    })

    it('should render error annotations', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'Error occurred', type: 'error' },
        ],
      })

      expect(result.html).toContain('Error occurred')
    })

    it('should render success annotations', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'Success!', type: 'success' },
        ],
      })

      expect(result.html).toContain('Success!')
    })

    it('should escape HTML in annotation text', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: '<script>alert("XSS")</script>', type: 'info' },
        ],
      })

      expect(result.html).toContain('&lt;script&gt;')
      expect(result.html).not.toContain('<script>alert')
    })

    it('should handle multiple annotations on same line', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'First', type: 'info' },
          { line: 1, text: 'Second', type: 'warning' },
        ],
      })

      expect(result.html).toContain('First')
      expect(result.html).toContain('Second')
    })

    it('should handle annotations on different lines', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: 'Line 1 note', type: 'info' },
          { line: 2, text: 'Line 2 note', type: 'warning' },
          { line: 3, text: 'Line 3 note', type: 'error' },
        ],
      })

      expect(result.html).toContain('Line 1 note')
      expect(result.html).toContain('Line 2 note')
      expect(result.html).toContain('Line 3 note')
    })

    it('should handle empty annotation text', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        annotations: [
          { line: 1, text: '', type: 'info' },
        ],
      })

      expect(result.html).toBeDefined()
    })
  })

  describe('Advanced Features - Copy Button', () => {
    it('should render copy button when enabled', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, { showCopyButton: true })

      expect(result.html).toContain('copy-button')
    })

    it('should not render copy button by default', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens)

      expect(result.html).not.toContain('copy-button')
    })
  })

  describe('Combined Features', () => {
    it('should handle all features together', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        lineNumbers: true,
        highlightLines: [1],
        focusLines: [2],
        dimLines: [3],
        addedLines: [1],
        removedLines: [3],
        annotations: [
          { line: 2, text: 'Important', type: 'warning' },
        ],
        showCopyButton: true,
      })

      expect(result.html).toContain('line-number')
      expect(result.html).toContain('highlighted')
      expect(result.html).toContain('focus')
      expect(result.html).toContain('dim')
      expect(result.html).toContain('added')
      expect(result.html).toContain('removed')
      expect(result.html).toContain('Important')
      expect(result.html).toContain('copy-button')
    })

    it('should handle line numbers with diff highlighting', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        lineNumbers: true,
        addedLines: [1, 2],
        removedLines: [3],
      })

      expect(result.html).toContain('line-number')
      expect(result.html).toContain('added')
      expect(result.html).toContain('removed')
    })

    it('should handle inline with all features', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiLineTokens, {
        inline: true,
        highlightLines: [1],
        annotations: [{ line: 1, text: 'Note', type: 'info' }],
      })

      expect(result.html).toContain('syntax-inline')
    })
  })

  describe('Theme Variations', () => {
    it('should render with GitHub Light theme', () => {
      const renderer = new Renderer(githubLight)
      const result = renderer.render(mockTokens)

      expect(result.css).toContain(githubLight.colors['editor.background'])
    })

    it('should render with Nord theme', () => {
      const renderer = new Renderer(nord)
      const result = renderer.render(mockTokens)

      expect(result.css).toContain(nord.colors['editor.background'])
    })

    it('should apply different colors across themes', () => {
      const rendererDark = new Renderer(githubDark)
      const rendererLight = new Renderer(githubLight)

      const resultDark = rendererDark.render(mockTokens)
      const resultLight = rendererLight.render(mockTokens)

      // Themes should produce different CSS
      expect(resultDark.css).not.toBe(resultLight.css)
    })
  })

  describe('Token Scope Handling', () => {
    it('should handle tokens with multiple scopes', () => {
      const multiScope: TokenLine[] = [
        {
          line: 1,
          tokens: [
            {
              type: 'keyword',
              content: 'const',
              scopes: ['source.js', 'storage.type.js', 'keyword.declaration.js'],
              line: 1,
              offset: 0,
            },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(multiScope)

      expect(result.html).toContain('const')
    })

    it('should handle tokens with no scopes', () => {
      const noScope: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: 'plain', scopes: [], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(noScope)

      expect(result.html).toContain('plain')
    })

    it('should handle tokens with unknown scopes', () => {
      const unknownScope: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'unknown', content: 'text', scopes: ['unknown.scope.type'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(unknownScope)

      expect(result.html).toContain('text')
    })
  })

  describe('Special Characters', () => {
    it('should handle Unicode characters', () => {
      const unicode: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '你好世界', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(unicode)

      expect(result.html).toContain('你好世界')
    })

    it('should handle emojis', () => {
      const emoji: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '👋🌍🚀', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(emoji)

      expect(result.html).toContain('👋🌍🚀')
    })

    it('should handle RTL characters', () => {
      const rtl: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: 'مرحبا', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(rtl)

      expect(result.html).toContain('مرحبا')
    })

    it('should handle zero-width characters', () => {
      const zeroWidth: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: 'a\u200Bb\u200Bc', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(zeroWidth)

      expect(result.html).toBeDefined()
    })

    it('should handle surrogate pairs', () => {
      const surrogate: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: '𝕳𝖊𝖑𝖑𝖔', scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(surrogate)

      expect(result.html).toContain('𝕳𝖊𝖑𝖑𝖔')
    })
  })

  describe('ANSI Output', () => {
    it('should generate ANSI output', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      expect(result.ansi).toBeDefined()
      expect(result.ansi).toContain('const')
      expect(result.ansi).toContain('42')
    })

    it('should include ANSI color codes', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      // ANSI color codes start with \x1b[
      expect(result.ansi).toMatch(/\x1b\[/)
    })

    it('should reset ANSI codes properly', () => {
      const renderer = new Renderer(githubDark)
      const result = renderer.render(mockTokens)

      // Should contain reset code
      expect(result.ansi).toMatch(/\x1b\[0m/)
    })
  })

  describe('Performance and Large Files', () => {
    it('should handle 100 lines efficiently', () => {
      const manyLines: TokenLine[] = Array.from({ length: 100 }, (_, i) => ({
        line: i + 1,
        tokens: [
          {
            type: 'keyword',
            content: 'const',
            scopes: ['source.js', 'storage.type.js'],
            line: i + 1,
            offset: 0,
          },
          {
            type: 'text',
            content: ` x${i} = ${i};`,
            scopes: ['source.js'],
            line: i + 1,
            offset: 5,
          },
        ],
      }))

      const renderer = new Renderer(githubDark)
      const start = performance.now()
      const result = renderer.render(manyLines, { lineNumbers: true })
      const end = performance.now()

      expect(result.html).toBeDefined()
      expect(end - start).toBeLessThan(100) // Should be very fast
    })

    it('should handle very long lines', () => {
      const longContent = 'a'.repeat(10000)
      const longLine: TokenLine[] = [
        {
          line: 1,
          tokens: [
            { type: 'text', content: longContent, scopes: ['source.js'], line: 1, offset: 0 },
          ],
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(longLine)

      expect(result.html).toContain(longContent)
    })

    it('should handle many tokens per line', () => {
      const manyTokens: TokenLine[] = [
        {
          line: 1,
          tokens: Array.from({ length: 100 }, (_, i) => ({
            type: 'text',
            content: `token${i}`,
            scopes: ['source.js'],
            line: 1,
            offset: i * 10,
          })),
        },
      ]

      const renderer = new Renderer(githubDark)
      const result = renderer.render(manyTokens)

      expect(result.html).toBeDefined()
      expect(result.html).toContain('token0')
      expect(result.html).toContain('token99')
    })
  })
})
