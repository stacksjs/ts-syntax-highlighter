import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Python Grammar', () => {
  const tokenizer = new Tokenizer('python')

  describe('Basic Tokenization', () => {
    it('should tokenize basic Python code', async () => {
      const code = `def hello():
    print("Hello World")`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Functions and Classes', () => {
    it('should highlight function definitions', async () => {
      const code = `def my_function(param):
    return param * 2`
      const tokens = await tokenizer.tokenizeAsync(code)

      const defTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('storage.type'))

      expect(defTokens.length).toBeGreaterThan(0)
    })

    it('should highlight class definitions', async () => {
      const code = `class MyClass:
    def __init__(self):
        pass`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Strings', () => {
    it('should highlight f-strings', async () => {
      const code = `name = "World"
message = f"Hello {name}"`
      const tokens = await tokenizer.tokenizeAsync(code)

      const stringTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight docstrings', async () => {
      const code = `"""
This is a docstring
"""`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Decorators', () => {
    it('should highlight decorators', async () => {
      const code = `@staticmethod
def my_method():
    pass`
      const tokens = await tokenizer.tokenizeAsync(code)

      const decoratorTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('decorator'))

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const controlTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.control'))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })
})
