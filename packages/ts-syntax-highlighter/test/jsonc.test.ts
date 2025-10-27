import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { jsoncGrammar } from '../src/grammars/jsonc'
import type { Token, TokenLine } from '../src/types'

describe('JSONC Grammar', () => {
  const tokenizer = new Tokenizer(jsoncGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize JSONC with comments', async () => {
      const code = `{
  // This is a comment
  "key": "value"
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight single-line comments', async () => {
      const code = `// Comment
{ "key": "value" }`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })

    it('should highlight multi-line comments', async () => {
      const code = `/* Multi
line
comment */
{ "key": "value" }`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Trailing Commas', () => {
    it('should allow trailing commas', async () => {
      const code = `{
  "key1": "value1",
  "key2": "value2",
}`
      const tokens = tokenizer.tokenize(code)

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
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
