import { describe, expect, it } from 'bun:test'
import { regexpGrammar } from '../src/grammars/regexp'
import { Tokenizer } from '../src/tokenizer'

describe('RegExp Grammar', () => {
  const tokenizer = new Tokenizer(regexpGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize regexp patterns', async () => {
      const code = `[a-z]+@[a-z]+\\.[a-z]{2,4}
^(\\d{3})-\\d{4}$`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
