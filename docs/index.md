---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "ts-syntax-highlighter"
  text: "Blazing-Fast Syntax Highlighting"
  tagline: "TypeScript-native syntax highlighter with comprehensive grammar support for modern web languages. Highly optimized for performance."
  image: /images/logo-white.png
  actions:
    - theme: brand
      text: Get Started
      link: /intro
    - theme: alt
      text: View API Reference
      link: /api
    - theme: alt
      text: View on GitHub
      link: https://github.com/stacksjs/ts-syntax-highlighter

features:
  - title: "⚡ Blazing Fast"
    icon: "⚡"
    details: "Highly optimized tokenization with dual modes. Async mode provides maximum performance with ~0.05ms for JavaScript, while sync mode offers simplicity without sacrificing speed."
    link: /features/performance
    linkText: "See Benchmarks"

  - title: "🎨 6 Languages Supported"
    icon: "🎨"
    details: "JavaScript/JSX, TypeScript/TSX, HTML, CSS, JSON, and STX. Each with full support for modern syntax and language features."
    link: /grammars
    linkText: "Explore Languages"

  - title: "🔥 Modern Syntax Support"
    icon: "🔥"
    details: "ES2024+ features including BigInt literals, numeric separators, optional chaining, nullish coalescing, private fields, and all the latest JavaScript/TypeScript features."
    link: /features/modern-syntax
    linkText: "View Features"

  - title: "⚛️ Complete JSX/TSX"
    icon: "⚛️"
    details: "First-class React and TypeScript JSX support with embedded expressions, components, fragments, and generics. Works with React, Preact, and Solid."
    link: /features/jsx-tsx
    linkText: "Learn More"

  - title: "🎯 CSS4 Ready"
    icon: "🎯"
    details: "Modern color functions (hwb, lab, lch, oklab, oklch), container queries, CSS layers, math functions, trigonometry, and custom properties."
    link: /grammars#css
    linkText: "View CSS Features"

  - title: "💪 TypeScript-First"
    icon: "💪"
    details: "Built with TypeScript from the ground up. Fully typed APIs, comprehensive type exports, and excellent IDE support for the best developer experience."
    link: /api#types
    linkText: "Explore Types"

  - title: "🧪 416 Tests"
    icon: "🧪"
    details: "Extensively tested with comprehensive coverage of all language features, edge cases, and modern syntax. Battle-tested reliability you can trust."

  - title: "📦 Zero Dependencies"
    icon: "📦"
    details: "Lightweight with no external runtime dependencies. Pure TypeScript implementation keeps your bundle size minimal and builds fast."

  - title: "🚀 Dual Modes"
    icon: "🚀"
    details: "Choose async mode for maximum performance or sync mode for simplicity. Both modes are highly optimized with pre-compiled patterns and efficient memory usage."
    link: /config#tokenization-modes
    linkText: "Compare Modes"

  - title: "🎨 Custom Themes"
    icon: "🎨"
    details: "Easy theme creation with TextMate-style scopes. Map token types to colors, create VS Code themes, or build your own from scratch."
    link: /advanced/custom-themes
    linkText: "Create Themes"

  - title: "📊 Batch Processing"
    icon: "📊"
    details: "Built-in support for processing multiple files efficiently with concurrency control, progress tracking, caching, and error handling."
    link: /advanced/batch-processing
    linkText: "Learn More"

  - title: "🔧 Easy Integration"
    icon: "🔧"
    details: "Works seamlessly in Node.js, Bun, Deno, and browsers. Simple API that's easy to learn and integrate into any project."
    link: /usage
    linkText: "View Examples"
---

## Quick Example

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

// Create tokenizer
const tokenizer = new Tokenizer('javascript')

// Tokenize code (async - faster)
const tokens = await tokenizer.tokenizeAsync(`
const greeting = 'Hello World'
console.log(greeting)
`)

// Process tokens
tokens.forEach((line) => {
  line.tokens.forEach((token) => {
    console.log(`${token.type}: "${token.content}"`)
  })
})
```

## Performance

ts-syntax-highlighter is optimized for speed with efficient tokenization:

### Our Performance

| Operation | Fast Mode (Async) | Sync Mode |
|-----------|------------------|-----------|
| JavaScript | **0.05ms** | 0.08ms |
| TypeScript | **0.08ms** | 0.12ms |
| HTML | **0.04ms** | 0.06ms |
| CSS | **0.03ms** | 0.05ms |

### Compared to Alternatives

| Library | JavaScript | TypeScript | HTML | CSS |
|---------|-----------|------------|------|-----|
| **ts-syntax-highlighter** | **0.05ms** | **0.08ms** | **0.04ms** | **0.03ms** |
| highlight.js | 3.8ms | 1.0ms | 1.2ms | 0.9ms |
| Prism.js | 2.1ms | 0.6ms | 0.8ms | 0.5ms |

Fast enough for real-time syntax highlighting as you type. [View detailed benchmarks →](/features/performance)

## Why ts-syntax-highlighter?

### Built for Modern Development

Support for the latest language features out-of-the-box:
- **ES2024+**: BigInt, numeric separators, optional chaining
- **TypeScript 5.x**: Type operators, utility types, decorators
- **JSX/TSX**: Complete React and TypeScript JSX support
- **CSS4**: Modern color functions, container queries, layers

### Performance That Matters

Real-time syntax highlighting requires speed:
- **Sub-millisecond** tokenization for most operations
- **Non-blocking** async mode for large files
- **Minimal memory** footprint (~3x source size)
- **Scales** to millions of lines efficiently

### Developer Experience

TypeScript-first design for the best DX:
- **Fully typed** APIs with IntelliSense support
- **Comprehensive** documentation and examples
- **Simple** and intuitive API
- **Flexible** configuration options

## Supported Languages

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;">
  <div>
    <h3>JavaScript/JSX</h3>
    <p>ES2024+, React JSX, BigInt, regex flags</p>
  </div>
  <div>
    <h3>TypeScript/TSX</h3>
    <p>Types, generics, TSX, type operators</p>
  </div>
  <div>
    <h3>HTML</h3>
    <p>HTML5, ARIA, data attributes, entities</p>
  </div>
  <div>
    <h3>CSS</h3>
    <p>CSS4 colors, math, containers, layers</p>
  </div>
  <div>
    <h3>JSON</h3>
    <p>Objects, arrays, proper escapes</p>
  </div>
  <div>
    <h3>STX</h3>
    <p>Blade-like templating, 50+ directives</p>
  </div>
</div>

[Explore all language features →](/grammars)

## Get Started

```bash
# Install
npm install ts-syntax-highlighter

# Or with Bun
bun add ts-syntax-highlighter
```

[Read the full documentation →](/intro)

<Home />
