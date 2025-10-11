import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import {
  applyLineTransformers,
  applyTokenTransformers,
  createBlurTransformer,
  createDiffTransformer,
  createEmphasisTransformer,
  createFocusTransformer,
  createLinkTransformer,
  createTokenHighlighter,
} from '../src/transformers'

describe('Transformers and Plugins', () => {
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
          content: ' x = 42;',
          scopes: ['source.js'],
          line: 1,
          offset: 5,
        },
      ],
    },
    {
      line: 2,
      tokens: [
        {
          type: 'keyword',
          content: 'const',
          scopes: ['source.js', 'storage.type.js'],
          line: 2,
          offset: 0,
        },
        {
          type: 'text',
          content: ' y = 100;',
          scopes: ['source.js'],
          line: 2,
          offset: 5,
        },
      ],
    },
  ]

  describe('Focus Transformer', () => {
    it('should create focus transformer for specific lines', () => {
      const { lineTransformer, tokenTransformer } = createFocusTransformer([2])

      expect(lineTransformer.name).toBe('focus')
      expect(tokenTransformer.name).toBe('focus-tokens')
    })

    it('should add focus class to focused lines', () => {
      const { lineTransformer } = createFocusTransformer([2])
      const line1 = '<span class="line">test</span>'
      const line2 = '<span class="line">test</span>'

      const result1 = lineTransformer.transform(line1, 1)
      const result2 = lineTransformer.transform(line2, 2)

      expect(result1).toContain('dim')
      expect(result2).toContain('focus')
    })

    it('should mark tokens as dimmed when not in focus', () => {
      const { tokenTransformer } = createFocusTransformer([2])
      const token1: Token = {
        type: 'text',
        content: 'test',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldDim = tokenTransformer.shouldTransform(token1)
      const transformed = tokenTransformer.transform(token1)

      expect(shouldDim).toBe(true)
      expect(transformed.dimmed).toBe(true)
    })

    it('should not dim tokens in focus lines', () => {
      const { tokenTransformer } = createFocusTransformer([2])
      const token2: Token = {
        type: 'text',
        content: 'test',
        scopes: [],
        line: 2,
        offset: 0,
      }

      const shouldDim = tokenTransformer.shouldTransform(token2)

      expect(shouldDim).toBe(false)
    })

    it('should handle empty focus lines array', () => {
      const { lineTransformer } = createFocusTransformer([])
      const line = '<span class="line">test</span>'

      const result = lineTransformer.transform(line, 1)

      // All lines should be dimmed
      expect(result).toContain('dim')
    })

    it('should handle multiple focus lines', () => {
      const { lineTransformer } = createFocusTransformer([1, 3, 5])

      const line1 = '<span class="line">test</span>'
      const line2 = '<span class="line">test</span>'
      const line3 = '<span class="line">test</span>'

      expect(lineTransformer.transform(line1, 1)).toContain('focus')
      expect(lineTransformer.transform(line2, 2)).toContain('dim')
      expect(lineTransformer.transform(line3, 3)).toContain('focus')
    })
  })

  describe('Diff Transformer', () => {
    it('should create diff transformer', () => {
      const transformer = createDiffTransformer([1], [2])

      expect(transformer.name).toBe('diff')
    })

    it('should add added class and + indicator', () => {
      const transformer = createDiffTransformer([1], [])
      const line = '<span class="line">test</span>'

      const result = transformer.transform(line, 1)

      expect(result).toContain('added')
      expect(result).toContain('+')
    })

    it('should add removed class and - indicator', () => {
      const transformer = createDiffTransformer([], [2])
      const line = '<span class="line">test</span>'

      const result = transformer.transform(line, 2)

      expect(result).toContain('removed')
      expect(result).toContain('-')
    })

    it('should not modify lines not in added or removed', () => {
      const transformer = createDiffTransformer([1], [2])
      const line = '<span class="line">test</span>'

      const result = transformer.transform(line, 3)

      expect(result).not.toContain('added')
      expect(result).not.toContain('removed')
    })

    it('should handle empty arrays', () => {
      const transformer = createDiffTransformer([], [])
      const line = '<span class="line">test</span>'

      const result = transformer.transform(line, 1)

      expect(result).toBe(line)
    })

    it('should handle overlapping added and removed lines', () => {
      const transformer = createDiffTransformer([1], [1])
      const line = '<span class="line">test</span>'

      // Added check happens first in the code
      const result = transformer.transform(line, 1)

      expect(result).toContain('added') // Added check comes first
    })
  })

  describe('Blur Transformer', () => {
    it('should create blur transformer', () => {
      const transformer = createBlurTransformer(token => token.content.includes('secret'))

      expect(transformer.name).toBe('blur')
    })

    it('should blur tokens matching predicate', () => {
      const transformer = createBlurTransformer(token => token.content.includes('secret'))
      const token: Token = {
        type: 'text',
        content: 'secret_key',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldBlur = transformer.shouldTransform(token)
      const transformed = transformer.transform(token)

      expect(shouldBlur).toBe(true)
      expect(transformed.blurred).toBe(true)
    })

    it('should not blur tokens not matching predicate', () => {
      const transformer = createBlurTransformer(token => token.content.includes('secret'))
      const token: Token = {
        type: 'text',
        content: 'public_data',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldBlur = transformer.shouldTransform(token)

      expect(shouldBlur).toBe(false)
    })

    it('should blur API keys pattern', () => {
      const transformer = createBlurTransformer(token => /sk-[a-z0-9]+/i.test(token.content))
      const apiKeyToken: Token = {
        type: 'text',
        content: 'sk-abc123',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldBlur = transformer.shouldTransform(apiKeyToken)
      const transformed = transformer.transform(apiKeyToken)

      expect(shouldBlur).toBe(true)
      expect(transformed.blurred).toBe(true)
    })

    it('should blur password tokens', () => {
      const transformer = createBlurTransformer(token =>
        token.scopes.some(s => s.includes('password')),
      )
      const passwordToken: Token = {
        type: 'text',
        content: 'myPassword123',
        scopes: ['password.js'],
        line: 1,
        offset: 0,
      }

      expect(transformer.shouldTransform(passwordToken)).toBe(true)
      expect(transformer.transform(passwordToken).blurred).toBe(true)
    })
  })

  describe('Link Transformer', () => {
    it('should create link transformer', () => {
      const transformer = createLinkTransformer()

      expect(transformer.name).toBe('link')
    })

    it('should detect HTTP URLs', () => {
      const transformer = createLinkTransformer()
      const token: Token = {
        type: 'text',
        content: 'http://example.com',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldLink = transformer.shouldTransform(token)
      const transformed = transformer.transform(token)

      expect(shouldLink).toBe(true)
      expect(transformed.link).toBe('http://example.com')
    })

    it('should detect HTTPS URLs', () => {
      const transformer = createLinkTransformer()
      const token: Token = {
        type: 'text',
        content: 'https://example.com/path',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldLink = transformer.shouldTransform(token)
      const transformed = transformer.transform(token)

      expect(shouldLink).toBe(true)
      expect(transformed.link).toBe('https://example.com/path')
    })

    it('should not detect non-URLs', () => {
      const transformer = createLinkTransformer()
      const token: Token = {
        type: 'text',
        content: 'just text',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldLink = transformer.shouldTransform(token)

      expect(shouldLink).toBe(false)
    })

    it('should handle URLs with query parameters', () => {
      const transformer = createLinkTransformer()
      const token: Token = {
        type: 'text',
        content: 'https://example.com?foo=bar&baz=qux',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const transformed = transformer.transform(token)

      expect(transformed.link).toBe('https://example.com?foo=bar&baz=qux')
    })
  })

  describe('Token Highlighter', () => {
    it('should create token highlighter', () => {
      const transformer = createTokenHighlighter(token => token.type === 'keyword')

      expect(transformer.name).toBe('token-highlight')
    })

    it('should highlight tokens matching predicate', () => {
      const transformer = createTokenHighlighter(token => token.type === 'keyword', '#ffff00')
      const token: Token = {
        type: 'keyword',
        content: 'const',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldHighlight = transformer.shouldTransform(token)
      const transformed = transformer.transform(token)

      expect(shouldHighlight).toBe(true)
      expect(transformed.highlighted).toBe(true)
      expect(transformed.highlightColor).toBe('#ffff00')
    })

    it('should not highlight tokens not matching predicate', () => {
      const transformer = createTokenHighlighter(token => token.type === 'keyword')
      const token: Token = {
        type: 'text',
        content: 'hello',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldHighlight = transformer.shouldTransform(token)

      expect(shouldHighlight).toBe(false)
    })

    it('should highlight by content', () => {
      const transformer = createTokenHighlighter(token => token.content === 'TODO')
      const todoToken: Token = {
        type: 'text',
        content: 'TODO',
        scopes: [],
        line: 1,
        offset: 0,
      }

      expect(transformer.shouldTransform(todoToken)).toBe(true)
      expect(transformer.transform(todoToken).highlighted).toBe(true)
    })

    it('should highlight by scope', () => {
      const transformer = createTokenHighlighter(token =>
        token.scopes.some(s => s.includes('error')),
      )
      const errorToken: Token = {
        type: 'text',
        content: 'error',
        scopes: ['error.js'],
        line: 1,
        offset: 0,
      }

      expect(transformer.shouldTransform(errorToken)).toBe(true)
    })
  })

  describe('Emphasis Transformer', () => {
    it('should create emphasis transformer', () => {
      const transformer = createEmphasisTransformer(token => token.type === 'keyword')

      expect(transformer.name).toBe('emphasis')
    })

    it('should emphasize tokens matching predicate', () => {
      const transformer = createEmphasisTransformer(token => token.content.includes('important'))
      const token: Token = {
        type: 'text',
        content: 'important_function',
        scopes: [],
        line: 1,
        offset: 0,
      }

      const shouldEmphasize = transformer.shouldTransform(token)
      const transformed = transformer.transform(token)

      expect(shouldEmphasize).toBe(true)
      expect(transformed.emphasized).toBe(true)
    })

    it('should not emphasize tokens not matching predicate', () => {
      const transformer = createEmphasisTransformer(token => token.content.includes('important'))
      const token: Token = {
        type: 'text',
        content: 'normal',
        scopes: [],
        line: 1,
        offset: 0,
      }

      expect(transformer.shouldTransform(token)).toBe(false)
    })
  })

  describe('Apply Token Transformers', () => {
    it('should apply single transformer to all tokens', () => {
      const transformer = createBlurTransformer(token => token.content.includes('42'))
      const result = applyTokenTransformers(mockTokens, [transformer])

      expect(result[0].tokens[1].blurred).toBe(true) // ' x = 42;' contains 42
    })

    it('should apply multiple transformers in order', () => {
      const blur = createBlurTransformer(token => token.content.includes('42'))
      const highlight = createTokenHighlighter(token => token.type === 'keyword', '#ff0000')

      const result = applyTokenTransformers(mockTokens, [blur, highlight])

      // First token (keyword) should be highlighted
      expect(result[0].tokens[0].highlighted).toBe(true)
      // Second token (contains 42) should be blurred
      expect(result[0].tokens[1].blurred).toBe(true)
    })

    it('should handle empty transformers array', () => {
      const result = applyTokenTransformers(mockTokens, [])

      expect(result).toEqual(mockTokens)
    })

    it('should not modify original tokens', () => {
      const original = JSON.parse(JSON.stringify(mockTokens))
      const transformer = createBlurTransformer(() => true)

      applyTokenTransformers(mockTokens, [transformer])

      expect(mockTokens).toEqual(original)
    })

    it('should apply transformers to all lines', () => {
      const transformer = createTokenHighlighter(() => true, '#fff')
      const result = applyTokenTransformers(mockTokens, [transformer])

      result.forEach((line) => {
        line.tokens.forEach((token) => {
          expect(token.highlighted).toBe(true)
        })
      })
    })
  })

  describe('Apply Line Transformers', () => {
    const mockHtml = `<span class="line">line 1</span>
<span class="line">line 2</span>
<span class="line">line 3</span>`

    it('should apply single line transformer', () => {
      const transformer = createDiffTransformer([1], [])
      const result = applyLineTransformers(mockHtml, [transformer])

      expect(result).toContain('added')
    })

    it('should apply multiple line transformers in order', () => {
      const diff = createDiffTransformer([1], [3])
      const { lineTransformer: focus } = createFocusTransformer([2])

      const result = applyLineTransformers(mockHtml, [diff, focus])

      expect(result).toContain('added')
      expect(result).toContain('removed')
      expect(result).toContain('focus')
    })

    it('should handle empty transformers array', () => {
      const result = applyLineTransformers(mockHtml, [])

      expect(result).toBe(mockHtml)
    })

    it('should preserve line count', () => {
      const transformer = createDiffTransformer([1], [2])
      const result = applyLineTransformers(mockHtml, [transformer])

      const originalLines = mockHtml.split('\n').length
      const resultLines = result.split('\n').length

      expect(resultLines).toBe(originalLines)
    })
  })

  describe('Complex Transformer Combinations', () => {
    it('should combine focus and diff transformers', () => {
      const diff = createDiffTransformer([1], [3])
      const { lineTransformer: focus } = createFocusTransformer([2])

      const html = `<span class="line">line 1</span>
<span class="line">line 2</span>
<span class="line">line 3</span>`

      const result = applyLineTransformers(html, [diff, focus])

      expect(result).toContain('added') // Line 1
      expect(result).toContain('removed') // Line 3
      expect(result).toContain('focus') // Line 2
    })

    it('should combine blur and highlight transformers', () => {
      const blur = createBlurTransformer(token => token.content.includes('secret'))
      const highlight = createTokenHighlighter(token => token.type === 'keyword')

      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            {
              type: 'keyword',
              content: 'const',
              scopes: [],
              line: 1,
              offset: 0,
            },
            {
              type: 'text',
              content: 'secret_key',
              scopes: [],
              line: 1,
              offset: 6,
            },
          ],
        },
      ]

      const result = applyTokenTransformers(tokens, [blur, highlight])

      expect(result[0].tokens[0].highlighted).toBe(true)
      expect(result[0].tokens[1].blurred).toBe(true)
    })

    it('should handle many transformers', () => {
      const transformers = [
        createBlurTransformer(() => false),
        createTokenHighlighter(() => false),
        createEmphasisTransformer(() => false),
        createLinkTransformer(),
      ]

      const result = applyTokenTransformers(mockTokens, transformers)

      expect(result).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty token arrays', () => {
      const transformer = createBlurTransformer(() => true)
      const result = applyTokenTransformers([], [transformer])

      expect(result).toEqual([])
    })

    it('should handle tokens with no content', () => {
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            {
              type: 'text',
              content: '',
              scopes: [],
              line: 1,
              offset: 0,
            },
          ],
        },
      ]

      const transformer = createBlurTransformer(() => true)
      const result = applyTokenTransformers(tokens, [transformer])

      expect(result[0].tokens[0].blurred).toBe(true)
    })

    it('should handle very long token content', () => {
      const longContent = 'a'.repeat(10000)
      const tokens: TokenLine[] = [
        {
          line: 1,
          tokens: [
            {
              type: 'text',
              content: longContent,
              scopes: [],
              line: 1,
              offset: 0,
            },
          ],
        },
      ]

      const transformer = createBlurTransformer(token => token.content.length > 5000)
      const result = applyTokenTransformers(tokens, [transformer])

      expect(result[0].tokens[0].blurred).toBe(true)
    })

    it('should handle tokens with many scopes', () => {
      const token: Token = {
        type: 'text',
        content: 'test',
        scopes: Array.from({ length: 100 }, (_, i) => `scope${i}`),
        line: 1,
        offset: 0,
      }

      const transformer = createTokenHighlighter(t =>
        t.scopes.includes('scope50'),
      )

      expect(transformer.shouldTransform(token)).toBe(true)
    })

    it('should handle transformers with complex predicates', () => {
      const transformer = createBlurTransformer((token) => {
        const hasSecret = token.content.toLowerCase().includes('secret')
        const hasKey = token.content.toLowerCase().includes('key')
        const hasPassword = token.scopes.some(s => s.includes('password'))
        return hasSecret || hasKey || hasPassword
      })

      const secretToken: Token = {
        type: 'text',
        content: 'SECRET_API_KEY',
        scopes: [],
        line: 1,
        offset: 0,
      }

      expect(transformer.shouldTransform(secretToken)).toBe(true)
    })
  })
})
