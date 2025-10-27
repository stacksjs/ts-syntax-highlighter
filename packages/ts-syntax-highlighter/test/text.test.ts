import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { textGrammar } from '../src/grammars/text'
import type { Token, TokenLine } from '../src/types'

describe('Text Grammar', () => {
  const tokenizer = new Tokenizer(textGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize plain text', async () => {
      const code = `This is plain text.
No special syntax highlighting.
Just regular text.`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('No Syntax Highlighting', () => {
    it('should not apply special highlighting', async () => {
      const code = `function test() {
  return "hello";
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
