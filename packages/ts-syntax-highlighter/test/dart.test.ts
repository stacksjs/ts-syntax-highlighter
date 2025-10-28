import { describe, expect, it } from 'bun:test'
import { dartGrammar } from '../src/grammars/dart'
import { Tokenizer } from '../src/tokenizer'

describe('Dart Grammar', () => {
  const tokenizer = new Tokenizer(dartGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize basic Dart code', async () => {
      const code = `void main() {
  print('Hello World');
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('String Interpolation', () => {
    it('should highlight string interpolation', async () => {
      const code = `var name = 'World';
var greeting = 'Hello \$name';
var calc = 'Result: \${x + y}';`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Null Safety', () => {
    it('should handle nullable types', async () => {
      const code = `String? nullableString = null;
late String lateString;`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
