import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { idlGrammar } from '../src/grammars/idl'
import { Tokenizer } from '../src/tokenizer'

describe('IDL Grammar', () => {
  const tokenizer = new Tokenizer(idlGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic IDL code', async () => {
      const code = `interface MyInterface {
  void myMethod(in long param);
};`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Interface Support', () => {
    it('should highlight interfaces', async () => {
      const code = `interface Example {
  attribute long value;
  readonly attribute string name;
};`
      const tokens = tokenizer.tokenize(code)
      const keywordTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword')))
      expect(keywordTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Type Support', () => {
    it('should highlight types', async () => {
      const code = `interface Test {
  void method(in long x, in double y, in string s);
};`
      const tokens = tokenizer.tokenize(code)
      const typeTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))
      expect(typeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Comment
/* Block */
interface Test {};`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
