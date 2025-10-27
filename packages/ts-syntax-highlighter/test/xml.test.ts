import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { xmlGrammar } from '../src/grammars/xml'
import type { Token, TokenLine } from '../src/types'

describe('XML Grammar', () => {
  const tokenizer = new Tokenizer(xmlGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize XML code', async () => {
      const code = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <element attribute="value">Text</element>
</root>`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('CDATA', () => {
    it('should highlight CDATA sections', async () => {
      const code = `<data><![CDATA[Some <special> content]]></data>`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `<!-- This is a comment -->`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
