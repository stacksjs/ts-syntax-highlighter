# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ts-syntax-highlighter is a blazing-fast, TypeScript-native syntax highlighter with comprehensive grammar support for 6 modern web languages (JavaScript/JSX, TypeScript/TSX, HTML, CSS, JSON, STX). Built for performance with both synchronous and asynchronous tokenization modes.

## Monorepo Structure

This is a Bun-based monorepo with workspaces:
- `packages/ts-syntax-highlighter/` - Main syntax highlighter library
- `packages/benchmarks/` - Performance benchmarking suite
- `docs/` - VitePress documentation

Within `packages/ts-syntax-highlighter/`:
- `src/` - Source code with modular architecture
- `test/` - Test files (416 tests total)
- `bin/` - CLI implementation
- `examples/` - Usage examples

## Development Commands

```bash
# Build the library (uses build.ts with bun-plugin-dtsx)
bun run build

# Run all tests (uses Bun's native test runner)
bun test

# Type checking
bun run typecheck

# Linting
bun run lint
bun run lint:fix

# Run benchmarks
bun run bench

# Documentation
bun run dev:docs
bun run build:docs
```

### Testing Commands

Run all tests:
```bash
bun test
```

Run a specific test file:
```bash
bun test packages/ts-syntax-highlighter/test/tokenizer.test.ts
```

Run tests matching a pattern:
```bash
bun test --test-name-pattern "should tokenize"
```

## Architecture

### Core Components

1. **Tokenizer** (`src/tokenizer.ts`, `src/fast-tokenizer.ts`)
   - Main tokenization engine with sync and async modes
   - Uses grammar patterns to identify tokens
   - Fast mode optimized for performance with minimal overhead
   - Standard mode includes full token metadata (scopes, offsets, etc.)

2. **Highlighter** (`src/highlighter.ts`)
   - High-level API orchestrating tokenization and rendering
   - Manages language/theme loading
   - Optional caching system for highlighted code
   - Entry point: `createHighlighter(options)` factory function

3. **Renderer** (`src/renderer.ts`)
   - Converts tokens to HTML/ANSI output
   - Handles line numbers, highlighting, annotations
   - Supports transformers for custom token/line processing

4. **Grammars** (`src/grammars/`)
   - Language-specific tokenization rules
   - Each grammar defines patterns, scopes, and keyword tables
   - Languages: javascript.ts, typescript.ts, html.ts, css.ts, json.ts, stx.ts
   - TextMate-inspired grammar format with optimizations

5. **Themes** (`src/themes/`)
   - Color schemes for rendering
   - VSCode-compatible theme format
   - Supports light/dark modes via `src/dual-theme.ts`

6. **Plugins** (`src/plugins.ts`)
   - Extensibility system for custom languages/themes/transformers

7. **Transformers** (`src/transformers.ts`)
   - Token and line transformers for advanced features
   - Line highlighting, dimming, blurring, focus modes
   - Added/removed line indicators for diffs

### Key Design Patterns

- **Dual-mode tokenization**: Async (fast) and sync modes for different use cases
- **Grammar-based**: TextMate-style patterns with keyword optimization
- **Plugin architecture**: Extensible for custom languages and transformers
- **Streaming support**: `src/streaming.ts` for large files
- **Performance profiling**: `src/profiler.ts` for optimization
- **Language detection**: `src/detect.ts` for automatic language identification

## TypeScript Conventions

- Use TypeScript for all code; **prefer interfaces over types**
- **Avoid enums**; use maps or `as const` instead
- Avoid usage of `any`
- Use functional and declarative patterns; avoid classes unless needed
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- If browser and Node implementations are both valid, prefer browser version

## Testing Guidelines

- Write tests for all functions, types, and interfaces
- Use Bun's native test modules: `import { describe, expect, it } from 'bun:test'`
- Aim for 100% test coverage
- Test files mirror source structure in `test/` directory
- Include accurate examples in docblocks

Example test structure:
```typescript
import { describe, expect, it } from 'bun:test'
import { functionToTest } from '../src/module'

describe('Feature Name', () => {
  it('should do something specific', () => {
    expect(functionToTest('input')).toBe('expected')
  })
})
```

## Code Style

- Write concise, technical TypeScript with accurate docblock examples
- If Bun native modules are available, use them
- Prefer iteration and modularization over duplication
- Use proper JSDoc comments for functions, types, interfaces
- Ensure logging is comprehensive for debugging
- Reuse eslint-ignore comments where present

## Build System

- Uses Bun.build with `bun-plugin-dtsx` for type definitions
- Build configuration in `packages/ts-syntax-highlighter/build.ts`
- Outputs to `dist/` with minification
- CLI compilation for multiple platforms via compile scripts
- Type definitions generated alongside JavaScript output

## Token Flow

1. **Input**: Code string + language ID
2. **Grammar Loading**: Get grammar for language from `src/grammars/`
3. **Tokenization**: Apply patterns line-by-line, generating tokens with scopes
4. **Transformation** (optional): Apply token/line transformers
5. **Rendering**: Convert tokens to HTML/ANSI with theme colors
6. **Output**: Rendered code with metadata

## Performance Considerations

- Async mode is ~40% faster than sync mode
- Grammar patterns ordered by frequency for optimization
- Pre-compiled regex with minimal backtracking
- Memory efficient: ~3x source code size
- Caching available for repeated highlighting
- Streaming mode for large files to avoid memory spikes

## CLI Usage

The package includes a CLI tool (bin/cli.ts) compiled to standalone binaries for multiple platforms.
