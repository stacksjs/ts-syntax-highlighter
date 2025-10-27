import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('ABNF Grammar', () => {
  const tokenizer = new Tokenizer('abnf')
  describe('Basic Tokenization', () => {
    it('should tokenize ABNF rules', async () => {
      const code = `rulename = element1 element2
comment-example = "value" ; comment`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
