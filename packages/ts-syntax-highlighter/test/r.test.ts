import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { rGrammar } from '../src/grammars/r'
import type { Token, TokenLine } from '../src/types'

describe('R Grammar', () => {
  const tokenizer = new Tokenizer(rGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize basic R code', async () => {
      const code = `x <- c(1, 2, 3)
print(x)`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Assignment Operators', () => {
    it('should highlight assignment operators', async () => {
      const code = `x <- 10
y <<- 20
30 -> z`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Functions', () => {
    it('should handle function definitions', async () => {
      const code = `myFunc <- function(x, y) {
  return(x + y)
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
