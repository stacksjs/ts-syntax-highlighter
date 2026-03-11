# Getting Started

ts-syntax-highlighter is a blazing-fast, TypeScript-native syntax highlighter with comprehensive grammar support for 48 modern languages.

## Installation

Install using your preferred package manager:

```bash
# Using bun (recommended)
bun add ts-syntax-highlighter

# Using npm
npm install ts-syntax-highlighter

# Using pnpm
pnpm add ts-syntax-highlighter

# Using yarn
yarn add ts-syntax-highlighter
```

## Quick Start

### Basic Tokenization

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create tokenizer for a specific language
const tokenizer = new Tokenizer('javascript')

// Tokenize code synchronously
const tokens = tokenizer.tokenize(`
const greeting = 'Hello World'
console.log(greeting)
`)

// Each line contains an array of tokens
tokens.forEach(line => {
  line.tokens.forEach(token => {
    console.log(`${token.type}: ${token.content}`)
  })
})
```

### Async Tokenization (Faster)

For better performance, use async tokenization:

```typescript
const tokenizer = new Tokenizer('javascript')

// Async mode is ~40% faster
const tokens = await tokenizer.tokenizeAsync(`
function add(a: number, b: number): number {
  return a + b
}
`)
```

### Using the Highlighter API

For HTML output with syntax highlighting:

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  languages: ['javascript', 'typescript']
})

const html = highlighter.codeToHtml(code, {
  language: 'typescript',
  theme: 'github-dark'
})
```

## Language Detection

Detect language from file extensions:

```typescript
import { getLanguage, getLanguageByExtension } from 'ts-syntax-highlighter'

// Get language by ID or alias
const lang = getLanguage('js') // Returns JavaScript language
const tsLang = getLanguage('tsx') // Returns TypeScript language

// Get language by file extension
const langFromExt = getLanguageByExtension('.jsx') // Returns JavaScript
```

## Token Structure

Each token contains detailed information:

```typescript
interface Token {
  type: string       // Token scope (e.g., 'keyword.control.js')
  content: string    // The actual text content
  line: number       // Line number (0-indexed)
  startIndex: number // Character position in the line
}

interface LineTokens {
  line: number
  tokens: Token[]
}
```

Example token output:

```typescript
{
  type: 'keyword.declaration.js',
  content: 'const',
  line: 0,
  startIndex: 0
}
```

## Supported Languages

ts-syntax-highlighter supports 48 languages across multiple categories:

- **Web & Frontend**: JavaScript, TypeScript, JSX/TSX, HTML, CSS, SCSS, Vue
- **Data Formats**: JSON, JSONC, JSON5, YAML, TOML, XML, CSV
- **Systems**: C, C++, Rust, Go, Swift, Kotlin, Dart
- **Scripting**: Python, Ruby, PHP, Lua, R
- **DevOps**: Bash, PowerShell, Dockerfile, Makefile, Terraform, Nginx
- **Specialized**: SQL, GraphQL, Markdown, Diff, Solidity, LaTeX

See the [Languages Guide](/guide/languages) for detailed language support.

## TypeScript Support

The library is fully typed:

```typescript
import type { Token, LineTokens, Grammar } from 'ts-syntax-highlighter'

const tokens: LineTokens[] = tokenizer.tokenize(code)
```

## Performance

ts-syntax-highlighter is optimized for speed:

| Operation | Fast Mode (Async) | Sync Mode |
|-----------|------------------|-----------|
| JavaScript | ~0.05ms | ~0.08ms |
| TypeScript | ~0.08ms | ~0.12ms |
| HTML | ~0.04ms | ~0.06ms |
| CSS | ~0.03ms | ~0.05ms |

Key optimizations:
- Zero-copy string operations
- Pre-compiled regex patterns
- O(1) character classification
- Minimal heap allocations

## Next Steps

- Learn about [Supported Languages](/guide/languages) and their features
- Configure [Themes](/guide/themes) for visual styling
- Understand [Tokenization Modes](/guide/tokenizer) for advanced usage
