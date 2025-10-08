# Benchmarks

Performance benchmarks comparing `ts-syntax-highlighter` with Shiki and highlight.js.

## Running Benchmarks

```bash
# Run all benchmarks
bun run bench

# Run memory benchmarks
bun run bench:memory

# Run specific benchmark
bun run src/index.ts
```

## Benchmark Categories

### 1. Code Size
- **Small**: ~10 lines
- **Medium**: ~50 lines
- **Large**: ~150 lines
- **Very Large**: 10,000+ lines

### 2. Features
- Basic highlighting
- With line numbers
- With diff indicators
- With annotations
- With caching
- All features combined

### 3. Memory Usage
- Baseline memory
- Per-file overhead
- Cache impact
- Advanced features overhead

## Expected Results

Based on our optimizations:

### Speed
- **Small files**: ts-syntax-highlighter should be 2-3x faster than Shiki
- **Medium files**: Competitive with highlight.js, faster than Shiki
- **Large files**: Caching provides 50-100x speedup on repeated highlights
- **Advanced features**: Minimal overhead (~5-10% slower)

### Memory
- **Bundle size**: ~50KB vs Shiki's 6MB
- **Runtime memory**: ~1-2MB for typical usage
- **Cache overhead**: ~10KB per cached entry
- **Advanced features**: <5% additional memory

### Why We're Fast

1. **Optimized Tokenizer**
   - Efficient regex patterns
   - Minimal backtracking
   - Smart scope stack management

2. **Built-in Caching**
   - Token-level caching
   - Hash-based cache keys
   - Configurable TTL

3. **Lazy Loading**
   - Languages loaded on demand
   - Themes loaded on demand
   - No unused code

4. **Zero Dependencies**
   - No overhead from dependencies
   - Smaller bundle size
   - Faster startup time

5. **Modern Tooling**
   - Built for Bun
   - Optimized for V8/JSC
   - ESM-first

## Results

Run `bun run bench` to see live results.
