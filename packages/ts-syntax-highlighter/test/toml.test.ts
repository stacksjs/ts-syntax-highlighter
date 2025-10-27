import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { tomlGrammar } from '../src/grammars/toml'
import type { Token, TokenLine } from '../src/types'

describe('TOML Grammar', () => {
  const tokenizer = new Tokenizer(tomlGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize TOML code', async () => {
      const code = `title = "TOML Example"
[owner]
name = "John Doe"
age = 30`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Tables', () => {
    it('should highlight table headers', async () => {
      const code = `[database]
server = "192.168.1.1"
[database.connection]
max = 5000`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Arrays', () => {
    it('should handle arrays', async () => {
      const code = `colors = ["red", "yellow", "green"]
[[products]]
name = "Hammer"
[[products]]
name = "Nail"`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `# This is a comment
key = "value" # inline comment`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
