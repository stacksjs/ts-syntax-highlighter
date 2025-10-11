/* eslint-disable no-console */
import process from 'node:process'
import { createHighlighter } from 'ts-syntax-highlighter'
import { generateLargeCode, largeCode, mediumCode, smallCode } from './fixtures'

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getMemoryUsage() {
  const usage = process.memoryUsage()
  return {
    rss: usage.rss,
    heapTotal: usage.heapTotal,
    heapUsed: usage.heapUsed,
    external: usage.external,
  }
}

async function benchmarkMemory() {
  console.log('🧪 Memory Benchmark\n')

  // Force GC if available
  if (globalThis.gc) {
    globalThis.gc()
  }

  const baseline = getMemoryUsage()
  console.log('Baseline memory:')
  console.log(`  RSS: ${formatBytes(baseline.rss)}`)
  console.log(`  Heap Used: ${formatBytes(baseline.heapUsed)}`)
  console.log()

  // Test 1: Small code
  console.log('Test 1: Small code (10 lines)')
  const h1 = await createHighlighter({ cache: false })
  await h1.highlight(smallCode, 'javascript')

  const m1 = getMemoryUsage()
  console.log(`  Heap Used: ${formatBytes(m1.heapUsed)} (+${formatBytes(m1.heapUsed - baseline.heapUsed)})`)
  console.log()

  // Test 2: Medium code
  console.log('Test 2: Medium code (50 lines)')
  const h2 = await createHighlighter({ cache: false })
  await h2.highlight(mediumCode, 'javascript')

  const m2 = getMemoryUsage()
  console.log(`  Heap Used: ${formatBytes(m2.heapUsed)} (+${formatBytes(m2.heapUsed - baseline.heapUsed)})`)
  console.log()

  // Test 3: Large code
  console.log('Test 3: Large code (150 lines)')
  const h3 = await createHighlighter({ cache: false })
  await h3.highlight(largeCode, 'javascript')

  const m3 = getMemoryUsage()
  console.log(`  Heap Used: ${formatBytes(m3.heapUsed)} (+${formatBytes(m3.heapUsed - baseline.heapUsed)})`)
  console.log()

  // Test 4: Very large code
  console.log('Test 4: Very large code (10,000 lines)')
  const veryLargeCode = generateLargeCode(10000)
  const h4 = await createHighlighter({ cache: false })

  const before = getMemoryUsage()
  await h4.highlight(veryLargeCode, 'javascript')
  const after = getMemoryUsage()

  console.log(`  Heap Used: ${formatBytes(after.heapUsed)} (+${formatBytes(after.heapUsed - before.heapUsed)})`)
  console.log()

  // Test 5: With caching
  console.log('Test 5: Caching impact')
  const h5 = await createHighlighter({ cache: true })

  const beforeCache = getMemoryUsage()

  // Highlight 100 different code samples
  for (let i = 0; i < 100; i++) {
    await h5.highlight(`const x${i} = ${i};`, 'javascript')
  }

  const afterCache = getMemoryUsage()
  console.log(`  Cache size: ${h5.getCacheSize()} entries`)
  console.log(`  Heap Used: ${formatBytes(afterCache.heapUsed)} (+${formatBytes(afterCache.heapUsed - beforeCache.heapUsed)})`)
  console.log(`  Memory per entry: ${formatBytes((afterCache.heapUsed - beforeCache.heapUsed) / 100)}`)
  console.log()

  // Test 6: Advanced features
  console.log('Test 6: Advanced features overhead')
  const h6 = await createHighlighter({ cache: false })

  const beforeAdvanced = getMemoryUsage()
  await h6.highlight(mediumCode, 'javascript', {
    lineNumbers: true,
    addedLines: [5, 10],
    removedLines: [15],
    focusLines: [20],
    annotations: [
      { line: 5, text: 'Info', type: 'info' },
      { line: 10, text: 'Warning', type: 'warning' },
    ],
    showCopyButton: true,
  })
  const afterAdvanced = getMemoryUsage()

  console.log(`  Heap Used: ${formatBytes(afterAdvanced.heapUsed)} (+${formatBytes(afterAdvanced.heapUsed - beforeAdvanced.heapUsed)})`)
  console.log()

  console.log('✅ Memory benchmarks complete!')
}

benchmarkMemory().catch(console.error)
