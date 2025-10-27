# Usage Guide

Welcome to ts-syntax-highlighter! This guide will show you how to use every feature, from basic tokenization to advanced transformations. We'll use real examples and explain things in plain English.

## Getting Started

### Installation

```bash
# Using npm
npm install ts-syntax-highlighter

# Using Bun (recommended)
bun add ts-syntax-highlighter

# Using pnpm
pnpm add ts-syntax-highlighter
```

### Your First Highlight

The simplest way to get started:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

// Create a tokenizer
const tokenizer = new Tokenizer(javascriptGrammar)

// Tokenize some code
const code = 'const greeting = "Hello, World!"'
const result = tokenizer.tokenize(code)

// Look at the tokens
result.forEach(line => {
  console.log(`Line ${line.lineNumber}:`)
  line.tokens.forEach(token => {
    console.log(`  ${token.type}: "${token.content}"`)
  })
})
```

That's it! You just tokenized JavaScript code into semantic tokens.

## Basic Tokenization

### Working with Different Languages

We support 48 languages out of the box. Just import the grammar you need:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import {
  javascriptGrammar,
  typescriptGrammar,
  pythonGrammar,
  rustGrammar,
  goGrammar,
  bashGrammar
} from 'ts-syntax-highlighter/grammars'

// JavaScript
const jsTokenizer = new Tokenizer(javascriptGrammar)
const jsTokens = jsTokenizer.tokenize('const x = 42')

// TypeScript
const tsTokenizer = new Tokenizer(typescriptGrammar)
const tsTokens = tsTokenizer.tokenize('function add(a: number, b: number): number { return a + b }')

// Python
const pyTokenizer = new Tokenizer(pythonGrammar)
const pyTokens = pyTokenizer.tokenize('def hello(): print("Hello!")')

// Rust
const rsTokenizer = new Tokenizer(rustGrammar)
const rsTokens = rsTokenizer.tokenize('fn main() { println!("Hello!"); }')
```

### Understanding Tokens

Every token has four key properties:

```typescript
interface Token {
  type: string        // What kind of token it is (e.g., 'keyword', 'string', 'function')
  content: string     // The actual text from your code
  scopes: string[]    // Full TextMate scope hierarchy
  line: number        // Which line it's on (0-indexed)
  offset: number      // Character position (0-indexed)
}
```

**Example**: Let's tokenize `const x = 42` and see what we get:

```typescript
const tokenizer = new Tokenizer(javascriptGrammar)
const lines = tokenizer.tokenize('const x = 42')

// First line
const line = lines[0]
console.log(line.tokens)

// Output:
// [
//   { type: 'storage', content: 'const', scopes: ['source.js', 'storage.type'], ... },
//   { type: 'text', content: ' ', scopes: ['source.js'], ... },
//   { type: 'text', content: 'x', scopes: ['source.js'], ... },
//   { type: 'text', content: ' ', scopes: ['source.js'], ... },
//   { type: 'operator', content: '=', scopes: ['source.js', 'keyword.operator'], ... },
//   { type: 'text', content: ' ', scopes: ['source.js'], ... },
//   { type: 'numeric', content: '42', scopes: ['source.js', 'constant.numeric'], ... }
// ]
```

## Real-World Examples

### Example 1: Syntax Highlighting in HTML

Let's build a simple syntax highlighter for web pages:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

function highlightToHtml(code: string): string {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  let html = '<pre><code>'

  for (const line of lines) {
    for (const token of line.tokens) {
      // Convert scopes to CSS classes
      const className = token.type || 'token'
      const escaped = escapeHtml(token.content)
      html += `<span class="token-${className}">${escaped}</span>`
    }
    html += '\n'
  }

  html += '</code></pre>'
  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Usage
const highlighted = highlightToHtml(`
const fibonacci = (n) => {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
`)

console.log(highlighted)
```

Now add some CSS to make it look nice:

```css
.token-keyword { color: #c586c0; }
.token-storage { color: #569cd6; }
.token-function { color: #dcdcaa; }
.token-string { color: #ce9178; }
.token-numeric { color: #b5cea8; }
.token-comment { color: #6a9955; font-style: italic; }
.token-operator { color: #d4d4d4; }
```

### Example 2: Code Statistics

Want to know what's in your codebase? Here's how to analyze it:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { typescriptGrammar } from 'ts-syntax-highlighter/grammars'

interface CodeStats {
  totalLines: number
  totalTokens: number
  keywords: number
  functions: number
  strings: number
  comments: number
  complexity: number
}

function analyzeCode(code: string): CodeStats {
  const tokenizer = new Tokenizer(typescriptGrammar)
  const lines = tokenizer.tokenize(code)

  const stats: CodeStats = {
    totalLines: lines.length,
    totalTokens: 0,
    keywords: 0,
    functions: 0,
    strings: 0,
    comments: 0,
    complexity: 0
  }

  for (const line of lines) {
    for (const token of line.tokens) {
      stats.totalTokens++

      // Count by scope
      if (token.scopes.some(s => s.includes('keyword'))) {
        stats.keywords++

        // Track complexity (if/for/while increase it)
        if (['if', 'for', 'while', 'case'].includes(token.content)) {
          stats.complexity++
        }
      }

      if (token.type === 'function') stats.functions++
      if (token.scopes.some(s => s.includes('string'))) stats.strings++
      if (token.scopes.some(s => s.includes('comment'))) stats.comments++
    }
  }

  return stats
}

// Usage
const code = `
// Calculate factorial
function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

const result = factorial(5)
console.log("Result:", result)
`

const stats = analyzeCode(code)
console.log(stats)
// {
//   totalLines: 8,
//   totalTokens: 42,
//   keywords: 3,
//   functions: 2,
//   strings: 2,
//   comments: 1,
//   complexity: 1
// }
```

### Example 3: Finding All Function Calls

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { pythonGrammar } from 'ts-syntax-highlighter/grammars'

function findFunctionCalls(code: string): string[] {
  const tokenizer = new Tokenizer(pythonGrammar)
  const lines = tokenizer.tokenize(code)

  const functions: string[] = []

  for (const line of lines) {
    for (let i = 0; i < line.tokens.length; i++) {
      const token = line.tokens[i]

      // Look for function token followed by (
      if (token.type === 'function') {
        // Check if next non-whitespace token is (
        for (let j = i + 1; j < line.tokens.length; j++) {
          const next = line.tokens[j]
          if (next.content.trim() === '') continue
          if (next.content === '(') {
            functions.push(token.content)
          }
          break
        }
      }
    }
  }

  return [...new Set(functions)] // Remove duplicates
}

// Usage
const pythonCode = `
import math

def calculate_area(radius):
    return math.pi * math.pow(radius, 2)

area = calculate_area(5)
print(f"Area: {area}")
math.ceil(area)
`

const calls = findFunctionCalls(pythonCode)
console.log(calls)
// ['calculate_area', 'print', 'math.pi', 'math.pow', 'math.ceil']
```

### Example 4: Extract All Strings

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

function extractStrings(code: string): string[] {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  const strings: string[] = []
  let currentString = ''
  let inString = false

  for (const line of lines) {
    for (const token of line.tokens) {
      // Check if this is a string token
      if (token.scopes.some(s => s.includes('string'))) {
        if (token.content === '"' || token.content === "'" || token.content === '`') {
          if (inString && currentString) {
            strings.push(currentString)
            currentString = ''
            inString = false
          } else {
            inString = true
          }
        } else if (inString) {
          currentString += token.content
        }
      }
    }
  }

  return strings
}

// Usage
const code = `
const message = "Hello, World!"
const name = 'Alice'
console.log(\`Welcome, \${name}!\`)
`

const strings = extractStrings(code)
console.log(strings)
// ['Hello, World!', 'Alice', 'Welcome, ', '!']
```

## Language-Specific Features

### Bash: Variables and Commands

Bash has special syntax for variables (`$VAR`, `${VAR}`) that we handle correctly:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { bashGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(bashGrammar)

const script = `
#!/bin/bash
NAME="World"
echo "Hello, $NAME!"
echo "Count: ${#NAME}"
`

const tokens = tokenizer.tokenize(script)
// Variables like $NAME and ${#NAME} are correctly tokenized as variables
```

### Rust: Lifetimes and Macros

Rust has unique syntax we support:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { rustGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(rustGrammar)

const rustCode = `
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

let v = vec![1, 2, 3];
println!("{:?}", v);
`

const tokens = tokenizer.tokenize(rustCode)
// Lifetimes ('a), macros (vec!, println!), and all Rust syntax are handled
```

### CSS: Modern Features

We support the latest CSS including CSS4 color functions:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { cssGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(cssGrammar)

const css = `
:root {
  --primary: oklch(60% 0.15 180);
  --secondary: hwb(200 30% 20%);
}

@container (min-width: 700px) {
  .card {
    background: var(--primary);
    color: lab(50% 0 0);
  }
}
`

const tokens = tokenizer.tokenize(css)
// Modern color functions, container queries, CSS variables all work
```

## Performance Tips

### 1. Reuse Tokenizers

Creating a tokenizer is cheap (~1ms), but reusing is even better:

```typescript
// ✅ Good: Create once, use many times
const tokenizer = new Tokenizer(javascriptGrammar)

const results = files.map(code => tokenizer.tokenize(code))

// ❌ Avoid: Creating new tokenizers repeatedly
const results = files.map(code =>
  new Tokenizer(javascriptGrammar).tokenize(code)
)
```

### 2. Process Large Files in Chunks

For very large files, process line by line:

```typescript
function tokenizeLarge(code: string) {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = code.split('\n')

  // Process in chunks of 1000 lines
  const chunkSize = 1000
  const results = []

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize).join('\n')
    const tokens = tokenizer.tokenize(chunk)
    results.push(...tokens)
  }

  return results
}
```

### 3. Filter Early

If you only need specific tokens, filter as you go:

```typescript
// ✅ Good: Filter during iteration
function findKeywords(code: string): string[] {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)
  const keywords: string[] = []

  for (const line of lines) {
    for (const token of line.tokens) {
      if (token.type === 'keyword' || token.type === 'storage') {
        keywords.push(token.content)
      }
    }
  }

  return keywords
}

// ❌ Slower: Build full array then filter
function findKeywordsSlow(code: string): string[] {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  return lines
    .flatMap(line => line.tokens)
    .filter(token => token.type === 'keyword' || token.type === 'storage')
    .map(token => token.content)
}
```

## Error Handling

Always check if languages are supported:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { getGrammarByLanguageId } from 'ts-syntax-highlighter/grammars'

function safeTokenize(code: string, languageId: string) {
  const grammar = getGrammarByLanguageId(languageId)

  if (!grammar) {
    throw new Error(`Language "${languageId}" is not supported.

Supported languages: javascript, typescript, python, rust, go, bash, ... (48 total)`)
  }

  try {
    const tokenizer = new Tokenizer(grammar)
    return tokenizer.tokenize(code)
  }
  catch (error) {
    console.error('Tokenization failed:', error)
    // Return empty result or fallback
    return []
  }
}
```

## Advanced: Working with Scopes

Scopes provide rich semantic information. Use them to build powerful tools:

```typescript
function analyzeScopes(code: string) {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  for (const line of lines) {
    for (const token of line.tokens) {
      console.log(`Token: "${token.content}"`)
      console.log(`  Type: ${token.type}`)
      console.log(`  Scopes: ${token.scopes.join(' > ')}`)
      console.log()
    }
  }
}

analyzeScopes('const x = 42')
// Token: "const"
//   Type: storage
//   Scopes: source.js > storage.type
//
// Token: " "
//   Type: text
//   Scopes: source.js
//
// Token: "x"
//   Type: text
//   Scopes: source.js
//
// Token: " "
//   Type: text
//   Scopes: source.js
//
// Token: "="
//   Type: operator
//   Scopes: source.js > keyword.operator
```

## Next Steps

- **API Reference**: Detailed API documentation → [/api](/api)
- **All Languages**: See all 48 supported languages → [/languages](/languages)
- **Performance**: Deep dive into optimizations → [/advanced/performance](/advanced/performance)
- **Custom Grammars**: Create your own language support → [/advanced/custom-grammars](/advanced/custom-grammars)
