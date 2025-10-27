import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { kotlinGrammar } from '../src/grammars/kotlin'
import type { Token, TokenLine } from '../src/types'

describe('Kotlin Grammar', () => {
  const tokenizer = new Tokenizer(kotlinGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize basic Kotlin code', async () => {
      const code = `fun main() {
    println("Hello World")
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })
  describe('Data Classes', () => {
    it('should highlight data classes', async () => {
      const code = `data class Person(val name: String, val age: Int)`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('String Interpolation', () => {
    it('should highlight string templates', async () => {
      const code = `val name = "World"
val greeting = "Hello \$name"
val complex = "Result: \${x + y}"`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Comment
/* Block */`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
