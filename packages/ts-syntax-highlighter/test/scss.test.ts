import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('SCSS Grammar', () => {
  const tokenizer = new Tokenizer('scss')

  describe('Basic Tokenization', () => {
    it('should tokenize SCSS code', async () => {
      const code = `$primary-color: #333;
.button {
  color: $primary-color;
  &:hover {
    color: lighten($primary-color, 10%);
  }
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `$font-size: 16px;
$primary: #007bff;`
      const tokens = await tokenizer.tokenizeAsync(code)
      const varTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('variable'))
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
      const tokens = await tokenizer.tokenizeAsync(code)
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
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Single line
/* Block comment */
.test { color: red; }`
      const tokens = await tokenizer.tokenizeAsync(code)
      const commentTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('comment'))
      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })
})
