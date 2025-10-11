# Batch Processing

Efficiently process multiple files or code snippets using batch processing strategies.

## Why Batch Processing?

When processing multiple files, batch processing provides:

- **Better Performance**: Parallel processing with concurrency control
- **Progress Tracking**: Monitor processing status
- **Error Handling**: Graceful handling of individual failures
- **Resource Management**: Control memory and CPU usage

## Basic Batch Processing

### Processing Multiple Files

```typescript
import fs from 'node:fs/promises'
import { Tokenizer } from 'ts-syntax-highlighter'

async function processFiles(files: string[], language: string) {
  const tokenizer = new Tokenizer(language)
  const results = new Map()

  for (const file of files) {
    const code = await fs.readFile(file, 'utf-8')
    const tokens = await tokenizer.tokenizeAsync(code)
    results.set(file, tokens)
  }

  return results
}

// Usage
const files = ['file1.ts', 'file2.ts', 'file3.ts']
const results = await processFiles(files, 'typescript')
```

### Parallel Processing

```typescript
async function processFilesParallel(files: string[], language: string) {
  const tokenizer = new Tokenizer(language)

  const results = await Promise.all(
    files.map(async (file) => {
      const code = await fs.readFile(file, 'utf-8')
      const tokens = await tokenizer.tokenizeAsync(code)
      return { file, tokens }
    })
  )

  return new Map(results.map(r => [r.file, r.tokens]))
}

// Usage
const results = await processFilesParallel(files, 'typescript')
```

## Controlled Concurrency

### Limit Concurrent Processing

```typescript
async function processWithConcurrency(
  files: string[],
  language: string,
  concurrency: number = 5
) {
  const tokenizer = new Tokenizer(language)
  const results = new Map()
  const queue = [...files]

  async function processNext(): Promise<void> {
    const file = queue.shift()
    if (!file)
      return

    try {
      const code = await fs.readFile(file, 'utf-8')
      const tokens = await tokenizer.tokenizeAsync(code)
      results.set(file, tokens)
    }
    catch (error) {
      console.error(`Failed to process ${file}:`, error)
      results.set(file, null)
    }

    if (queue.length > 0) {
      await processNext()
    }
  }

  // Start concurrent workers
  const workers = Array.from(
    { length: Math.min(concurrency, files.length) },
    () => processNext()
  )

  await Promise.all(workers)
  return results
}

// Usage
const results = await processWithConcurrency(files, 'typescript', 10)
```

## Progress Tracking

### With Progress Callbacks

```typescript
interface BatchConfig {
  concurrency: number
  onProgress?: (completed: number, total: number) => void
  onError?: (file: string, error: Error) => void
  onSuccess?: (file: string) => void
}

async function batchProcess(
  files: string[],
  language: string,
  config: BatchConfig = { concurrency: 5 }
) {
  const tokenizer = new Tokenizer(language)
  const results = new Map()
  let completed = 0

  for (let i = 0; i < files.length; i += config.concurrency) {
    const batch = files.slice(i, i + config.concurrency)

    const batchResults = await Promise.all(
      batch.map(async (file) => {
        try {
          const code = await fs.readFile(file, 'utf-8')
          const tokens = await tokenizer.tokenizeAsync(code)
          config.onSuccess?.(file)
          return { file, tokens, error: null }
        }
        catch (error) {
          config.onError?.(file, error as Error)
          return { file, tokens: null, error: error as Error }
        }
      })
    )

    batchResults.forEach(({ file, tokens }) => {
      results.set(file, tokens)
      completed++
      config.onProgress?.(completed, files.length)
    })
  }

  return results
}

// Usage
const results = await batchProcess(files, 'typescript', {
  concurrency: 10,
  onProgress: (done, total) => {
    console.log(`Progress: ${done}/${total} (${Math.round(done / total * 100)}%)`)
  },
  onError: (file, error) => {
    console.error(`❌ Failed: ${file}`, error.message)
  },
  onSuccess: (file) => {
    console.log(`✅ Processed: ${file}`)
  }
})
```

## Advanced Batch Processing

### With Retry Logic

```typescript
async function processWithRetry(
  file: string,
  tokenizer: Tokenizer,
  maxRetries: number = 3
) {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const code = await fs.readFile(file, 'utf-8')
      return await tokenizer.tokenizeAsync(code)
    }
    catch (error) {
      lastError = error as Error
      if (attempt < maxRetries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, 2 ** attempt * 100)
        )
      }
    }
  }

  throw lastError
}

async function batchProcessWithRetry(
  files: string[],
  language: string,
  maxRetries: number = 3
) {
  const tokenizer = new Tokenizer(language)
  const results = new Map()

  const promises = files.map(async (file) => {
    try {
      const tokens = await processWithRetry(file, tokenizer, maxRetries)
      results.set(file, { success: true, tokens })
    }
    catch (error) {
      results.set(file, { success: false, error: error as Error })
    }
  })

  await Promise.all(promises)
  return results
}
```

### With Caching

```typescript
class CachedBatchProcessor {
  private cache = new Map<string, any>()
  private tokenizer: Tokenizer

  constructor(language: string) {
    this.tokenizer = new Tokenizer(language)
  }

  async process(files: string[]) {
    const results = new Map()

    for (const file of files) {
      // Check cache first
      if (this.cache.has(file)) {
        results.set(file, this.cache.get(file))
        continue
      }

      // Process and cache
      const code = await fs.readFile(file, 'utf-8')
      const tokens = await this.tokenizer.tokenizeAsync(code)

      this.cache.set(file, tokens)
      results.set(file, tokens)
    }

    return results
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheSize() {
    return this.cache.size
  }
}

// Usage
const processor = new CachedBatchProcessor('typescript')
const results1 = await processor.process(files) // Processes all
const results2 = await processor.process(files) // Uses cache
```

## Memory Management

### Streaming Processing

```typescript
async function streamProcess(
  files: string[],
  language: string,
  callback: (file: string, tokens: LineTokens[]) => void
) {
  const tokenizer = new Tokenizer(language)

  for (const file of files) {
    const code = await fs.readFile(file, 'utf-8')
    const tokens = await tokenizer.tokenizeAsync(code)

    // Process immediately, don't store
    callback(file, tokens)

    // Allow garbage collection
    await new Promise(resolve => setImmediate(resolve))
  }
}

// Usage
await streamProcess(files, 'typescript', (file, tokens) => {
  // Process tokens immediately
  const keywords = tokens.flatMap(line =>
    line.tokens.filter(t => t.type.includes('keyword'))
  )
  console.log(`${file}: ${keywords.length} keywords`)
})
```

### Chunked Processing

```typescript
async function processInChunks(
  files: string[],
  language: string,
  chunkSize: number = 100
) {
  const tokenizer = new Tokenizer(language)
  const allResults = []

  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize)

    const chunkResults = await Promise.all(
      chunk.map(async (file) => {
        const code = await fs.readFile(file, 'utf-8')
        return {
          file,
          tokens: await tokenizer.tokenizeAsync(code)
        }
      })
    )

    allResults.push(...chunkResults)

    // Force garbage collection between chunks
    if (global.gc)
      global.gc()
  }

  return allResults
}
```

## Real-World Examples

### Processing a Project

```typescript
import { glob } from 'glob'

async function processProject(
  pattern: string,
  config: BatchConfig = { concurrency: 10 }
) {
  // Find all TypeScript files
  const files = await glob(pattern)

  console.log(`Found ${files.length} files`)

  // Group by language
  const byLanguage = new Map<string, string[]>()
  files.forEach((file) => {
    const ext = file.split('.').pop()
    const lang = ext === 'ts' || ext === 'tsx' ? 'typescript' : 'javascript'

    if (!byLanguage.has(lang)) {
      byLanguage.set(lang, [])
    }
    byLanguage.get(lang)!.push(file)
  })

  // Process each language group
  const results = new Map()

  for (const [lang, langFiles] of byLanguage) {
    console.log(`Processing ${langFiles.length} ${lang} files...`)

    const langResults = await batchProcess(langFiles, lang, config)
    langResults.forEach((tokens, file) => {
      results.set(file, tokens)
    })
  }

  return results
}

// Usage
const results = await processProject('src/**/*.{ts,tsx}', {
  concurrency: 20,
  onProgress: (done, total) => {
    process.stdout.write(`\rProgress: ${done}/${total}`)
  },
  onError: (file, error) => {
    console.error(`\n❌ ${file}: ${error.message}`)
  }
})

console.log(`\n✅ Processed ${results.size} files`)
```

### Generating Statistics

```typescript
interface Stats {
  totalFiles: number
  totalLines: number
  totalTokens: number
  byType: Record<string, number>
}

async function generateStats(files: string[], language: string): Promise<Stats> {
  const stats: Stats = {
    totalFiles: 0,
    totalLines: 0,
    totalTokens: 0,
    byType: {}
  }

  await streamProcess(files, language, (file, tokens) => {
    stats.totalFiles++
    stats.totalLines += tokens.length

    tokens.forEach((line) => {
      line.tokens.forEach((token) => {
        stats.totalTokens++

        // Count by type
        const type = token.type.split('.')[0]
        stats.byType[type] = (stats.byType[type] || 0) + 1
      })
    })
  })

  return stats
}

// Usage
const stats = await generateStats(files, 'typescript')
console.log(JSON.stringify(stats, null, 2))
```

## Performance Considerations

### Optimal Concurrency

```typescript
import os from 'node:os'

// Use CPU count as baseline
const optimalConcurrency = os.cpus().length

// Adjust based on I/O vs CPU work
const ioBoundConcurrency = optimalConcurrency * 2
const cpuBoundConcurrency = optimalConcurrency
```

### Memory Monitoring

```typescript
function checkMemory() {
  const usage = process.memoryUsage()
  const usedMB = Math.round(usage.heapUsed / 1024 / 1024)
  const totalMB = Math.round(usage.heapTotal / 1024 / 1024)

  console.log(`Memory: ${usedMB}MB / ${totalMB}MB`)

  // Warn if using > 80% of heap
  if (usedMB / totalMB > 0.8) {
    console.warn('⚠️  High memory usage')
  }
}

// Check periodically during batch processing
const memoryInterval = setInterval(checkMemory, 5000)

await batchProcess(files, 'typescript', config)

clearInterval(memoryInterval)
```

## Next Steps

- Learn about [Code Analysis](/usage#code-statistics)
- Explore [Performance Tuning](/config#performance-tuning)
- Check out [Custom Themes](/advanced/custom-themes)
