import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { bashGrammar } from '../src/grammars/bash'
import { Tokenizer } from '../src/tokenizer'

describe('Bash Grammar', () => {
  const tokenizer = new Tokenizer(bashGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic bash code', async () => {
      const code = `#!/bin/bash
echo "Hello World"`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Variable Support', () => {
    it('should highlight variables', async () => {
      const code = `VAR="test"
echo $VAR
echo \${VAR}
echo $1 $@ $# $?`
      const tokens = tokenizer.tokenize(code)

      const variableTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))

      expect(variableTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight double-quoted strings', async () => {
      const code = `echo "Hello $USER"`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight single-quoted strings', async () => {
      const code = `echo 'Hello World'`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if [ -f file ]; then
  echo "exists"
fi`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight loops', async () => {
      const code = `for i in 1 2 3; do
  echo $i
done`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Functions', () => {
    it('should highlight function definitions', async () => {
      const code = `function greet() {
  echo "Hello"
}
greet()`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `# This is a comment
echo "test" # inline comment`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Operators', () => {
    it('should highlight pipes and redirects', async () => {
      const code = `cat file.txt | grep "test" > output.txt
command 2>&1`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should highlight logical operators', async () => {
      const code = `cmd1 && cmd2 || cmd3`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
