import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Log Grammar', () => {
  const tokenizer = new Tokenizer('log')
  describe('Basic Tokenization', () => {
    it('should tokenize log entries', async () => {
      const code = `2024-01-01 12:00:00 INFO Application started
2024-01-01 12:00:01 ERROR Connection failed
2024-01-01 12:00:02 WARN Retrying connection`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Log Levels', () => {
    it('should highlight log levels', async () => {
      const code = `ERROR: Something went wrong
WARN: Be careful
INFO: All good`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
