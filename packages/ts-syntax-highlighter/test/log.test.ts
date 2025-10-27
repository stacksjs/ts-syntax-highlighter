import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { logGrammar } from '../src/grammars/log'
import type { Token, TokenLine } from '../src/types'

describe('Log Grammar', () => {
  const tokenizer = new Tokenizer(logGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize log entries', async () => {
      const code = `2024-01-01 12:00:00 INFO Application started
2024-01-01 12:00:01 ERROR Connection failed
2024-01-01 12:00:02 WARN Retrying connection`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Log Levels', () => {
    it('should highlight log levels', async () => {
      const code = `ERROR: Something went wrong
WARN: Be careful
INFO: All good`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
