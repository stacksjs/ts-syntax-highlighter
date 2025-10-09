# Usage

This guide covers the most common use cases for ts-syntax-highlighter.

## Basic Usage

### Creating a Tokenizer

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create a tokenizer for a specific language
const jsTokenizer = new Tokenizer('javascript')
const tsTokenizer = new Tokenizer('typescript')
const htmlTokenizer = new Tokenizer('html')
const cssTokenizer = new Tokenizer('css')
const jsonTokenizer = new Tokenizer('json')
const stxTokenizer = new Tokenizer('stx')
```

### Async Tokenization (Recommended)

For best performance, use async tokenization:

```typescript
const tokenizer = new Tokenizer('javascript')

const code = `
const greeting = 'Hello World'
console.log(greeting)
`

const tokens = await tokenizer.tokenizeAsync(code)

// Process tokens
tokens.forEach(line => {
  console.log(`Line ${line.line}:`)
  line.tokens.forEach(token => {
    console.log(`  ${token.type}: "${token.content}"`)
  })
})
```

### Synchronous Tokenization

For simpler use cases where async isn't needed:

```typescript
const tokenizer = new Tokenizer('typescript')

const code = `
function add(a: number, b: number): number {
  return a + b
}
`

const tokens = tokenizer.tokenize(code)
```

## Language Detection

### By ID or Alias

```typescript
import { getLanguage } from 'ts-syntax-highlighter'

// Get by language ID
const js = getLanguage('javascript')

// Get by alias
const jsx = getLanguage('jsx')  // Returns JavaScript
const tsx = getLanguage('tsx')  // Returns TypeScript

// Check if language exists
const lang = getLanguage('python')
if (!lang) {
  console.log('Language not supported')
}
```

### By File Extension

```typescript
import { getLanguageByExtension } from 'ts-syntax-highlighter'

// With or without the dot
const jsLang = getLanguageByExtension('.js')
const tsLang = getLanguageByExtension('ts')
const jsxLang = getLanguageByExtension('.jsx')
```

## Working with Tokens

### Token Structure

Each token contains:

```typescript
interface Token {
  type: string        // Scope name (e.g., 'keyword.control.js')
  content: string     // The actual text
  line: number        // Line number (0-indexed)
  startIndex: number  // Character position in line
}
```

### Example: Extracting All Strings

```typescript
const tokenizer = new Tokenizer('javascript')
const code = `
const name = "John"
const greeting = 'Hello'
const message = \`Welcome, \${name}\`
`

const tokens = await tokenizer.tokenizeAsync(code)

const strings = tokens.flatMap(line =>
  line.tokens.filter(token => token.type.startsWith('string.'))
)

console.log(strings.map(t => t.content))
// Output: ['"', 'John', '"', "'", 'Hello', "'", '`', 'Welcome, ', '${', 'name', '}', '`']
```

### Example: Finding All Function Calls

```typescript
const tokenizer = new Tokenizer('javascript')
const code = `
console.log('test')
Math.max(1, 2, 3)
Array.isArray([])
`

const tokens = await tokenizer.tokenizeAsync(code)

const functions = tokens.flatMap(line =>
  line.tokens.filter(token => token.type === 'entity.name.function.js')
)

console.log(functions.map(t => t.content))
// Output: ['log', 'max', 'isArray']
```

## Advanced Examples

### Syntax Highlighting in HTML

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

function highlightCode(code: string, language: string): string {
  const tokenizer = new Tokenizer(language)
  const tokens = tokenizer.tokenize(code)

  let html = '<pre><code>'

  tokens.forEach(line => {
    line.tokens.forEach(token => {
      const className = token.type.replace(/\./g, '-')
      html += `<span class="${className}">${escapeHtml(token.content)}</span>`
    })
    html += '\n'
  })

  html += '</code></pre>'
  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Usage
const highlighted = highlightCode('const x = 42', 'javascript')
```

### Code Statistics

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

async function analyzeCode(code: string, language: string) {
  const tokenizer = new Tokenizer(language)
  const tokens = await tokenizer.tokenizeAsync(code)

  const stats = {
    lines: tokens.length,
    tokens: 0,
    keywords: 0,
    strings: 0,
    comments: 0,
    functions: 0,
  }

  tokens.forEach(line => {
    line.tokens.forEach(token => {
      stats.tokens++

      if (token.type.includes('keyword')) stats.keywords++
      if (token.type.includes('string')) stats.strings++
      if (token.type.includes('comment')) stats.comments++
      if (token.type.includes('function')) stats.functions++
    })
  })

  return stats
}

// Usage
const stats = await analyzeCode(`
  // Calculate sum
  function sum(a, b) {
    return a + b
  }
`, 'javascript')

console.log(stats)
// { lines: 4, tokens: 20, keywords: 2, strings: 0, comments: 1, functions: 1 }
```

### Custom Theme Generator

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

function generateThemeCSS(tokens: any[]) {
  const scopes = new Set<string>()

  tokens.forEach(line => {
    line.tokens.forEach(token => {
      scopes.add(token.type)
    })
  })

  let css = '/* Auto-generated theme */\n'

  Array.from(scopes).sort().forEach(scope => {
    const className = scope.replace(/\./g, '-')
    css += `.${className} { /* Add your styles */ }\n`
  })

  return css
}

// Usage
const tokenizer = new Tokenizer('typescript')
const tokens = tokenizer.tokenize('const x: number = 42')
const css = generateThemeCSS(tokens)
```

## Language-Specific Features

### JavaScript/JSX

```typescript
const tokenizer = new Tokenizer('javascript')

// JSX support
const jsx = await tokenizer.tokenizeAsync(`
  const element = <div className="container">
    <h1>Hello {name}</h1>
  </div>
`)

// BigInt literals
const bigint = await tokenizer.tokenizeAsync('const big = 123n')

// Numeric separators
const numbers = await tokenizer.tokenizeAsync('const million = 1_000_000')

// Template literals
const template = await tokenizer.tokenizeAsync('`Hello, ${name}!`')
```

### TypeScript/TSX

```typescript
const tokenizer = new Tokenizer('typescript')

// Type annotations
const types = await tokenizer.tokenizeAsync(`
  function add(a: number, b: number): number {
    return a + b
  }
`)

// Generics
const generics = await tokenizer.tokenizeAsync(`
  function identity<T>(arg: T): T {
    return arg
  }
`)

// Type operators
const operators = await tokenizer.tokenizeAsync(`
  type Keys = keyof MyType
  type Check = T extends string ? true : false
`)

// TSX
const tsx = await tokenizer.tokenizeAsync(`
  const Component = <Button<string> onClick={handler} />
`)
```

### CSS

```typescript
const tokenizer = new Tokenizer('css')

// Modern color functions
const colors = await tokenizer.tokenizeAsync(`
  .element {
    color: hwb(0 50% 50%);
    background: oklch(60% 0.15 180);
  }
`)

// Container queries
const containers = await tokenizer.tokenizeAsync(`
  @container (min-width: 700px) {
    .card { font-size: 2em; }
  }
`)

// CSS layers
const layers = await tokenizer.tokenizeAsync(`
  @layer base, components, utilities;
  @layer components {
    .btn { padding: 1em; }
  }
`)

// Custom properties
const variables = await tokenizer.tokenizeAsync(`
  :root {
    --primary-color: #007bff;
  }
  .button {
    background: var(--primary-color);
  }
`)
```

### HTML

```typescript
const tokenizer = new Tokenizer('html')

// ARIA attributes
const aria = await tokenizer.tokenizeAsync(`
  <button aria-label="Close" aria-hidden="false">
    <span>×</span>
  </button>
`)

// Data attributes
const data = await tokenizer.tokenizeAsync(`
  <div data-user-id="123" data-role="admin">
    Content
  </div>
`)

// Event handlers
const events = await tokenizer.tokenizeAsync(`
  <button onclick="handleClick()" onmouseover="highlight()">
    Click me
  </button>
`)
```

### JSON

```typescript
const tokenizer = new Tokenizer('json')

const json = await tokenizer.tokenizeAsync(`
{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "balance": 1.5e10,
  "tags": ["admin", "user"]
}
`)
```

## Performance Tips

### 1. Reuse Tokenizer Instances

```typescript
// Good: Reuse the same tokenizer
const tokenizer = new Tokenizer('javascript')
const tokens1 = await tokenizer.tokenizeAsync(code1)
const tokens2 = await tokenizer.tokenizeAsync(code2)

// Avoid: Creating new tokenizers for each call
const tokens1 = await new Tokenizer('javascript').tokenizeAsync(code1)
const tokens2 = await new Tokenizer('javascript').tokenizeAsync(code2)
```

### 2. Use Async Mode for Large Files

```typescript
// For large files, async is significantly faster
const tokenizer = new Tokenizer('typescript')
const largeFile = fs.readFileSync('large-file.ts', 'utf-8')
const tokens = await tokenizer.tokenizeAsync(largeFile) // Much faster
```

### 3. Batch Processing

```typescript
// Process multiple files efficiently
const tokenizer = new Tokenizer('javascript')
const files = ['file1.js', 'file2.js', 'file3.js']

const results = await Promise.all(
  files.map(async file => {
    const code = await fs.promises.readFile(file, 'utf-8')
    return tokenizer.tokenizeAsync(code)
  })
)
```

## Error Handling

```typescript
import { Tokenizer, getLanguage } from 'ts-syntax-highlighter'

function safeTokenize(code: string, languageId: string) {
  // Check if language is supported
  const language = getLanguage(languageId)
  if (!language) {
    throw new Error(`Language "${languageId}" is not supported`)
  }

  try {
    const tokenizer = new Tokenizer(languageId)
    return tokenizer.tokenize(code)
  } catch (error) {
    console.error('Tokenization failed:', error)
    return []
  }
}
```

## Next Steps

- Check out the [Configuration](/config) guide for advanced options
- Explore [Grammars](/grammars) to understand how syntax highlighting works
- See [API Reference](/api) for complete API documentation
