# API Reference

Complete API documentation for ts-syntax-highlighter.

## Tokenizer

The main class for tokenizing source code.

### Constructor

```typescript
new Tokenizer(languageId: string): Tokenizer
```

Creates a new tokenizer instance for the specified language.

**Parameters**:
- `languageId` - Language identifier (`'javascript'`, `'typescript'`, `'html'`, `'css'`, `'json'`, or `'stx'`)

**Returns**: `Tokenizer` instance

**Throws**: Error if language is not supported

**Example**:
```typescript
const tokenizer = new Tokenizer('javascript')
```

### tokenize()

```typescript
tokenize(code: string): LineTokens[]
```

Synchronously tokenizes the provided code.

**Parameters**:
- `code` - Source code to tokenize

**Returns**: Array of `LineTokens` objects

**Example**:
```typescript
const tokens = tokenizer.tokenize('const x = 42')
```

### tokenizeAsync()

```typescript
tokenizeAsync(code: string): Promise<LineTokens[]>
```

Asynchronously tokenizes the provided code (recommended for better performance).

**Parameters**:
- `code` - Source code to tokenize

**Returns**: Promise resolving to array of `LineTokens` objects

**Example**:
```typescript
const tokens = await tokenizer.tokenizeAsync('const x = 42')
```

## Language Functions

### getLanguage()

```typescript
getLanguage(id: string): Language | undefined
```

Retrieves a language by its ID, alias, or extension.

**Parameters**:
- `id` - Language ID, alias, or extension (e.g., `'javascript'`, `'js'`, `'jsx'`, `'.js'`)

**Returns**: `Language` object or `undefined` if not found

**Example**:
```typescript
const js = getLanguage('javascript')
const jsx = getLanguage('jsx') // Returns JavaScript
const ts = getLanguage('ts') // Returns TypeScript
```

### getLanguageByExtension()

```typescript
getLanguageByExtension(ext: string): Language | undefined
```

Retrieves a language by file extension.

**Parameters**:
- `ext` - File extension with or without dot (e.g., `'.js'` or `'js'`)

**Returns**: `Language` object or `undefined` if not found

**Example**:
```typescript
const js = getLanguageByExtension('.js')
const ts = getLanguageByExtension('ts')
const tsx = getLanguageByExtension('.tsx')
```

### languages

```typescript
languages: Language[]
```

Array of all supported languages.

**Example**:
```typescript
import { languages } from 'ts-syntax-highlighter'

console.log(languages.length) // 6
languages.forEach((lang) => {
  console.log(`${lang.name}: ${lang.id}`)
})
```

## Types

### Token

Represents a single token in the source code.

```typescript
interface Token {
  type: string // Scope name (e.g., 'keyword.control.js')
  content: string // The actual text content
  line: number // Line number (0-indexed)
  startIndex: number // Character position in the line (0-indexed)
}
```

**Properties**:

- **type**: Semantic scope of the token following TextMate naming conventions
  - Examples: `'keyword.control.js'`, `'string.quoted.double.ts'`, `'entity.name.function.js'`

- **content**: The actual text from the source code
  - Examples: `'const'`, `'Hello World'`, `'function'`

- **line**: Zero-indexed line number where the token appears
  - First line is `0`, second line is `1`, etc.

- **startIndex**: Zero-indexed character position within the line
  - First character is `0`, second character is `1`, etc.

**Example**:
```typescript
const token: Token = {
  type: 'storage.type.js',
  content: 'const',
  line: 0,
  startIndex: 0
}
```

### LineTokens

Represents all tokens on a single line.

```typescript
interface LineTokens {
  line: number // Line number (0-indexed)
  tokens: Token[] // Array of tokens on this line
}
```

**Properties**:

- **line**: Zero-indexed line number
- **tokens**: Array of `Token` objects appearing on this line

**Example**:
```typescript
const lineTokens: LineTokens = {
  line: 0,
  tokens: [
    { type: 'storage.type.js', content: 'const', line: 0, startIndex: 0 },
    { type: 'punctuation.js', content: ' ', line: 0, startIndex: 5 },
    { type: 'punctuation.js', content: 'x', line: 0, startIndex: 6 }
  ]
}
```

### Language

Represents a supported language.

```typescript
interface Language {
  id: string // Unique identifier
  name: string // Display name
  aliases?: string[] // Alternative identifiers
  extensions?: string[] // File extensions
  grammar: Grammar // Grammar definition
}
```

**Properties**:

- **id**: Unique language identifier (e.g., `'javascript'`, `'typescript'`)
- **name**: Human-readable name (e.g., `'JavaScript'`, `'TypeScript'`)
- **aliases**: Alternative identifiers (e.g., `['js', 'jsx']` for JavaScript)
- **extensions**: Supported file extensions (e.g., `['.js', '.jsx', '.mjs', '.cjs']`)
- **grammar**: The grammar definition for tokenization

**Example**:
```typescript
const language: Language = {
  id: 'javascript',
  name: 'JavaScript',
  aliases: ['js', 'jsx'],
  extensions: ['.js', '.jsx', '.mjs', '.cjs'],
  grammar: javascriptGrammar
}
```

### Grammar

Represents a language grammar definition.

```typescript
interface Grammar {
  name: string
  scopeName: string
  keywords?: Record<string, string>
  patterns: Pattern[]
  repository?: Record<string, PatternRepository>
}
```

**Properties**:

- **name**: Grammar name (e.g., `'JavaScript'`)
- **scopeName**: Root scope name (e.g., `'source.js'`)
- **keywords**: Keyword to scope mappings
- **patterns**: Array of patterns to match
- **repository**: Named pattern collections for reuse

**Example**:
```typescript
const grammar: Grammar = {
  name: 'JavaScript',
  scopeName: 'source.js',
  keywords: {
    const: 'storage.type.js',
    let: 'storage.type.js',
    var: 'storage.type.js'
  },
  patterns: [
    { include: '#keywords' },
    { include: '#strings' }
  ],
  repository: {
    keywords: {
      patterns: [
        {
          name: 'storage.type.js',
          match: '\\b(const|let|var)\\b'
        }
      ]
    }
  }
}
```

### Pattern

Represents a pattern in a grammar.

```typescript
interface Pattern {
  name?: string
  match?: string
  begin?: string
  end?: string
  include?: string
  patterns?: Pattern[]
  captures?: Record<string, PatternCapture>
  beginCaptures?: Record<string, PatternCapture>
  endCaptures?: Record<string, PatternCapture>
}
```

**Properties**:

- **name**: Scope name for matched text
- **match**: Regex pattern for simple matches
- **begin**: Regex pattern for start of multi-line match
- **end**: Regex pattern for end of multi-line match
- **include**: Reference to repository pattern or `'$self'`
- **patterns**: Nested patterns for complex matching
- **captures**: Named captures for `match` pattern
- **beginCaptures**: Named captures for `begin` pattern
- **endCaptures**: Named captures for `end` pattern

## Usage Examples

### Basic Tokenization

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

const tokenizer = new Tokenizer('javascript')
const code = 'const greeting = "Hello World"'

// Async (recommended)
const tokens = await tokenizer.tokenizeAsync(code)

// Sync
const syncTokens = tokenizer.tokenize(code)
```

### Language Detection

```typescript
import { getLanguage, getLanguageByExtension } from 'ts-syntax-highlighter'

// By ID
const js = getLanguage('javascript')

// By alias
const jsx = getLanguage('jsx')

// By extension
const ts = getLanguageByExtension('.ts')

// Check if language exists
const lang = getLanguage('python')
if (!lang) {
  console.error('Language not supported')
}
```

### Processing Tokens

```typescript
const tokenizer = new Tokenizer('typescript')
const tokens = await tokenizer.tokenizeAsync(code)

// Iterate through lines
for (const line of tokens) {
  console.log(`Line ${line.line}:`)

  // Iterate through tokens
  for (const token of line.tokens) {
    console.log(`  ${token.type}: "${token.content}"`)
  }
}

// Filter tokens
const keywords = tokens.flatMap(line =>
  line.tokens.filter(token => token.type.includes('keyword'))
)

// Map tokens
const contents = tokens.flatMap(line =>
  line.tokens.map(token => token.content)
).join('')
```

### Type Guards

```typescript
function isKeyword(token: Token): boolean {
  return token.type.includes('keyword')
}

function isString(token: Token): boolean {
  return token.type.includes('string')
}

function isComment(token: Token): boolean {
  return token.type.includes('comment')
}

// Usage
const tokens = await tokenizer.tokenizeAsync(code)
const hasKeywords = tokens.some(line =>
  line.tokens.some(isKeyword)
)
```

### Custom Processing

```typescript
interface ProcessedToken extends Token {
  category: string
  color: string
}

function processTokens(tokens: LineTokens[]): ProcessedToken[][] {
  return tokens.map(line =>
    line.tokens.map(token => ({
      ...token,
      category: categorize(token),
      color: getColor(token)
    }))
  )
}

function categorize(token: Token): string {
  if (token.type.includes('keyword'))
    return 'keyword'
  if (token.type.includes('string'))
    return 'literal'
  if (token.type.includes('comment'))
    return 'comment'
  return 'other'
}

function getColor(token: Token): string {
  const colorMap: Record<string, string> = {
    keyword: '#C586C0',
    string: '#CE9178',
    comment: '#6A9955'
  }

  for (const [key, color] of Object.entries(colorMap)) {
    if (token.type.includes(key))
      return color
  }

  return '#D4D4D4'
}
```

## Error Handling

```typescript
import { getLanguage, Tokenizer } from 'ts-syntax-highlighter'

function safeTokenize(code: string, languageId: string): LineTokens[] {
  // Check if language exists
  const language = getLanguage(languageId)
  if (!language) {
    throw new Error(`Unsupported language: ${languageId}`)
  }

  try {
    const tokenizer = new Tokenizer(languageId)
    return tokenizer.tokenize(code)
  }
  catch (error) {
    console.error('Tokenization failed:', error)
    return []
  }
}

// Async version
async function safeTokenizeAsync(
  code: string,
  languageId: string
): Promise<LineTokens[]> {
  const language = getLanguage(languageId)
  if (!language) {
    throw new Error(`Unsupported language: ${languageId}`)
  }

  try {
    const tokenizer = new Tokenizer(languageId)
    return await tokenizer.tokenizeAsync(code)
  }
  catch (error) {
    console.error('Tokenization failed:', error)
    return []
  }
}
```

## Performance Optimization

```typescript
// ✅ Reuse tokenizer instances
const tokenizer = new Tokenizer('javascript')
const results = await Promise.all(
  files.map(file => tokenizer.tokenizeAsync(file))
)

// ✅ Use async for large files
if (code.length > 1000) {
  tokens = await tokenizer.tokenizeAsync(code)
}
else {
  tokens = tokenizer.tokenize(code)
}

// ✅ Process tokens efficiently
const keywords = []
for (const line of tokens) {
  for (const token of line.tokens) {
    if (token.type.includes('keyword')) {
      keywords.push(token)
      break // Early exit if only need one
    }
  }
}
```

## TypeScript Integration

```typescript
import type {
  Grammar,
  Language,
  LineTokens,
  Token,
  Tokenizer
} from 'ts-syntax-highlighter'

// Type-safe token processing
function extractStrings(tokens: LineTokens[]): string[] {
  const strings: string[] = []

  for (const line of tokens) {
    for (const token of line.tokens) {
      if (token.type.includes('string')) {
        strings.push(token.content)
      }
    }
  }

  return strings
}

// Generic token filter
function filterTokens<T extends Token>(
  tokens: LineTokens[],
  predicate: (token: Token) => token is T
): T[] {
  return tokens.flatMap(line =>
    line.tokens.filter(predicate)
  ) as T[]
}
```

## Next Steps

- Check out [Usage Examples](/usage)
- Explore [Configuration](/config)
- Learn about [Grammars](/grammars)
