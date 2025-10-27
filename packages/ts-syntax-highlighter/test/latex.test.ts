import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('LaTeX Grammar', () => {
  const tokenizer = new Tokenizer('latex')
  describe('Basic Tokenization', () => {
    it('should tokenize LaTeX code', async () => {
      const code = `\\documentclass{article}
\\begin{document}
Hello World
\\end{document}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Math Mode', () => {
    it('should highlight math expressions', async () => {
      const code = `Inline math: $x^2 + y^2 = z^2$
Display math: $$\\int_0^\\infty e^{-x} dx$$`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `% This is a comment
\\section{Title} % inline comment`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
