---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "ts-syntax-highlighter"
  text: "Production-Ready Syntax Highlighting"
  tagline: "48 languages, 661 passing tests, zero dependencies. The most comprehensive TypeScript-native syntax highlighter built for speed and reliability."
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
  - title: "🎨 48 Languages"
    icon: "🎨"
    details: "Comprehensive support for web, system, programming, and specialized languages. From JavaScript to Rust, Bash to YAML, we've got you covered with battle-tested grammars."
    link: /grammars
    linkText: "Explore All Languages"

  - title: "⚡ Lightning Fast"
    icon: "⚡"
    details: "500K+ lines per second with zero-copy tokenization and fast-path optimization. Smart character classification and pre-compiled patterns make it blazing fast for real-time highlighting."
    link: /features/performance
    linkText: "See Benchmarks"

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

  - title: "✅ 661 Passing Tests"
    icon: "✅"
    details: "100% test pass rate with 1,448 assertions validated. Every language feature is battle-tested with comprehensive edge case coverage. Zero failures, production-ready reliability."
    link: /advanced/testing
    linkText: "View Test Coverage"

  - title: "📦 Zero Dependencies"
    icon: "📦"
    details: "Just ~50KB with no external runtime dependencies. Pure TypeScript implementation means faster builds, smaller bundles, and no supply chain vulnerabilities."

  - title: "🔧 TextMate Grammars"
    icon: "🔧"
    details: "Full support for TextMate-style grammars with capture groups, begin/end patterns, and repository includes. Compatible with VS Code grammar extensions."
    link: /advanced/custom-grammars
    linkText: "Learn More"

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

Get started in seconds - it's really that simple:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { javascriptGrammar } from 'ts-syntax-highlighter/grammars'

// Create a tokenizer for JavaScript
const tokenizer = new Tokenizer(javascriptGrammar)

// Tokenize your code
const code = `
const greet = (name) => {
  console.log(\`Hello, \${name}!\`)
}
`

const tokens = tokenizer.tokenize(code)

// Each token has rich information
tokens.forEach(line => {
  line.tokens.forEach(token => {
    console.log({
      content: token.content,      // The actual text
      scopes: token.scopes,         // Full scope hierarchy
      type: token.type,             // Token type
      line: token.line,             // Line number
      offset: token.offset          // Character position
    })
  })
})
```

Want to highlight Rust? Python? Bash? Just import a different grammar - they all work the same way!

## Performance That Matters

We obsess over speed so you don't have to. Here's what makes us fast:

### Real-World Speed

```
📊 Tokenization Throughput
├─ 500,000+ lines/second
├─ <1ms for typical code files
└─ <1MB memory for 10,000 lines

⚡ Optimization Techniques
├─ Zero-copy string operations
├─ O(1) character classification
├─ Pre-compiled regex patterns
├─ Smart fast-path detection
└─ Minimal heap allocations
```

### Why It's Fast

**Smart Fast Paths** - Common patterns like keywords, numbers, and operators use optimized character lookup tables instead of regex. Think of it like having express lanes for the most common tokens.

**Zero-Copy Design** - We never create substrings during tokenization. Instead, we work directly with the original string using offsets. This saves massive amounts of memory and GC pressure.

**Pre-Compiled Patterns** - All regex patterns are compiled once during initialization, not on every match. Combined with efficient caching, this eliminates repeated compilation overhead.

**Character Type Tables** - A simple `Uint8Array` lookup table classifies characters in O(1) time. Is it a letter? Number? Operator? One array access tells us everything.

[Deep dive into performance optimizations →](/features/performance)

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

## 48 Languages, Ready to Go

We support everything from web development to systems programming. Each language is thoroughly tested and production-ready:

### Web & Frontend (10 Languages)
**JavaScript** • **TypeScript** • **JSX/TSX** • **HTML** • **CSS** • **SCSS** • **JSON** • **JSONC** • **JSON5** • **XML** • **Vue**

Modern features you expect: ES2024+, optional chaining, BigInt, template literals, async/await, decorators, and more.

### Systems & DevOps (7 Languages)
**Bash** • **PowerShell** • **Dockerfile** • **YAML** • **TOML** • **Makefile** • **CMD**

Full support for variables (`$VAR`, `${VAR}`), pipes, control flow, and all the shell scripting features you use daily.

### Programming Languages (20 Languages)
**Python** • **Java** • **C** • **C++** • **C#** • **Go** • **Rust** • **Swift** • **Kotlin** • **Dart** • **PHP** • **Ruby** • **R** • **Solidity** • **Lua** • **GraphQL** • **IDL** • **Protobuf** • **LaTeX**

From web backends to systems programming, smart contracts to data science - we've got you covered.

### Data & Specialized (11 Languages)
**SQL** • **Markdown** • **Diff** • **Terraform** • **Nginx** • **CSV** • **RegExp** • **BNF** • **ABNF** • **Log** • **Text**

Configuration files, data formats, and domain-specific languages all work seamlessly.

### What Makes Our Language Support Special?

**Battle-Tested** - Every language has comprehensive tests covering edge cases, modern syntax, and real-world code patterns.

**Accurate Tokenization** - We don't just highlight keywords. Capture groups and scope hierarchies ensure precise token classification.

**Consistent API** - All 48 languages use the exact same API. Learn once, use everywhere.

**No Surprises** - Variables in Bash? Function calls in C? Lifetimes in Rust? We handle the tricky stuff so you don't have to think about it.

[Explore detailed language features →](/grammars)

## Get Started

```bash
# Install
npm install ts-syntax-highlighter

# Or with Bun
bun add ts-syntax-highlighter
```

[Read the full documentation →](/intro)

<Home />
