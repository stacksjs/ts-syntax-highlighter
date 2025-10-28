import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { markdownGrammar } from '../src/grammars/markdown'
import { Tokenizer } from '../src/tokenizer'

describe('Markdown Grammar', () => {
  const tokenizer = new Tokenizer(markdownGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic markdown', async () => {
      const code = `# Heading
This is **bold** and *italic*`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Headings', () => {
    it('should highlight ATX headings', async () => {
      const code = `# H1
## H2
### H3`
      const tokens = tokenizer.tokenize(code)

      const headingTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.heading')))

      expect(headingTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Emphasis', () => {
    it('should highlight bold text', async () => {
      const code = `**bold** and __also bold__`
      const tokens = tokenizer.tokenize(code)

      const boldTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.bold')))

      expect(boldTokens.length).toBeGreaterThan(0)
    })

    it('should highlight italic text', async () => {
      const code = `*italic* and _also italic_`
      const tokens = tokenizer.tokenize(code)

      const italicTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.italic')))

      expect(italicTokens.length).toBeGreaterThan(0)
    })

    it('should highlight strikethrough', async () => {
      const code = `~~strikethrough~~`
      const tokens = tokenizer.tokenize(code)

      const strikeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.strikethrough')))

      expect(strikeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Links and Images', () => {
    it.todo('should highlight inline links', async () => {
      const code = `[Link Text](https://example.com)`
      const tokens = tokenizer.tokenize(code)

      const linkTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('link')))

      expect(linkTokens.length).toBeGreaterThan(0)
    })

    it('should highlight images', async () => {
      const code = `![Alt Text](image.png)`
      const tokens = tokenizer.tokenize(code)

      const imageTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('image')))

      expect(imageTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Code', () => {
    it.todo('should highlight inline code', async () => {
      const code = `This is \`inline code\``
      const tokens = tokenizer.tokenize(code)

      const codeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.inline.raw')))

      expect(codeTokens.length).toBeGreaterThan(0)
    })

    it.todo('should highlight fenced code blocks', async () => {
      const code = `\`\`\`javascript
const x = 42;
\`\`\``
      const tokens = tokenizer.tokenize(code)

      const codeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('code')))

      expect(codeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Lists', () => {
    it('should highlight unordered lists', async () => {
      const code = `- Item 1
* Item 2
+ Item 3`
      const tokens = tokenizer.tokenize(code)

      const listTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.list')))

      expect(listTokens.length).toBeGreaterThan(0)
    })

    it.todo('should highlight ordered lists', async () => {
      const code = `1. First
2. Second
3. Third`
      const tokens = tokenizer.tokenize(code)

      const listTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.list')))

      expect(listTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Blockquotes', () => {
    it('should highlight blockquotes', async () => {
      const code = `> This is a quote
> Second line`
      const tokens = tokenizer.tokenize(code)

      const quoteTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.quote')))

      expect(quoteTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Tables', () => {
    it('should highlight tables', async () => {
      const code = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`
      const tokens = tokenizer.tokenize(code)

      const tableTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('markup.table')))

      expect(tableTokens.length).toBeGreaterThan(0)
    })
  })
})
