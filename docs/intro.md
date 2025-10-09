# Introduction

ts-syntax-highlighter is a blazing-fast, TypeScript-native syntax highlighter designed for modern web development. It provides comprehensive grammar support for 6 popular web languages with an emphasis on performance and accuracy.

## Why ts-syntax-highlighter?

### Performance First

Performance is a core design principle. ts-syntax-highlighter is **7.5-76x faster** than popular alternatives:

| Operation | ts-syntax-highlighter (Fast) | highlight.js | Prism.js | Best Speedup |
|-----------|------------------------------|--------------|----------|--------------|
| JavaScript tokenization | ~0.05ms | ~3.8ms | ~2.1ms | **76x faster** |
| TypeScript tokenization | ~0.08ms | ~1.0ms | ~0.6ms | **12x faster** |
| HTML tokenization | ~0.04ms | ~1.2ms | ~0.8ms | **30x faster** |
| CSS tokenization | ~0.03ms | ~0.9ms | ~0.5ms | **30x faster** |

The library offers two tokenization modes:
- **Fast Mode (Async)**: Optimized for maximum performance with worker-like characteristics
- **Sync Mode**: Simpler API, still 1.5-2x faster than both highlight.js and Prism.js

### Modern Syntax Support

Unlike many syntax highlighters that lag behind language evolution, ts-syntax-highlighter supports the latest features:

- **ES2024+ JavaScript**: BigInt literals, numeric separators, optional chaining, nullish coalescing
- **JSX/TSX**: Full React and TypeScript JSX support with embedded expressions
- **CSS4**: Modern color functions (hwb, lab, lch, oklab, oklch), container queries, CSS layers
- **TypeScript**: Type operators (is, keyof, infer), utility types, decorators

### TypeScript-First

Built with TypeScript from the ground up:
- Fully typed APIs for excellent IDE support
- Type-safe grammar definitions
- Comprehensive type exports for extensibility

### Zero Dependencies

The library has no runtime dependencies, keeping your bundle size minimal. Everything you need is included in one lightweight package.

### Battle-Tested

With **416 comprehensive tests** covering all language features, you can trust ts-syntax-highlighter to handle edge cases correctly.

## Supported Languages

### JavaScript/JSX
Complete support for modern JavaScript and JSX:
- All ES2024+ features
- JSX elements and embedded expressions
- Template literals with interpolation
- Regular expressions with all flags
- Async/await and generators
- Modern operators and syntax

### TypeScript/TSX
Everything in JavaScript plus TypeScript-specific features:
- Type annotations and assertions
- Interfaces, types, and enums
- Generics and type parameters
- TypeScript operators: `is`, `keyof`, `infer`
- TSX (TypeScript JSX)
- Utility types and mapped types

### HTML
Modern HTML5 with accessibility features:
- All HTML5 elements
- Data attributes (`data-*`)
- ARIA attributes (`aria-*`)
- Event handlers
- HTML entities
- DOCTYPE declarations

### CSS
Cutting-edge CSS features:
- Modern color functions: `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`
- Math functions: `calc()`, `min()`, `max()`, `clamp()`, `round()`, `abs()`, `sign()`
- Trigonometric: `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`
- Gradients: `linear-gradient()`, `radial-gradient()`, `conic-gradient()`
- At-rules: `@media`, `@keyframes`, `@supports`, `@container`, `@layer`, `@property`
- CSS custom properties: `--variable`, `var(--variable)`

### JSON
Spec-compliant JSON highlighting:
- Objects and arrays
- Proper escape sequence handling
- Scientific notation for numbers
- Invalid escape detection

### STX
Blade-like templating language with 50+ directives:
- Components, layouts, includes
- Control flow and loops
- Authentication and authorization
- And much more

## How It Works

ts-syntax-highlighter uses TextMate-style grammars to tokenize code. Each grammar defines:

1. **Keywords**: Language-specific keywords with their semantic types
2. **Patterns**: Regular expression patterns to match syntax elements
3. **Repository**: Reusable pattern definitions for complex structures

The tokenizer processes source code character by character, matching patterns and producing tokens with:
- **Type**: Semantic scope (e.g., `keyword.control.js`, `string.quoted.double.ts`)
- **Content**: The actual text matched
- **Position**: Line number and character index

These tokens can then be styled using CSS, themed, or processed for other purposes.

## Getting Started

Ready to dive in? Head over to the [Installation](/install) guide to get started, or check out [Usage](/usage) for detailed examples.

## Philosophy

ts-syntax-highlighter is built on these principles:

1. **Performance Matters**: Fast tokenization enables real-time highlighting
2. **Modern Standards**: Support the latest language features developers use today
3. **Type Safety**: TypeScript provides better DX and catches errors early
4. **Simplicity**: Clean, intuitive API that's easy to integrate
5. **Reliability**: Comprehensive testing ensures correctness

## Acknowledgments

This project draws inspiration from:
- TextMate grammars and VSCode's tokenization engine
- highlight.js and Prism.js for their pioneering work in syntax highlighting
- The broader open-source community for pushing web development forward
