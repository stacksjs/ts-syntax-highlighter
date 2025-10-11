import { describe, expect, it } from 'bun:test'
import { cssGrammar } from '../src/grammars/css'
import { javascriptGrammar } from '../src/grammars/javascript'
import { typescriptGrammar } from '../src/grammars/typescript'
import { Tokenizer } from '../src/tokenizer'

describe('Tokenizer', () => {
  describe('Basic Tokenization', () => {
    it('should tokenize simple JavaScript code', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 42;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize multi-line code', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1;\nconst y = 2;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(2)
      expect(tokens[0].line).toBe(1)
      expect(tokens[1].line).toBe(2)
    })

    it('should handle empty input', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const tokens = tokenizer.tokenize('')

      expect(tokens).toBeDefined()
      expect(tokens.length).toBe(1)
      expect(tokens[0].tokens.length).toBe(0)
    })

    it('should handle whitespace-only input', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const tokens = tokenizer.tokenize('   \n  \n   ')

      expect(tokens).toBeDefined()
      expect(tokens.length).toBe(3)
    })

    it('should handle very long lines', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const longLine = `const x = ${'"a"'.repeat(1000)};`
      const tokens = tokenizer.tokenize(longLine)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBe(1)
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Tokenization', () => {
    it('should tokenize double-quoted strings', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const str = "hello world";'
      const tokens = tokenizer.tokenize(code)

      const hasString = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('string')),
      )
      expect(hasString).toBe(true)
    })

    it('should tokenize single-quoted strings', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const str = \'hello world\';'
      const tokens = tokenizer.tokenize(code)

      const hasString = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('string')),
      )
      expect(hasString).toBe(true)
    })

    it('should handle escaped quotes in strings', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const str = "He said \\"Hello\\"";'
      const tokens = tokenizer.tokenize(code)

      const hasString = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('string')),
      )
      expect(hasString).toBe(true)
    })

    it('should tokenize template literals', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      // eslint-disable-next-line no-template-curly-in-string
      const code = 'const msg = `Hello ${name}`;'
      const tokens = tokenizer.tokenize(code)

      const hasTemplate = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('template')),
      )
      expect(hasTemplate).toBe(true)
    })

    it('should handle empty strings', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const str = "";'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle strings with special characters', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const str = "\\n\\t\\r\\\\";'
      const tokens = tokenizer.tokenize(code)

      const hasString = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('string')),
      )
      expect(hasString).toBe(true)
    })

    it('should handle multi-line template literals', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = '`Line 1\nLine 2\nLine 3`'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(3)
    })
  })

  describe('Comment Tokenization', () => {
    it('should tokenize single-line comments', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = '// This is a comment'
      const tokens = tokenizer.tokenize(code)

      const hasComment = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('comment')),
      )
      expect(hasComment).toBe(true)
    })

    it('should tokenize block comments', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = '/* This is a comment */'
      const tokens = tokenizer.tokenize(code)

      const hasComment = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('comment')),
      )
      expect(hasComment).toBe(true)
    })

    it('should handle multi-line block comments', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = '/*\nLine 1\nLine 2\n*/'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(4)
    })

    it('should handle comments at end of line', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1; // comment'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle empty comments', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = '//'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Number Tokenization', () => {
    it('should tokenize integers', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 42;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })

    it('should tokenize floats', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 3.14;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })

    it('should tokenize hex numbers', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 0xFF;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })

    it('should tokenize binary numbers', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 0b1010;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })

    it('should tokenize octal numbers', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 0o77;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })

    it('should tokenize scientific notation', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1.5e10;'
      const tokens = tokenizer.tokenize(code)

      const hasNumber = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('numeric')),
      )
      expect(hasNumber).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty lines', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1;\n\nconst y = 2;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(3)
      expect(tokens[1].tokens.length).toBe(0)
    })

    it('should handle lines with only spaces', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1;\n    \nconst y = 2;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(3)
    })

    it('should handle mixed line endings (CRLF and LF)', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = 1;\r\nconst y = 2;\nconst z = 3;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBeGreaterThan(1)
    })

    it('should handle Unicode characters', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const 你好 = "世界";'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle emojis in strings', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const msg = "Hello 👋🌍";'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle deeply nested structures', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const obj = {a: {b: {c: {d: {e: 1}}}}};'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle extremely long identifiers', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const longName = 'a'.repeat(1000)
      const code = `const ${longName} = 1;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle malformed code gracefully', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const code = 'const x = {'
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('TypeScript-Specific Features', () => {
    it('should tokenize type annotations', () => {
      const tokenizer = new Tokenizer(typescriptGrammar)
      const code = 'const x: number = 42;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize interfaces', () => {
      const tokenizer = new Tokenizer(typescriptGrammar)
      const code = 'interface User { name: string; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize generics', () => {
      const tokenizer = new Tokenizer(typescriptGrammar)
      const code = 'function id<T>(x: T): T { return x; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle type assertions', () => {
      const tokenizer = new Tokenizer(typescriptGrammar)
      const code = 'const x = value as string;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle union types', () => {
      const tokenizer = new Tokenizer(typescriptGrammar)
      const code = 'type Value = string | number;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('CSS-Specific Features', () => {
    it('should tokenize class selectors', () => {
      const tokenizer = new Tokenizer(cssGrammar)
      const code = '.container { display: flex; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize ID selectors', () => {
      const tokenizer = new Tokenizer(cssGrammar)
      const code = '#main { width: 100%; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize hex colors', () => {
      const tokenizer = new Tokenizer(cssGrammar)
      const code = 'color: #ff0000;'
      const tokens = tokenizer.tokenize(code)

      // Just verify it tokenizes hex values
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
      expect(tokens[0].tokens.some(t => t.content.includes('#ff0000'))).toBe(true)
    })

    it('should tokenize CSS functions', () => {
      const tokenizer = new Tokenizer(cssGrammar)
      const code = 'background: rgb(255, 0, 0);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle CSS comments', () => {
      const tokenizer = new Tokenizer(cssGrammar)
      const code = '/* Comment */ color: red;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Performance and Memory', () => {
    it('should handle 1000 lines efficiently', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const lines = Array.from({ length: 1000 }, (_, i) => `const x${i} = ${i};`)
      const code = lines.join('\n')

      const start = performance.now()
      const tokens = tokenizer.tokenize(code)
      const end = performance.now()

      expect(tokens.length).toBe(1000)
      expect(end - start).toBeLessThan(1000) // Should finish in < 1 second
    })

    it('should reuse tokenizer instance efficiently', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)

      for (let i = 0; i < 100; i++) {
        const tokens = tokenizer.tokenize(`const x${i} = ${i};`)
        expect(tokens).toBeDefined()
      }
    })

    it('should handle rapid consecutive tokenizations', () => {
      const tokenizer = new Tokenizer(javascriptGrammar)
      const codes = [
        'const x = 1;',
        'function test() {}',
        'class MyClass {}',
        'const arr = [1, 2, 3];',
      ]

      codes.forEach((code) => {
        const tokens = tokenizer.tokenize(code)
        expect(tokens).toBeDefined()
      })
    })
  })
})
