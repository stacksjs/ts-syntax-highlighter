# Configuration

ts-syntax-highlighter is designed to work out-of-the-box with zero configuration. However, you can customize its behavior for advanced use cases.

## Basic Configuration

### Language Selection

The primary configuration is selecting which language grammar to use:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

const tokenizer = new Tokenizer('javascript') // or 'typescript', 'html', 'css', 'json', 'stx'
```

### Language Aliases

You can use language aliases for convenience:

```typescript
const jsTokenizer = new Tokenizer('js') // Alias for 'javascript'
const jsxTokenizer = new Tokenizer('jsx') // Also returns JavaScript grammar
const tsTokenizer = new Tokenizer('ts') // Alias for 'typescript'
const tsxTokenizer = new Tokenizer('tsx') // Also returns TypeScript grammar
```

## Tokenization Modes

### Async Mode (Recommended)

For best performance, especially with large files:

```typescript
const tokenizer = new Tokenizer('typescript')
const tokens = await tokenizer.tokenizeAsync(code)
```

Benefits:
- **12-77x faster** than synchronous alternatives
- Non-blocking operation
- Better for large files
- Optimized worker-like performance

### Sync Mode

For simpler use cases or when async isn't suitable:

```typescript
const tokenizer = new Tokenizer('javascript')
const tokens = tokenizer.tokenize(code)
```

Benefits:
- Simpler API (no async/await)
- Still **1.5-2x faster** than alternatives
- Good for small code snippets
- Synchronous flow

## Advanced Configuration

### Custom Language Detection

```typescript
import { getLanguage, getLanguageByExtension } from 'ts-syntax-highlighter'

function detectLanguage(filename: string) {
  // Try by file extension first
  const ext = filename.split('.').pop()
  if (ext) {
    const lang = getLanguageByExtension(`.${ext}`)
    if (lang)
      return lang.id
  }

  // Fallback to default
  return 'javascript'
}

// Usage
const languageId = detectLanguage('component.tsx')
const tokenizer = new Tokenizer(languageId)
```

### Token Filtering

Filter tokens by type or content:

```typescript
const tokenizer = new Tokenizer('javascript')
const tokens = await tokenizer.tokenizeAsync(code)

// Get only keywords
const keywords = tokens.flatMap(line =>
  line.tokens.filter(token => token.type.includes('keyword'))
)

// Get only strings
const strings = tokens.flatMap(line =>
  line.tokens.filter(token => token.type.includes('string'))
)

// Get only comments
const comments = tokens.flatMap(line =>
  line.tokens.filter(token => token.type.includes('comment'))
)
```

### Custom Token Processing

```typescript
import type { LineTokens, Token } from 'ts-syntax-highlighter'

function processTokens(tokens: LineTokens[]) {
  return tokens.map(line => ({
    line: line.line,
    tokens: line.tokens.map(token => ({
      ...token,
      // Add custom properties
      category: categorizeToken(token),
      color: getColorForType(token.type),
    })),
  }))
}

function categorizeToken(token: Token): string {
  if (token.type.includes('keyword'))
    return 'keyword'
  if (token.type.includes('string'))
    return 'literal'
  if (token.type.includes('comment'))
    return 'comment'
  if (token.type.includes('function'))
    return 'identifier'
  return 'other'
}

function getColorForType(type: string): string {
  // Map token types to colors
  const colorMap: Record<string, string> = {
    keyword: '#C586C0',
    string: '#CE9178',
    comment: '#6A9955',
    function: '#DCDCAA',
  }

  for (const [key, color] of Object.entries(colorMap)) {
    if (type.includes(key))
      return color
  }

  return '#D4D4D4' // default
}
```

### Batch Processing Configuration

```typescript
interface BatchConfig {
  concurrency: number
  onProgress?: (completed: number, total: number) => void
  onError?: (file: string, error: Error) => void
}

async function batchTokenize(
  files: string[],
  language: string,
  config: BatchConfig = { concurrency: 5 }
) {
  const tokenizer = new Tokenizer(language)
  const results: Map<string, LineTokens[]> = new Map()

  let completed = 0

  // Process in batches
  for (let i = 0; i < files.length; i += config.concurrency) {
    const batch = files.slice(i, i + config.concurrency)

    const batchResults = await Promise.all(
      batch.map(async (file) => {
        try {
          const code = await fs.promises.readFile(file, 'utf-8')
          const tokens = await tokenizer.tokenizeAsync(code)
          return { file, tokens, error: null }
        }
        catch (error) {
          config.onError?.(file, error as Error)
          return { file, tokens: null, error: error as Error }
        }
      })
    )

    batchResults.forEach(({ file, tokens }) => {
      if (tokens)
        results.set(file, tokens)
    })

    completed += batch.length
    config.onProgress?.(completed, files.length)
  }

  return results
}

// Usage
const results = await batchTokenize(
  ['file1.ts', 'file2.ts', 'file3.ts'],
  'typescript',
  {
    concurrency: 3,
    onProgress: (done, total) => console.log(`${done}/${total} files processed`),
    onError: (file, err) => console.error(`Failed to process ${file}:`, err),
  }
)
```

## Language-Specific Options

### JavaScript/JSX

```typescript
const jsTokenizer = new Tokenizer('javascript')

// The grammar automatically handles:
// - JSX elements
// - Template literals
// - BigInt literals
// - Numeric separators
// - Modern operators
```

### TypeScript/TSX

```typescript
const tsTokenizer = new Tokenizer('typescript')

// The grammar automatically handles:
// - All JavaScript features
// - Type annotations
// - Generics
// - TSX elements
// - Type operators (is, keyof, infer)
```

### HTML

```typescript
const htmlTokenizer = new Tokenizer('html')

// The grammar automatically handles:
// - HTML5 elements
// - Data attributes (data-*)
// - ARIA attributes (aria-*)
// - Event handlers (onclick, etc.)
```

### CSS

```typescript
const cssTokenizer = new Tokenizer('css')

// The grammar automatically handles:
// - Modern color functions
// - Math functions
// - CSS custom properties
// - At-rules (@media, @container, etc.)
```

## Performance Tuning

### 1. Reuse Tokenizer Instances

```typescript
// ✅ Good - Create once, use many times
const tokenizer = new Tokenizer('javascript')
const results = await Promise.all(
  codeSnippets.map(code => tokenizer.tokenizeAsync(code))
)

// ❌ Avoid - Creating new instance each time
const results = await Promise.all(
  codeSnippets.map(code =>
    new Tokenizer('javascript').tokenizeAsync(code)
  )
)
```

### 2. Choose the Right Mode

```typescript
// For large files or many files - use async
if (code.length > 1000 || files.length > 10) {
  tokens = await tokenizer.tokenizeAsync(code)
}

// For small snippets in sync context - use sync
if (code.length < 100 && !inAsyncContext) {
  tokens = tokenizer.tokenize(code)
}
```

### 3. Minimize Token Processing

```typescript
// ✅ Good - Process only what you need
const hasErrors = tokens.some(line =>
  line.tokens.some(token => token.type.includes('invalid'))
)

// ❌ Avoid - Processing all tokens when not needed
const allTokens = tokens.flatMap(line => line.tokens)
const hasErrors = allTokens.some(token => token.type.includes('invalid'))
```

## Environment-Specific Configuration

### Node.js

```typescript
import fs from 'node:fs/promises'
import { Tokenizer } from 'ts-syntax-highlighter'

const tokenizer = new Tokenizer('typescript')
const code = await fs.readFile('file.ts', 'utf-8')
const tokens = await tokenizer.tokenizeAsync(code)
```

### Browser

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Works directly in the browser
const tokenizer = new Tokenizer('javascript')
const tokens = await tokenizer.tokenizeAsync(editorContent)
```

### Bun

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

const tokenizer = new Tokenizer('typescript')
const code = await Bun.file('file.ts').text()
const tokens = await tokenizer.tokenizeAsync(code)
```

### Deno

```typescript
import { Tokenizer } from 'npm:ts-syntax-highlighter'

const tokenizer = new Tokenizer('typescript')
const code = await Deno.readTextFile('file.ts')
const tokens = await tokenizer.tokenizeAsync(code)
```

## Type Definitions

ts-syntax-highlighter exports comprehensive type definitions:

```typescript
import type {
  Grammar,
  Language,
  LineTokens,
  Token,
  Tokenizer,
} from 'ts-syntax-highlighter'

// Token interface
interface Token {
  type: string // Scope name
  content: string // Token text
  line: number // Line number
  startIndex: number // Position in line
}

// Line tokens interface
interface LineTokens {
  line: number // Line number
  tokens: Token[] // Tokens on this line
}

// Language interface
interface Language {
  id: string
  name: string
  aliases?: string[]
  extensions?: string[]
  grammar: Grammar
}
```

## Best Practices

1. **Reuse tokenizer instances** when processing multiple files with the same language
2. **Use async mode** for better performance, especially with large files
3. **Filter tokens early** to minimize processing overhead
4. **Choose the right language** - use specific languages (jsx, tsx) when appropriate
5. **Handle errors gracefully** - wrap tokenization in try-catch blocks
6. **Monitor performance** - use console.time() or performance.now() to track tokenization speed

## Next Steps

- Explore [Grammars](/grammars) to understand how tokenization works
- Check out [Usage](/usage) for practical examples
- See [API Reference](/api) for complete API documentation
