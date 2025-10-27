import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { abnfGrammar } from '../src/grammars/abnf'
import type { Token, TokenLine } from '../src/types'

describe('ABNF Grammar', () => {
  const tokenizer = new Tokenizer(abnfGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize ABNF rules', async () => {
      const code = `rulename = element1 element2
comment-example = "value" ; comment`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
