import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { cmdGrammar } from '../src/grammars/cmd'
import type { Token, TokenLine } from '../src/types'

describe('CMD Grammar', () => {
  const tokenizer = new Tokenizer(cmdGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize batch file code', async () => {
      const code = `@echo off
set NAME=World
echo Hello %NAME%`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `set VAR=value
echo %VAR%`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `REM This is a comment
:: This is also a comment`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
