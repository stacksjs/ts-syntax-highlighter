# Tokenization Modes

ts-syntax-highlighter provides flexible tokenization with both synchronous and asynchronous modes, optimized for different use cases.

## Tokenizer Class

The `Tokenizer` class is the core API for syntax highlighting:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create tokenizer for a specific language
const tokenizer = new Tokenizer('javascript')
```

### Supported Language IDs

```typescript
type LanguageId =
  | 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'stx'
  | 'bash' | 'markdown' | 'yaml' | 'jsonc' | 'diff' | 'python'
  | 'php' | 'java' | 'c' | 'cpp' | 'rust' | 'csharp' | 'dockerfile'
  | 'ruby' | 'go' | 'sql' | 'idl' | 'text' | 'json5' | 'vue' | 'toml'
  | 'scss' | 'kotlin' | 'swift' | 'dart' | 'r' | 'graphql' | 'powershell'
  | 'makefile' | 'terraform' | 'bnf' | 'regexp' | 'lua' | 'cmd' | 'abnf'
  | 'csv' | 'log' | 'nginx' | 'xml' | 'protobuf' | 'solidity' | 'latex'
```

## Synchronous Tokenization

For smaller code blocks or when synchronous operation is required:

```typescript
const tokenizer = new Tokenizer('typescript')

const tokens = tokenizer.tokenize(`
interface User {
  name: string
  age: number
}
`)

// Process tokens
tokens.forEach((line, lineNum) => {
  console.log(`Line ${lineNum}:`)
  line.tokens.forEach(token => {
    console.log(`  ${token.type}: "${token.content}"`)
  })
})
```

## Asynchronous Tokenization

For better performance, especially with larger files:

```typescript
const tokenizer = new Tokenizer('typescript')

const tokens = await tokenizer.tokenizeAsync(`
// Large file content
const data = await fetch('/api/data')
const result = await data.json()
`)
```

### Performance Comparison

| Mode | JavaScript | TypeScript | HTML | CSS |
|------|-----------|------------|------|-----|
| Async | ~0.05ms | ~0.08ms | ~0.04ms | ~0.03ms |
| Sync | ~0.08ms | ~0.12ms | ~0.06ms | ~0.05ms |

Async mode is approximately 40% faster due to optimized execution scheduling.

## Token Structure

Each token contains detailed information:

```typescript
interface Token {
  type: string       // Token scope (e.g., 'keyword.control.js')
  content: string    // The actual text
  line: number       // Line number (0-indexed)
  startIndex: number // Character position in the line
}

interface LineTokens {
  line: number
  tokens: Token[]
}
```

### Example Token Output

```typescript
const code = 'const x = 42'
const tokens = tokenizer.tokenize(code)

// Output:
[
  {
    line: 0,
    tokens: [
      { type: 'keyword.declaration.js', content: 'const', line: 0, startIndex: 0 },
      { type: 'text', content: ' ', line: 0, startIndex: 5 },
      { type: 'variable.other.js', content: 'x', line: 0, startIndex: 6 },
      { type: 'text', content: ' ', line: 0, startIndex: 7 },
      { type: 'keyword.operator.js', content: '=', line: 0, startIndex: 8 },
      { type: 'text', content: ' ', line: 0, startIndex: 9 },
      { type: 'constant.numeric.js', content: '42', line: 0, startIndex: 10 }
    ]
  }
]
```

## Fast Tokenizer

For maximum performance with minimal overhead, use the fast tokenizer:

```typescript
import { FastTokenizer } from 'ts-syntax-highlighter'

const tokenizer = new FastTokenizer('javascript')

// Returns simplified tokens optimized for speed
const tokens = tokenizer.tokenize(code)
```

The fast tokenizer skips some metadata for improved performance:
- No scope hierarchy tracking
- Simplified token types
- Reduced memory allocation

## Streaming Tokenization

For very large files, use streaming to process incrementally:

```typescript
import { createStreamingTokenizer } from 'ts-syntax-highlighter'

const stream = createStreamingTokenizer('javascript')

for await (const line of stream.tokenize(largeCode)) {
  // Process each line as it's tokenized
  console.log(line)
}
```

## Grammar-based Tokenization

Load specific grammars for fine-grained control:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(javascriptGrammar)
```

### Custom Grammars

Create custom grammars for specialized languages:

```typescript
const customGrammar: Grammar = {
  name: 'my-language',
  scopeName: 'source.mylang',
  patterns: [
    {
      name: 'keyword.control.mylang',
      match: '\\b(if|else|while|for)\\b'
    },
    {
      name: 'string.quoted.double.mylang',
      begin: '"',
      end: '"'
    }
  ]
}

const tokenizer = new Tokenizer(customGrammar)
```

## Performance Optimization

### Pre-compiled Patterns

Patterns are compiled once during tokenizer initialization:

```typescript
// Good: Create tokenizer once, reuse
const tokenizer = new Tokenizer('javascript')
code1.forEach(c => tokenizer.tokenize(c))
code2.forEach(c => tokenizer.tokenize(c))

// Avoid: Creating new tokenizer for each file
files.forEach(f => {
  const t = new Tokenizer('javascript') // Don't do this
  t.tokenize(f)
})
```

### Character Classification

O(1) character lookup for common operations:

```typescript
// Internally uses lookup tables for:
// - Whitespace detection
// - Identifier characters
// - Operator characters
// - Digit detection
```

### Zero-Copy Operations

String slicing uses offsets instead of creating substrings:

```typescript
// Tokens reference positions in original string
// No intermediate string allocations during tokenization
```

## Error Handling

The tokenizer handles malformed code gracefully:

```typescript
const tokenizer = new Tokenizer('javascript')

// Unterminated string - still tokenizes
const tokens = tokenizer.tokenize('const x = "unterminated')
// Returns tokens up to the error point

// Invalid syntax - continues tokenizing
const tokens2 = tokenizer.tokenize('const const const')
// Returns all tokens, even invalid combinations
```

## API Reference

### Tokenizer Class

```typescript
class Tokenizer {
  constructor(language: string | Grammar)

  // Synchronous tokenization
  tokenize(code: string): LineTokens[]

  // Asynchronous tokenization (faster)
  tokenizeAsync(code: string): Promise<LineTokens[]>
}
```

### FastTokenizer Class

```typescript
class FastTokenizer {
  constructor(language: string)

  // Optimized for speed
  tokenize(code: string): SimpleToken[][]
}
```

### Token Types

Common token types returned:

| Type | Description |
|------|-------------|
| `keyword.*` | Language keywords |
| `string.*` | String literals |
| `comment.*` | Comments |
| `constant.*` | Constants and literals |
| `variable.*` | Variables |
| `entity.name.*` | Function/class names |
| `storage.*` | Storage modifiers |
| `support.*` | Built-in functions |
| `punctuation.*` | Punctuation marks |
| `text` | Plain text |
