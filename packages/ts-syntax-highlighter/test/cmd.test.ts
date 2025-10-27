import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('CMD Grammar', () => {
  const tokenizer = new Tokenizer('cmd')
  describe('Basic Tokenization', () => {
    it('should tokenize batch file code', async () => {
      const code = `@echo off
set NAME=World
echo Hello %NAME%`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `set VAR=value
echo %VAR%`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `REM This is a comment
:: This is also a comment`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
