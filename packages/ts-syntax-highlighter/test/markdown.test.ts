import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Markdown Grammar', () => {
  const tokenizer = new Tokenizer('markdown')

  describe('Basic Tokenization', () => {
    it('should tokenize basic markdown', async () => {
      const code = `# Heading
This is **bold** and *italic*`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Headings', () => {
    it('should highlight ATX headings', async () => {
      const code = `# H1
## H2
### H3`
      const tokens = await tokenizer.tokenizeAsync(code)

      const headingTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.heading'))

      expect(headingTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Emphasis', () => {
    it('should highlight bold text', async () => {
      const code = `**bold** and __also bold__`
      const tokens = await tokenizer.tokenizeAsync(code)

      const boldTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.bold'))

      expect(boldTokens.length).toBeGreaterThan(0)
    })

    it('should highlight italic text', async () => {
      const code = `*italic* and _also italic_`
      const tokens = await tokenizer.tokenizeAsync(code)

      const italicTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.italic'))

      expect(italicTokens.length).toBeGreaterThan(0)
    })

    it('should highlight strikethrough', async () => {
      const code = `~~strikethrough~~`
      const tokens = await tokenizer.tokenizeAsync(code)

      const strikeTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.strikethrough'))

      expect(strikeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Links and Images', () => {
    it('should highlight inline links', async () => {
      const code = `[Link Text](https://example.com)`
      const tokens = await tokenizer.tokenizeAsync(code)

      const linkTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('link'))

      expect(linkTokens.length).toBeGreaterThan(0)
    })

    it('should highlight images', async () => {
      const code = `![Alt Text](image.png)`
      const tokens = await tokenizer.tokenizeAsync(code)

      const imageTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('image'))

      expect(imageTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Code', () => {
    it('should highlight inline code', async () => {
      const code = `This is \`inline code\``
      const tokens = await tokenizer.tokenizeAsync(code)

      const codeTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.inline.raw'))

      expect(codeTokens.length).toBeGreaterThan(0)
    })

    it('should highlight fenced code blocks', async () => {
      const code = `\`\`\`javascript
const x = 42;
\`\`\``
      const tokens = await tokenizer.tokenizeAsync(code)

      const codeTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('code'))

      expect(codeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Lists', () => {
    it('should highlight unordered lists', async () => {
      const code = `- Item 1
* Item 2
+ Item 3`
      const tokens = await tokenizer.tokenizeAsync(code)

      const listTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.list'))

      expect(listTokens.length).toBeGreaterThan(0)
    })

    it('should highlight ordered lists', async () => {
      const code = `1. First
2. Second
3. Third`
      const tokens = await tokenizer.tokenizeAsync(code)

      const listTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.list'))

      expect(listTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Blockquotes', () => {
    it('should highlight blockquotes', async () => {
      const code = `> This is a quote
> Second line`
      const tokens = await tokenizer.tokenizeAsync(code)

      const quoteTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.quote'))

      expect(quoteTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Tables', () => {
    it('should highlight tables', async () => {
      const code = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`
      const tokens = await tokenizer.tokenizeAsync(code)

      const tableTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.table'))

      expect(tableTokens.length).toBeGreaterThan(0)
    })
  })
})
