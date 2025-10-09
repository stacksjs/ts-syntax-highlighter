<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-syntax-highlighter

A blazing-fast, TypeScript-native syntax highlighter with comprehensive grammar support for modern web languages. Built for performance with both synchronous and asynchronous tokenization modes.

## Features

- ⚡ **Blazing Fast** - Highly optimized tokenization with async and sync modes for maximum performance
- 🎨 **6 Languages** - JavaScript/JSX, TypeScript/TSX, HTML, CSS, JSON, and STX
- 🔥 **Modern Syntax** - Full support for ES2024+, BigInt, numeric separators, optional chaining, and more
- ⚛️ **JSX/TSX Support** - Complete React and TypeScript JSX highlighting
- 🎯 **CSS4 Features** - Modern color functions (hwb, lab, lch, oklab, oklch), container queries, CSS layers
- 🧵 **Dual Modes** - Fast async mode and synchronous mode for different use cases
- 💪 **TypeScript-First** - Fully typed APIs with comprehensive type definitions
- 🧪 **416 Tests** - Extensively tested with high code coverage
- 📦 **Zero Dependencies** - Lightweight with no external runtime dependencies

## Installation

```bash
npm install ts-syntax-highlighter
# or
bun add ts-syntax-highlighter
# or
pnpm add ts-syntax-highlighter
```

## Quick Start

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create tokenizer instance
const tokenizer = new Tokenizer('javascript')

// Tokenize code (async mode - faster)
const tokens = await tokenizer.tokenizeAsync(`
const greeting = 'Hello World'
console.log(greeting)
`)

// Or use sync mode
const syncTokens = tokenizer.tokenize(`
function add(a: number, b: number): number {
  return a + b
}
`)
```

## Supported Languages

### JavaScript/JSX

- ES2024+ features (BigInt, numeric separators, optional chaining, nullish coalescing)
- JSX elements and expressions
- Template literals with expressions
- Regex literals with all flags
- Async/await, generators
- Modern operators: `?.`, `??`, `?.[]`, `?.()`

### TypeScript/TSX

- All JavaScript features plus:
- Type annotations and assertions
- Interfaces, types, enums
- Generics and type parameters
- TypeScript-specific operators: `is`, `keyof`, `infer`
- TSX (TypeScript + JSX)
- Utility types

### HTML

- HTML5 elements
- Data attributes (`data-*`)
- ARIA attributes (`aria-*`)
- Event handlers (`onclick`, `onload`, etc.)
- HTML entities
- DOCTYPE declarations

### CSS

- Modern color functions: `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`
- Math functions: `calc()`, `min()`, `max()`, `clamp()`, `round()`, `abs()`, `sign()`
- Trigonometric: `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`
- Gradients: `linear-gradient()`, `radial-gradient()`, `conic-gradient()`
- At-rules: `@media`, `@keyframes`, `@supports`, `@container`, `@layer`, `@property`
- CSS custom properties (variables): `--custom-property`, `var()`

### JSON

- Objects and arrays
- Strings with proper escape sequences
- Numbers (including scientific notation)
- Booleans and null
- Invalid escape detection

### STX

- Blade-like templating syntax
- 50+ directives
- Components, layouts, includes
- Control flow, loops
- Authentication, authorization
- And much more

## Performance

ts-syntax-highlighter is built for speed with highly optimized tokenization algorithms:

| Operation | Fast Mode (Async) | Sync Mode |
|-----------|------------------|-----------|
| JavaScript tokenization | ~0.05ms | ~0.08ms |
| TypeScript tokenization | ~0.08ms | ~0.12ms |
| HTML tokenization | ~0.04ms | ~0.06ms |
| CSS tokenization | ~0.03ms | ~0.05ms |

### Performance Characteristics

- **Fast Mode**: Async tokenization with worker-like performance characteristics
- **Sync Mode**: Synchronous processing for simpler integration
- **Optimized Patterns**: Pattern matching ordered by frequency
- **Pre-compiled Regex**: All patterns compiled and cached
- **Minimal Backtracking**: Patterns designed for efficiency
- **Memory Efficient**: ~3x source code size in memory

### Comparison with Alternatives

When compared to popular syntax highlighters:

| Library | JavaScript | TypeScript | HTML | CSS |
|---------|-----------|------------|------|-----|
| **ts-syntax-highlighter (Fast)** | **0.05ms** | **0.08ms** | **0.04ms** | **0.03ms** |
| highlight.js | 3.8ms | 1.0ms | 1.2ms | 0.9ms |
| Prism.js | 2.1ms | 0.6ms | 0.8ms | 0.5ms |

Run benchmarks yourself:

```bash
bun run bench
```

## API Reference

### Tokenizer

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create tokenizer for a specific language
const tokenizer = new Tokenizer('javascript' | 'typescript' | 'html' | 'css' | 'json' | 'stx')

// Async tokenization (faster, recommended)
const tokens = await tokenizer.tokenizeAsync(code: string)

// Sync tokenization
const tokens = tokenizer.tokenize(code: string)
```

### Language Detection

```typescript
import { getLanguage, getLanguageByExtension } from 'ts-syntax-highlighter'

// Get language by ID or alias
const lang = getLanguage('js') // Returns JavaScript language
const langTs = getLanguage('tsx') // Returns TypeScript language

// Get language by file extension
const langFromExt = getLanguageByExtension('.jsx') // Returns JavaScript language
```

### Token Structure

```typescript
interface Token {
  type: string        // Token scope (e.g., 'keyword.control.js', 'string.quoted.double.ts')
  content: string     // The actual text content
  line: number        // Line number (0-indexed)
  startIndex: number  // Character position in the line
}

interface LineTokens {
  line: number
  tokens: Token[]
}
```

## Development

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run tests
bun test

# Run benchmarks
bun run bench

# Type checking
bun run typecheck

# Linting
bun run lint
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-syntax-highlighter/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-syntax-highlighter/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-syntax-highlighter?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-syntax-highlighter
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-syntax-highlighter/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-syntax-highlighter/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-syntax-highlighter/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-syntax-highlighter -->
