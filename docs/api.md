# API Reference

Complete API documentation for ts-syntax-highlighter. This guide covers all classes, functions, types, and interfaces with real examples.

## Core API

### Tokenizer

The main class for tokenizing source code. This is the heart of the library.

#### Constructor

```typescript
new Tokenizer(grammar: Grammar): Tokenizer
```

Creates a new tokenizer instance for a specific language grammar.

**Parameters:**
- `grammar` - A `Grammar` object defining the language rules

**Returns:** `Tokenizer` instance

**Example:**
```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(javascriptGrammar)
```

**Performance Note:** Creating a tokenizer is inexpensive (~1ms), but you should reuse instances when processing multiple files in the same language.

#### tokenize()

```typescript
tokenize(code: string): TokenLine[]
```

Synchronously tokenizes the provided source code.

**Parameters:**
- `code` - Source code string to tokenize

**Returns:** Array of `TokenLine` objects, one per line of input

**Example:**
```typescript
const code = `
const add = (a, b) => a + b
console.log(add(1, 2))
`

const lines = tokenizer.tokenize(code)

lines.forEach(line => {
  console.log(`Line ${line.lineNumber}: ${line.tokens.length} tokens`)
})

// Output:
// Line 1: 0 tokens (empty line)
// Line 2: 12 tokens
// Line 3: 9 tokens
```

**When to Use:** Best for small to medium-sized files (< 1000 lines). For larger files, consider chunking.

## Grammar Functions

### getGrammarByLanguageId()

```typescript
getGrammarByLanguageId(id: string): Grammar | undefined
```

Retrieves a grammar by language ID or alias.

**Parameters:**
- `id` - Language identifier (e.g., `'javascript'`, `'js'`, `'typescript'`, `'ts'`)

**Returns:** `Grammar` object or `undefined` if not found

**Example:**
```typescript
import { getGrammarByLanguageId } from 'ts-syntax-highlighter/grammars'

const jsGrammar = getGrammarByLanguageId('javascript')
const tsGrammar = getGrammarByLanguageId('ts') // Alias for typescript
const pyGrammar = getGrammarByLanguageId('python')

if (!jsGrammar) {
  console.error('JavaScript grammar not found')
}
```

### Available Grammars

All 48 language grammars are available as named exports:

```typescript
import {
  // Web & Frontend
  javascriptGrammar,
  typescriptGrammar,
  htmlGrammar,
  cssGrammar,
  scssGrammar,
  jsonGrammar,
  jsoncGrammar,
  json5Grammar,
  xmlGrammar,
  vueGrammar,

  // Systems & DevOps
  bashGrammar,
  powershellGrammar,
  dockerfileGrammar,
  yamlGrammar,
  tomlGrammar,
  makefileGrammar,
  cmdGrammar,

  // Programming Languages
  pythonGrammar,
  javaGrammar,
  cGrammar,
  cppGrammar,
  csharpGrammar,
  goGrammar,
  rustGrammar,
  swiftGrammar,
  kotlinGrammar,
  dartGrammar,
  phpGrammar,
  rubyGrammar,
  rGrammar,
  solidityGrammar,
  luaGrammar,
  graphqlGrammar,
  idlGrammar,
  protobufGrammar,
  latexGrammar,

  // Data & Specialized
  sqlGrammar,
  markdownGrammar,
  diffGrammar,
  terraformGrammar,
  nginxGrammar,
  csvGrammar,
  regexpGrammar,
  bnfGrammar,
  abnfGrammar,
  logGrammar,
  textGrammar
} from 'ts-syntax-highlighter/grammars'
```

## Core Types

### Token

Represents a single semantic token in the source code.

```typescript
interface Token {
  type: string
  content: string
  scopes: string[]
  line: number
  offset: number
}
```

**Properties:**

- **type** (`string`): The token's semantic type, derived from the last scope
  - Examples: `'keyword'`, `'storage'`, `'function'`, `'string'`, `'numeric'`, `'comment'`
  - This is extracted from the last segment of the deepest scope
  - E.g., `'storage.type'` becomes type `'type'`

- **content** (`string`): The actual text from the source code
  - Examples: `'const'`, `'42'`, `'function'`, `'"Hello"'`
  - Never modified or escaped
  - Zero-copy reference to original string for performance

- **scopes** (`string[]`): Full TextMate scope hierarchy
  - Array of scope names from root to specific
  - Example: `['source.js', 'storage.type']` for `const`
  - Example: `['source.js', 'string.quoted.double']` for `"text"`
  - Used for fine-grained syntax highlighting and semantic analysis

- **line** (`number`): Zero-indexed line number
  - First line is `0`, second is `1`, etc.

- **offset** (`number`): Zero-indexed character position within the line
  - First character is `0`, second is `1`, etc.

**Example:**
```typescript
const token: Token = {
  type: 'type',
  content: 'const',
  scopes: ['source.js', 'storage.type'],
  line: 0,
  offset: 0
}
```

### TokenLine

Represents all tokens on a single line of code.

```typescript
interface TokenLine {
  lineNumber: number
  tokens: Token[]
}
```

**Properties:**

- **lineNumber** (`number`): Zero-indexed line number
- **tokens** (`Token[]`): Array of tokens appearing on this line, in order

**Example:**
```typescript
const line: TokenLine = {
  lineNumber: 0,
  tokens: [
    { type: 'type', content: 'const', scopes: ['source.js', 'storage.type'], line: 0, offset: 0 },
    { type: 'text', content: ' ', scopes: ['source.js'], line: 0, offset: 5 },
    { type: 'text', content: 'x', scopes: ['source.js'], line: 0, offset: 6 },
    { type: 'text', content: ' ', scopes: ['source.js'], line: 0, offset: 7 },
    { type: 'operator', content: '=', scopes: ['source.js', 'keyword.operator'], line: 0, offset: 8 },
    { type: 'text', content: ' ', scopes: ['source.js'], line: 0, offset: 9 },
    { type: 'numeric', content: '42', scopes: ['source.js', 'constant.numeric'], line: 0, offset: 10 }
  ]
}
```

### Grammar

Represents a complete language grammar definition.

```typescript
interface Grammar {
  name: string
  scopeName: string
  keywords?: Record<string, string>
  patterns: GrammarPattern[]
  repository?: Record<string, { patterns: GrammarPattern[] }>
}
```

**Properties:**

- **name** (`string`): Human-readable language name
  - Examples: `'JavaScript'`, `'TypeScript'`, `'Python'`

- **scopeName** (`string`): Root TextMate scope
  - Examples: `'source.js'`, `'source.ts'`, `'source.python'`
  - Convention: `source.<language>` for programming languages
  - Used as the base scope for all tokens

- **keywords** (`Record<string, string>`, optional): Keyword mappings for fast-path optimization
  - Key: keyword string (e.g., `'const'`, `'function'`)
  - Value: scope name (e.g., `'storage.type'`, `'keyword.control'`)
  - Used for O(1) keyword lookup instead of regex matching

- **patterns** (`GrammarPattern[]`): Top-level patterns to match
  - Ordered array of pattern rules
  - Processed sequentially until first match
  - Can include references to repository patterns

- **repository** (optional): Named pattern collections for reuse
  - Key: pattern name (e.g., `'strings'`, `'comments'`)
  - Value: object with `patterns` array
  - Referenced via `{ include: '#name' }` in patterns

**Example:**
```typescript
const simpleGrammar: Grammar = {
  name: 'SimpleLanguage',
  scopeName: 'source.simple',
  keywords: {
    'if': 'keyword.control',
    'else': 'keyword.control',
    'function': 'storage.type'
  },
  patterns: [
    { include: '#keywords' },
    { include: '#strings' },
    { include: '#numbers' }
  ],
  repository: {
    keywords: {
      patterns: [
        { name: 'keyword.control', match: '\\b(if|else|while|for)\\b' }
      ]
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double',
          begin: '"',
          end: '"',
          patterns: [
            { name: 'constant.character.escape', match: '\\\\.' }
          ]
        }
      ]
    },
    numbers: {
      patterns: [
        { name: 'constant.numeric', match: '\\b\\d+(\\.\\d+)?\\b' }
      ]
    }
  }
}
```

### GrammarPattern

Represents a single pattern rule in a grammar.

```typescript
interface GrammarPattern {
  name?: string
  match?: string
  begin?: string
  end?: string
  include?: string
  patterns?: GrammarPattern[]
  captures?: Record<string, { name: string }>
  beginCaptures?: Record<string, { name: string }>
  endCaptures?: Record<string, { name: string }>
}
```

**Properties:**

- **name** (`string`, optional): Scope name to apply to matched text
  - Example: `'keyword.control'`, `'string.quoted.double'`
  - If not provided, matched text inherits parent scope

- **match** (`string`, optional): Regex pattern for simple single-line matches
  - Example: `'\\b(const|let|var)\\b'`
  - Cannot be used with `begin`/`end`

- **begin** (`string`, optional): Regex pattern for start of multi-line region
  - Example: `'<!--'` for HTML comments
  - Must be paired with `end`

- **end** (`string`, optional): Regex pattern for end of multi-line region
  - Example: `'-->'` for HTML comments
  - Must be paired with `begin`

- **include** (`string`, optional): Reference to another pattern
  - `'#name'` - Reference to repository pattern
  - `'$self'` - Reference to root patterns (for recursion)
  - Cannot be combined with other properties

- **patterns** (`GrammarPattern[]`, optional): Nested patterns for region matching
  - Used inside `begin`/`end` regions
  - Processed before end pattern is checked

- **captures** (`Record<string, { name: string }>`, optional): Named captures for `match` pattern
  - Key: capture group number as string (`'1'`, `'2'`, etc.)
  - Value: object with `name` (scope) for that capture
  - Enables fine-grained scoping of regex groups

- **beginCaptures** (`Record<string, { name: string }>`, optional): Captures for `begin` pattern
- **endCaptures** (`Record<string, { name: string }>`, optional): Captures for `end` pattern

**Pattern Types:**

**1. Simple Match Pattern:**
```typescript
{
  name: 'keyword.control',
  match: '\\b(if|else|while|for)\\b'
}
```

**2. Region Pattern (Begin/End):**
```typescript
{
  name: 'comment.block',
  begin: '/\\*',
  end: '\\*/',
  patterns: [
    { name: 'keyword.tag', match: '@\\w+' }
  ]
}
```

**3. Include Pattern:**
```typescript
{ include: '#strings' }  // Reference to repository
{ include: '$self' }      // Recursive reference
```

**4. Capture Groups:**
```typescript
{
  match: '(function)\\s+(\\w+)\\s*\\(',
  captures: {
    '1': { name: 'storage.type.function' },
    '2': { name: 'entity.name.function' }
  }
}
```

## Practical Examples

### Example 1: Custom Token Processing

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

function processTokens(code: string) {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  const result = {
    keywords: [] as string[],
    functions: [] as string[],
    strings: [] as string[],
    numbers: [] as string[]
  }

  for (const line of lines) {
    for (const token of line.tokens) {
      if (token.scopes.some(s => s.includes('keyword'))) {
        result.keywords.push(token.content)
      }
      if (token.type === 'function') {
        result.functions.push(token.content)
      }
      if (token.scopes.some(s => s.includes('string'))) {
        result.strings.push(token.content)
      }
      if (token.scopes.some(s => s.includes('numeric'))) {
        result.numbers.push(token.content)
      }
    }
  }

  return result
}

const code = `
const fibonacci = (n) => {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(10))
`

const analysis = processTokens(code)
console.log(analysis)
// {
//   keywords: ['const', '=>', 'if', '<=', 'return', ...],
//   functions: ['fibonacci', 'console', 'log', ...],
//   strings: [],
//   numbers: ['1', '1', '2', '10']
// }
```

### Example 2: Syntax Highlighting with CSS Classes

```typescript
import { Tokenizer, Token } from 'ts-syntax-highlighter'
import { typescriptGrammar } from 'ts-syntax-highlighter/grammars'

function tokenToHtml(token: Token): string {
  const classList = token.scopes
    .map(scope => scope.replace(/\./g, '-'))
    .join(' ')

  const escaped = token.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return `<span class="${classList}">${escaped}</span>`
}

function highlightCode(code: string): string {
  const tokenizer = new Tokenizer(typescriptGrammar)
  const lines = tokenizer.tokenize(code)

  let html = '<pre><code>'

  for (const line of lines) {
    for (const token of line.tokens) {
      html += tokenToHtml(token)
    }
    html += '\n'
  }

  html += '</code></pre>'
  return html
}

const code = 'function add(a: number, b: number): number { return a + b }'
console.log(highlightCode(code))
```

### Example 3: Building a Code Formatter

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { pythonGrammar } from 'ts-syntax-highlighter/grammars'

function formatPython(code: string): string {
  const tokenizer = new Tokenizer(pythonGrammar)
  const lines = tokenizer.tokenize(code)

  let formatted = ''
  let indentLevel = 0

  for (const line of lines) {
    let lineContent = ''

    for (const token of line.tokens) {
      // Decrease indent after dedent keywords
      if (['return', 'pass', 'break', 'continue'].includes(token.content.trim())) {
        // Keep at current level
      }

      lineContent += token.content
    }

    // Check for keywords that increase indent
    const hasIndentKeyword = line.tokens.some(t =>
      ['def', 'class', 'if', 'for', 'while', 'with', 'try', 'except'].includes(t.content) &&
      lineContent.trim().endsWith(':')
    )

    formatted += '  '.repeat(indentLevel) + lineContent.trim() + '\n'

    if (hasIndentKeyword) {
      indentLevel++
    }
  }

  return formatted
}
```

### Example 4: Detecting Language Features

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { typescriptGrammar } from 'ts-syntax-highlighter/grammars'

interface LanguageFeatures {
  hasAsync: boolean
  hasGenerics: boolean
  hasDecorators: boolean
  hasOptionalChaining: boolean
  hasNullishCoalescing: boolean
}

function detectFeatures(code: string): LanguageFeatures {
  const tokenizer = new Tokenizer(typescriptGrammar)
  const lines = tokenizer.tokenize(code)

  const features: LanguageFeatures = {
    hasAsync: false,
    hasGenerics: false,
    hasDecorators: false,
    hasOptionalChaining: false,
    hasNullishCoalescing: false
  }

  for (const line of lines) {
    for (let i = 0; i < line.tokens.length; i++) {
      const token = line.tokens[i]

      if (token.content === 'async') features.hasAsync = true
      if (token.content === '<' || token.content === '>') {
        // Simple heuristic for generics
        features.hasGenerics = true
      }
      if (token.content.startsWith('@')) features.hasDecorators = true
      if (token.content === '?.') features.hasOptionalChaining = true
      if (token.content === '??') features.hasNullishCoalescing = true
    }
  }

  return features
}
```

## Advanced Usage

### Working with Scopes

Scopes provide semantic information beyond simple token types. Use them for rich analysis:

```typescript
function analyzeScopes(code: string) {
  const tokenizer = new Tokenizer(javascriptGrammar)
  const lines = tokenizer.tokenize(code)

  const scopeStats = new Map<string, number>()

  for (const line of lines) {
    for (const token of line.tokens) {
      for (const scope of token.scopes) {
        scopeStats.set(scope, (scopeStats.get(scope) || 0) + 1)
      }
    }
  }

  // Most common scopes
  const sorted = Array.from(scopeStats.entries())
    .sort((a, b) => b[1] - a[1])

  console.log('Top scopes:')
  sorted.slice(0, 10).forEach(([scope, count]) => {
    console.log(`  ${scope}: ${count}`)
  })
}
```

### Performance Monitoring

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

function benchmarkTokenizer(code: string, iterations: number = 100) {
  const tokenizer = new Tokenizer(javascriptGrammar)

  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    tokenizer.tokenize(code)
    const end = performance.now()
    times.push(end - start)
  }

  const avg = times.reduce((a, b) => a + b) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)

  console.log(`Tokenized ${code.length} chars in:`)
  console.log(`  Average: ${avg.toFixed(2)}ms`)
  console.log(`  Min: ${min.toFixed(2)}ms`)
  console.log(`  Max: ${max.toFixed(2)}ms`)
  console.log(`  Throughput: ${(code.length / avg * 1000).toFixed(0)} chars/sec`)
}
```

## Type Exports

Import types for TypeScript projects:

```typescript
import type {
  Token,
  TokenLine,
  Grammar,
  GrammarPattern
} from 'ts-syntax-highlighter'

// Use in your code
function processTokens(tokens: TokenLine[]): void {
  // Your code here
}
```

## Next Steps

- **Usage Examples**: See practical examples → [/usage](/usage)
- **All Languages**: Browse all 48 languages → [/languages](/languages)
- **Performance Guide**: Learn optimization techniques → [/advanced/performance](/advanced/performance)
- **Custom Grammars**: Create your own grammars → [/advanced/custom-grammars](/advanced/custom-grammars)
