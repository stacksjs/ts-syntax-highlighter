import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { scssGrammar } from '../src/grammars/scss'
import { Tokenizer } from '../src/tokenizer'

describe('SCSS Grammar', () => {
  const tokenizer = new Tokenizer(scssGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize SCSS code', async () => {
      const code = `$primary-color: #333;
.button {
  color: $primary-color;
  &:hover {
    color: lighten($primary-color, 10%);
  }
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `$font-size: 16px;
$primary: #007bff;`
      const tokens = tokenizer.tokenize(code)
      const varTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))
      expect(varTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Mixins', () => {
    it('should highlight mixins', async () => {
      const code = `@mixin border-radius($radius) {
  border-radius: $radius;
}
.box {
  @include border-radius(5px);
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Nesting', () => {
    it('should handle nested selectors', async () => {
      const code = `.nav {
  ul {
    margin: 0;
    li {
      display: inline-block;
    }
  }
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Single line
/* Block comment */
.test { color: red; }`
      const tokens = tokenizer.tokenize(code)
      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
