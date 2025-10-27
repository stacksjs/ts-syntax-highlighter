import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { latexGrammar } from '../src/grammars/latex'
import type { Token, TokenLine } from '../src/types'

describe('LaTeX Grammar', () => {
  const tokenizer = new Tokenizer(latexGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize LaTeX code', async () => {
      const code = `\\documentclass{article}
\\begin{document}
Hello World
\\end{document}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Math Mode', () => {
    it('should highlight math expressions', async () => {
      const code = `Inline math: $x^2 + y^2 = z^2$
Display math: $$\\int_0^\\infty e^{-x} dx$$`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `% This is a comment
\\section{Title} % inline comment`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
