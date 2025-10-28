import { describe, expect, it } from 'bun:test'
import { abnfGrammar } from '../src/grammars/abnf'
import { Tokenizer } from '../src/tokenizer'

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
