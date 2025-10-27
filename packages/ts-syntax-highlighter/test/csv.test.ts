import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { csvGrammar } from '../src/grammars/csv'
import type { Token, TokenLine } from '../src/types'

describe('CSV Grammar', () => {
  const tokenizer = new Tokenizer(csvGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize CSV data', async () => {
      const code = `Name,Age,City
"John Doe",30,"New York"
"Jane Smith",25,Boston`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
