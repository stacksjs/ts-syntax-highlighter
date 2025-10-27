import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Lua Grammar', () => {
  const tokenizer = new Tokenizer('lua')
  describe('Basic Tokenization', () => {
    it('should tokenize Lua code', async () => {
      const code = `function greet(name)
  print("Hello " .. name)
end
greet("World")`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Tables', () => {
    it('should handle tables', async () => {
      const code = `local t = {a = 1, b = 2, c = 3}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
