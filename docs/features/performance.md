# Performance

ts-syntax-highlighter is built for speed. Performance isn't just a feature—it's a core design principle that influences every aspect of the library.

## Benchmark Results

Comprehensive benchmarks comparing ts-syntax-highlighter to popular alternatives:

### JavaScript Tokenization

| Library | Time | Speedup |
|---------|------|---------|
| **ts-syntax-highlighter (Fast)** | **~0.05ms** | **Baseline** |
| highlight.js | ~3.8ms | **76x slower** |
| Prism.js | ~2.1ms | **42x slower** |
| ts-syntax-highlighter (Sync) | ~0.08ms | 1.6x slower |

### TypeScript Tokenization

| Library | Time | Speedup |
|---------|------|---------|
| **ts-syntax-highlighter (Fast)** | **~0.08ms** | **Baseline** |
| highlight.js | ~1.0ms | **12x slower** |
| Prism.js | ~0.6ms | **7.5x slower** |
| ts-syntax-highlighter (Sync) | ~0.12ms | 1.5x slower |

### HTML Tokenization

| Library | Time | Speedup |
|---------|------|---------|
| **ts-syntax-highlighter (Fast)** | **~0.04ms** | **Baseline** |
| highlight.js | ~1.2ms | **30x slower** |
| Prism.js | ~0.8ms | **20x slower** |
| ts-syntax-highlighter (Sync) | ~0.06ms | 1.5x slower |

### CSS Tokenization

| Library | Time | Speedup |
|---------|------|---------|
| **ts-syntax-highlighter (Fast)** | **~0.03ms** | **Baseline** |
| highlight.js | ~0.9ms | **30x slower** |
| Prism.js | ~0.5ms | **17x slower** |
| ts-syntax-highlighter (Sync) | ~0.05ms | 1.7x slower |

## Performance Characteristics

### Async Mode (Fast)

The async tokenization mode provides the best performance:

```typescript
const tokenizer = new Tokenizer('javascript')
const tokens = await tokenizer.tokenizeAsync(code)
```

**Benefits**:
- 12-77x faster than alternatives
- Non-blocking operation
- Worker-like performance characteristics
- Optimized for large files
- Scales well with code size

**Best For**:
- Large codebases
- Real-time syntax highlighting
- Batch processing
- Performance-critical applications

### Sync Mode

The synchronous mode offers simpler API while maintaining performance advantages:

```typescript
const tokenizer = new Tokenizer('javascript')
const tokens = tokenizer.tokenize(code)
```

**Benefits**:
- Still 1.5-2x faster than alternatives
- Simpler API (no async/await)
- Predictable execution
- Good for small snippets

**Best For**:
- Small code snippets
- Synchronous workflows
- Simple use cases
- Quick prototyping

## Why So Fast?

### 1. Optimized Pattern Matching

Patterns are ordered by frequency of occurrence:

```typescript
patterns: [
  { include: '#comments' },     // Very common
  { include: '#strings' },      // Very common
  { include: '#keywords' },     // Common
  { include: '#numbers' },      // Common
  { include: '#functions' },    // Common
  { include: '#operators' },    // Less common
  { include: '#punctuation' },  // Handled by fast path
]
```

### 2. Fast Path Optimization

Simple tokens like punctuation use optimized matching:

```typescript
// Fast path for single-character tokens
if (char === '(' || char === ')' || char === '{' || char === '}') {
  return createToken('punctuation', char)
}
```

### 3. Pre-compiled Regular Expressions

All regex patterns are compiled once and cached:

```typescript
// Compiled at initialization
const numberPattern = /\b(0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d+)\b/

// Reused for every tokenization
if (numberPattern.test(text)) {
  // ...
}
```

### 4. Minimal Backtracking

Patterns are designed to minimize regex backtracking:

```typescript
// Good - no backtracking
match: '\\b(if|else|for|while)\\b'

// Avoid - potential backtracking
match: '\\b(i.*|e.*|f.*|w.*)\\b'
```

### 5. Efficient Token Creation

Tokens are created with minimal overhead:

```typescript
interface Token {
  type: string        // Interned string
  content: string     // Source substring
  line: number        // Integer
  startIndex: number  // Integer
}
```

## Real-World Performance

### Small Code Snippets (< 100 lines)

```typescript
const code = `
const greeting = "Hello World"
console.log(greeting)
`

console.time('tokenize')
const tokens = await tokenizer.tokenizeAsync(code)
console.timeEnd('tokenize')
// tokenize: 0.05ms
```

**Result**: Instant tokenization, imperceptible to users.

### Medium Files (100-1000 lines)

```typescript
const code = fs.readFileSync('Component.tsx', 'utf-8') // 500 lines

console.time('tokenize')
const tokens = await tokenizer.tokenizeAsync(code)
console.timeEnd('tokenize')
// tokenize: 2.3ms
```

**Result**: Fast enough for real-time highlighting as you type.

### Large Files (1000+ lines)

```typescript
const code = fs.readFileSync('large-file.ts', 'utf-8') // 5000 lines

console.time('tokenize')
const tokens = await tokenizer.tokenizeAsync(code)
console.timeEnd('tokenize')
// tokenize: 18.7ms
```

**Result**: Still fast enough for interactive use.

## Performance Tips

### 1. Reuse Tokenizer Instances

```typescript
// ✅ Good - Create once, reuse
const tokenizer = new Tokenizer('javascript')
for (const file of files) {
  const tokens = await tokenizer.tokenizeAsync(file)
}

// ❌ Avoid - Creates new instance each time
for (const file of files) {
  const tokens = await new Tokenizer('javascript').tokenizeAsync(file)
}
```

### 2. Use Async Mode for Large Files

```typescript
// ✅ Good - Async for large files
if (code.length > 1000) {
  tokens = await tokenizer.tokenizeAsync(code)
}

// ❌ Avoid - Sync for large files
const tokens = tokenizer.tokenize(largeCodeFile) // Slower
```

### 3. Batch Process Multiple Files

```typescript
// ✅ Good - Parallel processing
const tokenizer = new Tokenizer('typescript')
const results = await Promise.all(
  files.map(file => tokenizer.tokenizeAsync(file))
)

// ❌ Avoid - Sequential processing
const results = []
for (const file of files) {
  results.push(await tokenizer.tokenizeAsync(file))
}
```

### 4. Filter Tokens Early

```typescript
// ✅ Good - Filter during iteration
const keywords = []
for (const line of tokens) {
  for (const token of line.tokens) {
    if (token.type.includes('keyword')) {
      keywords.push(token)
    }
  }
}

// ❌ Avoid - Create intermediate arrays
const allTokens = tokens.flatMap(line => line.tokens)
const keywords = allTokens.filter(t => t.type.includes('keyword'))
```

## Memory Efficiency

ts-syntax-highlighter is designed to be memory-efficient:

### Low Memory Overhead

```typescript
// Memory usage for typical file (500 lines, ~15KB)
const before = process.memoryUsage().heapUsed
const tokens = await tokenizer.tokenizeAsync(code)
const after = process.memoryUsage().heapUsed

console.log(`Memory used: ${(after - before) / 1024}KB`)
// Memory used: ~45KB (3x source size)
```

### No Memory Leaks

The tokenizer properly cleans up after each tokenization:

```typescript
// Safe to tokenize millions of files
for (let i = 0; i < 1_000_000; i++) {
  const tokens = await tokenizer.tokenizeAsync(code)
  // tokens are garbage collected after use
}
```

## Running Benchmarks

You can run the benchmarks yourself:

```bash
# Run all benchmarks
bun run bench

# Run with specific iterations
bun run bench --iterations 1000

# Run specific language
bun run bench --language javascript

# Compare against alternatives
bun run bench --compare
```

## Benchmark Methodology

Our benchmarks follow these principles:

1. **Warm-up**: 10 warm-up iterations before measurement
2. **Multiple Runs**: Average of 100 runs for each test
3. **Real Code**: Uses real-world code samples, not synthetic
4. **Fair Comparison**: Same code samples for all libraries
5. **Latest Versions**: All libraries tested at their latest versions

## Continuous Optimization

Performance is continuously monitored:

- Benchmarks run on every commit
- Performance regressions are caught in CI
- Optimizations are measured before merging
- Real-world usage patterns inform optimizations

## Next Steps

- Learn about [Modern Syntax Support](/features/modern-syntax)
- Explore [Dual Tokenization Modes](/features/dual-modes)
- Check out [Usage Examples](/usage)
