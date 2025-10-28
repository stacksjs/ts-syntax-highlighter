import { describe, expect, it } from 'bun:test'
import { luaGrammar } from '../src/grammars/lua'
import { Tokenizer } from '../src/tokenizer'

describe('Lua Grammar', () => {
  const tokenizer = new Tokenizer(luaGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize Lua code', async () => {
      const code = `function greet(name)
  print("Hello " .. name)
end
greet("World")`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Tables', () => {
    it('should handle tables', async () => {
      const code = `local t = {a = 1, b = 2, c = 3}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
