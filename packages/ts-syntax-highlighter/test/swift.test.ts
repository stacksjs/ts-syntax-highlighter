import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Swift Grammar', () => {
  const tokenizer = new Tokenizer('swift')
  describe('Basic Tokenization', () => {
    it('should tokenize basic Swift code', async () => {
      const code = `import Foundation
print("Hello World")`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Optionals', () => {
    it('should handle optionals', async () => {
      const code = `var name: String? = nil
if let unwrapped = name {
    print(unwrapped)
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('String Interpolation', () => {
    it('should highlight string interpolation', async () => {
      const code = `let name = "World"
let greeting = "Hello \\(name)"`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
