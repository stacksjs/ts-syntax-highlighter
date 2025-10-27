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
- 🎨 **48 Languages** - Comprehensive support for web, system, and specialized languages
- 🔥 **Modern Syntax** - Full support for ES2024+, BigInt, numeric separators, optional chaining, and more
- ⚛️ **JSX/TSX Support** - Complete React and TypeScript JSX highlighting
- 🎯 **CSS4 Features** - Modern color functions _(hwb, lab, lch, oklab, oklch)_, container queries, CSS layers
- 💪 **TypeScript-First** - Fully typed APIs with comprehensive type definitions
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

ts-syntax-highlighter supports **48 languages** across web development, systems programming, data formats, and specialized domains:

### Web & Frontend (10 languages)
- **JavaScript/JSX** - ES2024+, async/await, template literals, JSX
- **TypeScript/TSX** - Type annotations, generics, interfaces, TSX
- **HTML** - HTML5, data/aria attributes, event handlers
- **CSS** - Modern features, custom properties, CSS4 functions
- **SCSS/Sass** - Variables, nesting, mixins, functions
- **Vue** - Single-file components, directives, templates
- **GraphQL** - Queries, mutations, fragments, directives
- **Markdown** - Headings, emphasis, code blocks, tables, links
- **XML** - Elements, attributes, CDATA, namespaces
- **LaTeX** - Commands, environments, math mode

### System & Compiled Languages (10 languages)
- **C** - Preprocessor, pointers, functions
- **C++** - Classes, templates, namespaces, modern C++
- **Rust** - Ownership, traits, macros, lifetimes
- **Go** - Goroutines, interfaces, defer
- **C#** - LINQ, async/await, properties, attributes
- **Java** - Classes, generics, annotations
- **Swift** - Optionals, protocols, closures
- **Kotlin** - Null safety, coroutines, data classes
- **Dart** - Async, mixins, null safety

### Scripting & Dynamic Languages (5 languages)
- **Python** - Functions, classes, decorators, f-strings
- **Ruby** - Blocks, symbols, string interpolation
- **PHP** - Variables, functions, classes, HTML embedding
- **Lua** - Tables, functions, metatables
- **R** - Vectors, data frames, statistical functions

### Data & Configuration (8 languages)
- **JSON** - Objects, arrays, proper escaping
- **JSONC** - JSON with comments
- **JSON5** - Unquoted keys, trailing commas, comments
- **YAML** - Keys, nested structures, anchors
- **TOML** - Tables, arrays, data types
- **CSV** - Comma-separated values
- **IDL** - Interface definitions
- **Protobuf** - Messages, services, enums

### Shell & DevOps (7 languages)
- **Bash/Shell** - Variables, pipes, functions, control flow
- **PowerShell** - Cmdlets, pipelines, parameters
- **Dockerfile** - Instructions, multi-stage builds
- **Makefile** - Targets, variables, directives
- **Terraform/HCL** - Resources, variables, interpolation
- **Nginx** - Directives, server blocks, locations
- **CMD/Batch** - Commands, variables, control flow

### Specialized & Other (8 languages)
- **SQL** - Queries, DDL, DML, functions
- **Diff/Patch** - File headers, hunks, added/removed lines
- **RegExp** - Character classes, groups, quantifiers
- **BNF** - Grammar notation
- **ABNF** - Augmented BNF
- **Solidity** - Smart contracts, events, modifiers
- **Log** - Timestamps, log levels, stack traces
- **Text/Plain** - Plain text (no highlighting)

### STX
- Blade-like templating syntax
- 50+ directives
- Components, layouts, includes
- Control flow, loops
- Authentication, authorization

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

// Create tokenizer for a specific language (48 languages supported)
const tokenizer = new Tokenizer('javascript') // or any of the 48 supported languages

// Async tokenization (faster, recommended)
const tokens = await tokenizer.tokenizeAsync(code: string)

// Sync tokenization
const tokens = tokenizer.tokenize(code: string)

// Supported languages:
// 'javascript', 'typescript', 'html', 'css', 'json', 'stx',
// 'bash', 'markdown', 'yaml', 'jsonc', 'diff', 'python',
// 'php', 'java', 'c', 'cpp', 'rust', 'csharp', 'dockerfile',
// 'ruby', 'go', 'sql', 'idl', 'text', 'json5', 'vue', 'toml',
// 'scss', 'kotlin', 'swift', 'dart', 'r', 'graphql', 'powershell',
// 'makefile', 'terraform', 'bnf', 'regexp', 'lua', 'cmd', 'abnf',
// 'csv', 'log', 'nginx', 'xml', 'protobuf', 'solidity', 'latex'
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
  type: string // Token scope (e.g., 'keyword.control.js', 'string.quoted.double.ts')
  content: string // The actual text content
  line: number // Line number (0-indexed)
  startIndex: number // Character position in the line
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
