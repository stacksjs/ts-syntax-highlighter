# Examples

## Table of Contents

- [Basic Usage](#basic-usage)
- [CLI Examples](#cli-examples)
- [Theme Examples](#theme-examples)
- [Language Examples](#language-examples)
- [Advanced Usage](#advanced-usage)

## Basic Usage

### Highlighting JavaScript

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter()

const jsCode = `
const fruits = ['apple', 'banana', 'orange']
const doubled = fruits.map(fruit => fruit.toUpperCase())
console.log(doubled)
`

const result = await highlighter.highlight(jsCode, 'javascript')

console.log(result.html)
```

### Highlighting TypeScript

```typescript
const tsCode = `
interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
}
`

const result = await highlighter.highlight(tsCode, 'typescript', {
  lineNumbers: true,
})
```

### Quick Highlight Function

```typescript
import { highlight } from 'ts-syntax-highlighter'

// Simple one-liner
const result = await highlight('const x = 42;', 'javascript')
```

## CLI Examples

### Basic File Highlighting

```bash
# Highlight a TypeScript file
syntax highlight src/index.ts typescript

# Save to file
syntax highlight src/app.js javascript --output highlighted.html

# With line numbers
syntax highlight utils.ts typescript --line-numbers --output result.html
```

### Different Themes

```bash
# GitHub Dark (default)
syntax highlight code.js javascript --theme github-dark

# GitHub Light
syntax highlight code.js javascript --theme github-light

# Nord
syntax highlight code.js javascript --theme nord
```

### Inline Code

```bash
# Generate inline code snippet
syntax highlight snippet.ts typescript --inline
```

### Information Commands

```bash
# List all supported languages
syntax languages

# List all themes
syntax themes

# Get info about a language
syntax info typescript

# Get info about a theme
syntax theme-info nord
```

## Theme Examples

### Using Different Themes

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const code = 'const message = "Hello World";'

// GitHub Dark
const darkHighlighter = await createHighlighter({ theme: 'github-dark' })
const darkResult = await darkHighlighter.highlight(code, 'javascript')

// GitHub Light
const lightHighlighter = await createHighlighter({ theme: 'github-light' })
const lightResult = await lightHighlighter.highlight(code, 'javascript')

// Nord
const nordHighlighter = await createHighlighter({ theme: 'nord' })
const nordResult = await nordHighlighter.highlight(code, 'javascript')
```

### Creating a Custom Theme

```typescript
import type { Theme } from 'ts-syntax-highlighter'

const monokai: Theme = {
  name: 'Monokai',
  type: 'dark',
  colors: {
    'editor.background': '#272822',
    'editor.foreground': '#F8F8F2',
    'editor.lineHighlightBackground': '#3E3D32',
    'editor.selectionBackground': '#49483E',
  },
  tokenColors: [
    {
      name: 'Comment',
      scope: ['comment'],
      settings: {
        foreground: '#75715E',
        fontStyle: 'italic',
      },
    },
    {
      name: 'String',
      scope: ['string'],
      settings: {
        foreground: '#E6DB74',
      },
    },
    {
      name: 'Number',
      scope: ['constant.numeric'],
      settings: {
        foreground: '#AE81FF',
      },
    },
    {
      name: 'Keyword',
      scope: ['keyword'],
      settings: {
        foreground: '#F92672',
      },
    },
    {
      name: 'Function',
      scope: ['entity.name.function'],
      settings: {
        foreground: '#A6E22E',
      },
    },
  ],
}

const highlighter = await createHighlighter()
await highlighter.loadTheme(monokai)

const result = await highlighter.highlight(code, 'javascript', {
  theme: monokai,
})
```

## Language Examples

### JavaScript

```typescript
const jsCode = `
// ES6+ Features
const greet = (name = 'World') => {
  return \`Hello, \${name}!\`
}

// Async/Await
async function fetchData() {
  const response = await fetch('/api/data')
  return response.json()
}

// Destructuring
const { id, name, ...rest } = user
`

const result = await highlighter.highlight(jsCode, 'javascript')
```

### TypeScript

```typescript
const tsCode = `
// Generics
function identity<T>(arg: T): T {
  return arg
}

// Type Guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Interfaces
interface Point {
  x: number
  y: number
}

// Type Aliases
type ID = string | number
`

const result = await highlighter.highlight(tsCode, 'typescript')
```

### HTML

```typescript
const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <div class="container">
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
  </div>
</body>
</html>
`

const result = await highlighter.highlight(htmlCode, 'html')
```

### CSS

```typescript
const cssCode = `
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}
`

const result = await highlighter.highlight(cssCode, 'css')
```

### STX Templates

```typescript
const stxCode = `
@extends('layouts.main')

@section('header')
  <h1>{{ title }}</h1>
@endsection

@section('content')
  @if (users.length > 0)
    <ul>
      @foreach (user in users)
        <li>{{ user.name }} - {{ user.email }}</li>
      @endforeach
    </ul>
  @else
    <p>No users found.</p>
  @endif
@endsection

{{-- This is a comment --}}

@ts
  const message = "TypeScript in STX!"
  console.log(message)
@endts
`

const result = await highlighter.highlight(stxCode, 'stx')
```

## Advanced Usage

### With Line Numbers and Highlighting

```typescript
const code = `
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const result = fibonacci(10)
console.log(result)
`

const result = await highlighter.highlight(code, 'javascript', {
  lineNumbers: true,
  highlightLines: [2, 3], // Highlight the base case
})
```

### Using Cache for Performance

```typescript
const highlighter = await createHighlighter({ cache: true })

// First call - tokenizes and caches
console.time('First')
await highlighter.highlight(largeCode, 'typescript')
console.timeEnd('First')

// Second call - uses cache
console.time('Cached')
await highlighter.highlight(largeCode, 'typescript')
console.timeEnd('Cached')

// Clear cache when needed
highlighter.clearCache()
```

### Custom Transformer Plugin

```typescript
import { createTransformerPlugin } from 'ts-syntax-highlighter'
import type { TokenLine } from 'ts-syntax-highlighter'

// Create a plugin that adds metadata to tokens
const metadataPlugin = createTransformerPlugin('metadata', {
  name: 'add-metadata',
  transform: (tokens: TokenLine[]) => {
    return tokens.map(line => ({
      ...line,
      tokens: line.tokens.map(token => ({
        ...token,
        // Add custom metadata
        metadata: {
          length: token.content.length,
          position: token.offset,
        },
      })),
    }))
  },
})

const highlighter = await createHighlighter({
  plugins: [metadataPlugin],
})
```

### Rendering in Different Formats

```typescript
const result = await highlighter.highlight(code, 'javascript')

// Full HTML page
const fullPage = `
<!DOCTYPE html>
<html>
<head>
  <style>${result.css}</style>
</head>
<body>
  ${result.html}
</body>
</html>
`

// Just the highlighted code block
const codeBlock = result.html

// Extract raw tokens for custom rendering
const tokens = result.tokens
```

### Integration with Web Frameworks

```typescript
// Example with a hypothetical framework
import { createHighlighter } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter()

// In your component
function CodeBlock({ code, lang }) {
  const result = await highlighter.highlight(code, lang, {
    lineNumbers: true,
  })

  return {
    html: result.html,
    css: result.css,
  }
}
```

### Batch Highlighting

```typescript
const files = [
  { code: jsCode, lang: 'javascript' },
  { code: tsCode, lang: 'typescript' },
  { code: cssCode, lang: 'css' },
]

const results = await Promise.all(
  files.map(({ code, lang }) =>
    highlighter.highlight(code, lang)
  )
)
```

### Custom Language Grammar

```typescript
import type { Language } from 'ts-syntax-highlighter'

const jsonLanguage: Language = {
  id: 'json',
  name: 'JSON',
  aliases: [],
  extensions: ['.json'],
  grammar: {
    name: 'JSON',
    scopeName: 'source.json',
    patterns: [
      {
        name: 'string.quoted.double.json',
        begin: '"',
        end: '"',
        patterns: [
          {
            name: 'constant.character.escape.json',
            match: '\\\\.',
          },
        ],
      },
      {
        name: 'constant.numeric.json',
        match: '-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?',
      },
      {
        name: 'constant.language.json',
        match: '\\b(true|false|null)\\b',
      },
    ],
  },
}

await highlighter.loadLanguage(jsonLanguage)
const result = await highlighter.highlight('{"name": "value"}', 'json')
```
