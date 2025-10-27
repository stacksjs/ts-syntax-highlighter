import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('XML Grammar', () => {
  const tokenizer = new Tokenizer('xml')
  describe('Basic Tokenization', () => {
    it('should tokenize XML code', async () => {
      const code = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <element attribute="value">Text</element>
</root>`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('CDATA', () => {
    it('should highlight CDATA sections', async () => {
      const code = `<data><![CDATA[Some <special> content]]></data>`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `<!-- This is a comment -->`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
