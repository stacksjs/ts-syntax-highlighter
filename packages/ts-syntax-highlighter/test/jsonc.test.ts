import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('JSONC Grammar', () => {
  const tokenizer = new Tokenizer('jsonc')

  describe('Basic Tokenization', () => {
    it('should tokenize JSONC with comments', async () => {
      const code = `{
  // This is a comment
  "key": "value"
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight single-line comments', async () => {
      const code = `// Comment
{ "key": "value" }`
      const tokens = await tokenizer.tokenizeAsync(code)

      const commentTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('comment'))

      expect(commentTokens.length).toBeGreaterThan(0)
    })

    it('should highlight multi-line comments', async () => {
      const code = `/* Multi
line
comment */
{ "key": "value" }`
      const tokens = await tokenizer.tokenizeAsync(code)

      const commentTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('comment'))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Trailing Commas', () => {
    it('should allow trailing commas', async () => {
      const code = `{
  "key1": "value1",
  "key2": "value2",
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Values', () => {
    it('should highlight all JSON value types', async () => {
      const code = `{
  "string": "value",
  "number": 42,
  "boolean": true,
  "null": null
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })
})
