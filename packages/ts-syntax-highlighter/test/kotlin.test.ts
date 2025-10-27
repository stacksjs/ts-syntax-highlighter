import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Kotlin Grammar', () => {
  const tokenizer = new Tokenizer('kotlin')
  describe('Basic Tokenization', () => {
    it('should tokenize basic Kotlin code', async () => {
      const code = `fun main() {
    println("Hello World")
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })
  describe('Data Classes', () => {
    it('should highlight data classes', async () => {
      const code = `data class Person(val name: String, val age: Int)`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('String Interpolation', () => {
    it('should highlight string templates', async () => {
      const code = `val name = "World"
val greeting = "Hello \$name"
val complex = "Result: \${x + y}"`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Comment
/* Block */`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
