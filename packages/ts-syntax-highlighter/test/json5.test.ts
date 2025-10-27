import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('JSON5 Grammar', () => {
  const tokenizer = new Tokenizer('json5')

  describe('Basic Tokenization', () => {
    it('should tokenize JSON5 code', async () => {
      const code = `{
  name: 'John',
  age: 30,
  // Comment
  active: true,
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Unquoted Keys', () => {
    it('should handle unquoted keys', async () => {
      const code = `{
  unquoted: 'value',
  $identifier: true,
  _private: 123
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `{
  // Single line
  /* Multi
     line */
  key: 'value'
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Extended Values', () => {
    it('should handle special values', async () => {
      const code = `{
  infinity: Infinity,
  notANumber: NaN,
  hex: 0xFF,
  trailing: [1, 2, 3,],
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
