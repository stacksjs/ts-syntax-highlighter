# Custom Themes

Create beautiful syntax highlighting themes by mapping token scopes to colors and styles.

## Understanding Scopes

ts-syntax-highlighter uses TextMate-style scope names to classify tokens:

```typescript
// Example token scopes
'keyword.control.js' // if, for, while, return
'storage.type.js' // const, let, var, function
'string.quoted.double.js' // "string"
'constant.numeric.js' // 42, 3.14
'entity.name.function.js' // function names
'comment.line.double-slash.js' // // comments
```

## Scope Hierarchy

Scopes follow a hierarchical pattern:

```
category.subcategory.language

Examples:
├── keyword
│   ├── keyword.control.js        (if, else, for)
│   └── keyword.operator.js       (===, !==, +)
├── storage
│   └── storage.type.js           (const, let, class)
├── string
│   ├── string.quoted.double.js   ("string")
│   └── string.template.js        (`template`)
├── constant
│   ├── constant.numeric.js       (123)
│   └── constant.language.js      (true, false, null)
└── entity
    └── entity.name.function.js   (functionName)
```

## Creating a Theme

### 1. Extract All Scopes

First, tokenize code to discover all scopes:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

function extractScopes(code: string, language: string): Set<string> {
  const tokenizer = new Tokenizer(language)
  const tokens = tokenizer.tokenize(code)
  const scopes = new Set<string>()

  tokens.forEach((line) => {
    line.tokens.forEach((token) => {
      scopes.add(token.type)
    })
  })

  return scopes
}

// Usage
const code = `
const greeting = "Hello World"
console.log(greeting)
`

const scopes = extractScopes(code, 'javascript')
console.log(Array.from(scopes).sort())
// [
//   'constant.numeric.js',
//   'entity.name.function.js',
//   'punctuation.js',
//   'storage.type.js',
//   'string.quoted.double.js'
// ]
```

### 2. Define Color Palette

```typescript
interface ThemePalette {
  background: string
  foreground: string
  comment: string
  keyword: string
  storage: string
  string: string
  number: string
  function: string
  operator: string
  punctuation: string
  variable: string
  type: string
  constant: string
}

// Dark theme palette
const darkPalette: ThemePalette = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  comment: '#6a9955',
  keyword: '#569cd6',
  storage: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  function: '#dcdcaa',
  operator: '#d4d4d4',
  punctuation: '#d4d4d4',
  variable: '#9cdcfe',
  type: '#4ec9b0',
  constant: '#4fc1ff',
}

// Light theme palette
const lightPalette: ThemePalette = {
  background: '#ffffff',
  foreground: '#000000',
  comment: '#008000',
  keyword: '#0000ff',
  storage: '#0000ff',
  string: '#a31515',
  number: '#098658',
  function: '#795e26',
  operator: '#000000',
  punctuation: '#000000',
  variable: '#001080',
  type: '#267f99',
  constant: '#0000ff',
}
```

### 3. Map Scopes to Colors

```typescript
function scopeToColor(scope: string, palette: ThemePalette): string {
  // Keyword scopes
  if (scope.includes('keyword.control'))
    return palette.keyword
  if (scope.includes('keyword.operator'))
    return palette.operator

  // Storage scopes
  if (scope.includes('storage.type'))
    return palette.storage

  // String scopes
  if (scope.includes('string.quoted'))
    return palette.string
  if (scope.includes('string.template'))
    return palette.string

  // Number scopes
  if (scope.includes('constant.numeric'))
    return palette.number

  // Function scopes
  if (scope.includes('entity.name.function'))
    return palette.function

  // Comment scopes
  if (scope.includes('comment'))
    return palette.comment

  // Type scopes
  if (scope.includes('entity.name.type'))
    return palette.type
  if (scope.includes('storage.type'))
    return palette.type

  // Constant scopes
  if (scope.includes('constant.language'))
    return palette.constant

  // Variable scopes
  if (scope.includes('variable'))
    return palette.variable

  // Default
  return palette.foreground
}
```

### 4. Generate CSS

```typescript
function generateThemeCSS(palette: ThemePalette, scopes: Set<string>): string {
  let css = `/* Syntax highlighting theme */\n\n`

  // Background and foreground
  css += `pre, code {\n`
  css += `  background-color: ${palette.background};\n`
  css += `  color: ${palette.foreground};\n`
  css += `}\n\n`

  // Generate rules for each scope
  Array.from(scopes).sort().forEach((scope) => {
    const className = scope.replace(/\./g, '-')
    const color = scopeToColor(scope, palette)

    css += `.${className} {\n`
    css += `  color: ${color};\n`
    css += `}\n\n`
  })

  return css
}

// Usage
const code = fs.readFileSync('example.js', 'utf-8')
const scopes = extractScopes(code, 'javascript')
const css = generateThemeCSS(darkPalette, scopes)

fs.writeFileSync('theme.css', css)
```

## Complete Theme Example

### VS Code Dark+ Theme

```typescript
const vscDarkTheme = {
  'background': '#1e1e1e',
  'foreground': '#d4d4d4',

  // Comments
  'comment.line': '#6a9955',
  'comment.block': '#6a9955',

  // Keywords
  'keyword.control': '#c586c0',
  'keyword.operator': '#d4d4d4',

  // Storage
  'storage.type': '#569cd6',

  // Strings
  'string.quoted.double': '#ce9178',
  'string.quoted.single': '#ce9178',
  'string.template': '#ce9178',

  // Numbers
  'constant.numeric': '#b5cea8',

  // Functions
  'entity.name.function': '#dcdcaa',

  // Types
  'entity.name.type': '#4ec9b0',
  'support.type': '#4ec9b0',

  // Constants
  'constant.language': '#569cd6',

  // Variables
  'variable': '#9cdcfe',

  // Operators
  'operator': '#d4d4d4',

  // Punctuation
  'punctuation': '#d4d4d4',
}
```

### GitHub Light Theme

```typescript
const githubLightTheme = {
  'background': '#ffffff',
  'foreground': '#24292e',

  // Comments
  'comment.line': '#6a737d',
  'comment.block': '#6a737d',

  // Keywords
  'keyword.control': '#d73a49',
  'keyword.operator': '#d73a49',

  // Storage
  'storage.type': '#d73a49',

  // Strings
  'string.quoted.double': '#032f62',
  'string.quoted.single': '#032f62',
  'string.template': '#032f62',

  // Numbers
  'constant.numeric': '#005cc5',

  // Functions
  'entity.name.function': '#6f42c1',

  // Types
  'entity.name.type': '#005cc5',

  // Constants
  'constant.language': '#005cc5',

  // Variables
  'variable': '#24292e',

  // Operators
  'operator': '#d73a49',

  // Punctuation
  'punctuation': '#24292e',
}
```

## Applying Themes

### HTML + CSS

```typescript
function highlightWithTheme(
  code: string,
  language: string,
  theme: Record<string, string>
): string {
  const tokenizer = new Tokenizer(language)
  const tokens = tokenizer.tokenize(code)

  let html = '<pre style="'
  html += `background-color: ${theme.background};`
  html += `color: ${theme.foreground};`
  html += `padding: 1em;`
  html += `border-radius: 4px;`
  html += '"><code>'

  tokens.forEach((line) => {
    line.tokens.forEach((token) => {
      const color = findColorForScope(token.type, theme)
      const escaped = escapeHtml(token.content)

      if (color) {
        html += `<span style="color: ${color}">${escaped}</span>`
      }
      else {
        html += escaped
      }
    })
    html += '\n'
  })

  html += '</code></pre>'
  return html
}

function findColorForScope(
  scope: string,
  theme: Record<string, string>
): string | null {
  // Exact match
  if (theme[scope])
    return theme[scope]

  // Partial match (most specific first)
  const parts = scope.split('.')
  for (let i = parts.length; i > 0; i--) {
    const partial = parts.slice(0, i).join('.')
    if (theme[partial])
      return theme[partial]
  }

  return null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
```

### CSS Classes

```typescript
function highlightWithClasses(code: string, language: string): string {
  const tokenizer = new Tokenizer(language)
  const tokens = tokenizer.tokenize(code)

  let html = '<pre><code>'

  tokens.forEach((line) => {
    line.tokens.forEach((token) => {
      const className = token.type.replace(/\./g, '-')
      const escaped = escapeHtml(token.content)
      html += `<span class="${className}">${escaped}</span>`
    })
    html += '\n'
  })

  html += '</code></pre>'
  return html
}
```

## Advanced Theming

### Font Styles

```typescript
interface TokenStyle {
  color: string
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  textDecoration?: 'none' | 'underline'
}

const advancedTheme: Record<string, TokenStyle> = {
  'comment.line': {
    color: '#6a9955',
    fontStyle: 'italic',
  },
  'keyword.control': {
    color: '#c586c0',
    fontWeight: 'bold',
  },
  'string.quoted': {
    color: '#ce9178',
  },
  'entity.name.function': {
    color: '#dcdcaa',
    fontWeight: 'bold',
  },
}

function applyAdvancedStyle(scope: string): string {
  const style = advancedTheme[scope]
  if (!style)
    return ''

  let css = `color: ${style.color};`
  if (style.fontWeight)
    css += ` font-weight: ${style.fontWeight};`
  if (style.fontStyle)
    css += ` font-style: ${style.fontStyle};`
  if (style.textDecoration)
    css += ` text-decoration: ${style.textDecoration};`

  return css
}
```

### Semantic Coloring

```typescript
function getSemanticColor(token: Token, context: Context): string {
  // Color based on context
  if (token.type.includes('variable')) {
    if (context.isParameter)
      return '#9cdcfe'
    if (context.isConstant)
      return '#4fc1ff'
    if (context.isGlobal)
      return '#4ec9b0'
    return '#9cdcfe'
  }

  return getDefaultColor(token.type)
}
```

## Pre-built Themes

### Popular Themes

```typescript
import {
  draculaTheme,
  githubLightTheme,
  monokaiTheme,
  solarizedDarkTheme,
  solarizedLightTheme,
  vscDarkTheme
} from 'ts-syntax-highlighter/themes'

// Apply theme
const html = highlightWithTheme(code, 'javascript', draculaTheme)
```

## Next Steps

- Learn about [Batch Processing](/advanced/batch-processing)
- Explore [Code Analysis](/usage#code-statistics)
- Check out [Performance Tuning](/config#performance-tuning)
