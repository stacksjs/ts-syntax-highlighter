import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('IDL Grammar', () => {
  const tokenizer = new Tokenizer('idl')

  describe('Basic Tokenization', () => {
    it('should tokenize basic IDL code', async () => {
      const code = `interface MyInterface {
  void myMethod(in long param);
};`
      const tokens = await tokenizer.tokenizeAsync(code)
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
      const tokens = await tokenizer.tokenizeAsync(code)
      const keywordTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('keyword'))
      expect(keywordTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Type Support', () => {
    it('should highlight types', async () => {
      const code = `interface Test {
  void method(in long x, in double y, in string s);
};`
      const tokens = await tokenizer.tokenizeAsync(code)
      const typeTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('storage.type'))
      expect(typeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Comment
/* Block */
interface Test {};`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
