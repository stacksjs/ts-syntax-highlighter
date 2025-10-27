import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('BNF Grammar', () => {
  const tokenizer = new Tokenizer('bnf')
  describe('Basic Tokenization', () => {
    it('should tokenize BNF code', async () => {
      const code = `<expr> ::= <term> "+" <term>
<term> ::= <number> | "(" <expr> ")"`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
