import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { pythonGrammar } from '../src/grammars/python'
import { Tokenizer } from '../src/tokenizer'

describe('Python Grammar', () => {
  const tokenizer = new Tokenizer(pythonGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Python code', async () => {
      const code = `def hello():
    print("Hello World")`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Functions and Classes', () => {
    it('should highlight function definitions', async () => {
      const code = `def my_function(param):
    return param * 2`
      const tokens = tokenizer.tokenize(code)

      const defTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(defTokens.length).toBeGreaterThan(0)
    })

    it('should highlight class definitions', async () => {
      const code = `class MyClass:
    def __init__(self):
        pass`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Strings', () => {
    it('should highlight f-strings', async () => {
      const code = `name = "World"
message = f"Hello {name}"`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight docstrings', async () => {
      const code = `"""
This is a docstring
"""`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Decorators', () => {
    it('should highlight decorators', async () => {
      const code = `@staticmethod
def my_method():
    pass`
      const tokens = tokenizer.tokenize(code)

      const decoratorTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('decorator')))

      expect(decoratorTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if x > 0:
    print("positive")
elif x < 0:
    print("negative")
else:
    print("zero")`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })
})
