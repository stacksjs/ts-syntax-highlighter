import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { bnfGrammar } from '../src/grammars/bnf'
import type { Token, TokenLine } from '../src/types'

describe('BNF Grammar', () => {
  const tokenizer = new Tokenizer(bnfGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize BNF code', async () => {
      const code = `<expr> ::= <term> "+" <term>
<term> ::= <number> | "(" <expr> ")"`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
