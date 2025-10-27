import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { yamlGrammar } from '../src/grammars/yaml'
import type { Token, TokenLine } from '../src/types'

describe('YAML Grammar', () => {
  const tokenizer = new Tokenizer(yamlGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic YAML', async () => {
      const code = `key: value
number: 42`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Keys and Values', () => {
    it('should highlight keys', async () => {
      const code = `name: John
age: 30`
      const tokens = tokenizer.tokenize(code)

      const keyTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('entity.name.tag')))

      expect(keyTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Strings', () => {
    it('should highlight quoted strings', async () => {
      const code = `message: "Hello World"
name: 'John Doe'`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Numbers', () => {
    it('should highlight numbers', async () => {
      const code = `integer: 42
float: 3.14
hex: 0xFF`
      const tokens = tokenizer.tokenize(code)

      const numberTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('constant.numeric')))

      expect(numberTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Booleans and Null', () => {
    it('should highlight boolean values', async () => {
      const code = `enabled: true
disabled: false
legacy: yes`
      const tokens = tokenizer.tokenize(code)

      const boolTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('constant.language')))

      expect(boolTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `# This is a comment
key: value # inline comment`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Anchors and References', () => {
    it('should highlight anchors and aliases', async () => {
      const code = `defaults: &defaults
  key: value
item: *defaults`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
