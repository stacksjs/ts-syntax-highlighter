import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('CSV Grammar', () => {
  const tokenizer = new Tokenizer('csv')
  describe('Basic Tokenization', () => {
    it('should tokenize CSV data', async () => {
      const code = `Name,Age,City
"John Doe",30,"New York"
"Jane Smith",25,Boston`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
