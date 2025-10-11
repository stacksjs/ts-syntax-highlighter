/* eslint-disable no-console */
import hljs from 'highlight.js'
import { bench, group, run } from 'mitata'
import { codeToHtml } from 'shiki'
import { createHighlighter } from 'ts-syntax-highlighter'
import { largeCode, mediumCode, mediumCss, mediumHtml, smallCode } from './fixtures'

async function runBenchmarks() {
  console.log('🏁 Starting benchmarks...\n')

  // Setup
  const tsHighlighter = await createHighlighter({
    theme: 'github-dark',
    cache: false, // Disable for fair comparison
  })

  // Small code benchmarks
  group('Small Code (10 lines)', () => {
    bench('ts-syntax-highlighter (fast)', () => {
      tsHighlighter.highlightFast(smallCode, 'javascript')
    })

    bench('ts-syntax-highlighter (sync)', () => {
      tsHighlighter.highlightSync(smallCode, 'javascript')
    })

    bench('shiki', async () => {
      await codeToHtml(smallCode, {
        lang: 'javascript',
        theme: 'github-dark',
      })
    })

    bench('highlight.js', () => {
      hljs.highlight(smallCode, { language: 'javascript' })
    })
  })

  // Medium code benchmarks
  group('Medium Code (~50 lines)', () => {
    bench('ts-syntax-highlighter (fast)', () => {
      tsHighlighter.highlightFast(mediumCode, 'javascript')
    })

    bench('ts-syntax-highlighter (sync)', () => {
      tsHighlighter.highlightSync(mediumCode, 'javascript')
    })

    bench('shiki', async () => {
      await codeToHtml(mediumCode, {
        lang: 'javascript',
        theme: 'github-dark',
      })
    })

    bench('highlight.js', () => {
      hljs.highlight(mediumCode, { language: 'javascript' })
    })
  })

  // Large code benchmarks
  group('Large Code (~150 lines)', () => {
    bench('ts-syntax-highlighter (fast)', () => {
      tsHighlighter.highlightFast(largeCode, 'javascript')
    })

    bench('ts-syntax-highlighter (sync)', () => {
      tsHighlighter.highlightSync(largeCode, 'javascript')
    })

    bench('shiki', async () => {
      await codeToHtml(largeCode, {
        lang: 'javascript',
        theme: 'github-dark',
      })
    })

    bench('highlight.js', () => {
      hljs.highlight(largeCode, { language: 'javascript' })
    })
  })

  // HTML benchmarks
  group('HTML Highlighting', () => {
    bench('ts-syntax-highlighter (fast)', () => {
      tsHighlighter.highlightFast(mediumHtml, 'html')
    })

    bench('ts-syntax-highlighter (sync)', () => {
      tsHighlighter.highlightSync(mediumHtml, 'html')
    })

    bench('shiki', async () => {
      await codeToHtml(mediumHtml, {
        lang: 'html',
        theme: 'github-dark',
      })
    })

    bench('highlight.js', () => {
      hljs.highlight(mediumHtml, { language: 'html' })
    })
  })

  // CSS benchmarks
  group('CSS Highlighting', () => {
    bench('ts-syntax-highlighter (fast)', () => {
      tsHighlighter.highlightFast(mediumCss, 'css')
    })

    bench('ts-syntax-highlighter (sync)', () => {
      tsHighlighter.highlightSync(mediumCss, 'css')
    })

    bench('shiki', async () => {
      await codeToHtml(mediumCss, {
        lang: 'css',
        theme: 'github-dark',
      })
    })

    bench('highlight.js', () => {
      hljs.highlight(mediumCss, { language: 'css' })
    })
  })

  // Cache benchmarks
  group({ name: 'With Caching (repeated highlighting)', summary: false }, () => {
    bench('ts-syntax-highlighter (no cache)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript')
    })

    bench('shiki (no cache)', async () => {
      await codeToHtml(mediumCode, {
        lang: 'javascript',
        theme: 'github-dark',
      })
    })
  })

  // Advanced features benchmarks
  group('Advanced Features', () => {
    bench('ts-syntax-highlighter (basic)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript')
    })

    bench('ts-syntax-highlighter (with line numbers)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript', {
        lineNumbers: true,
      })
    })

    bench('ts-syntax-highlighter (with diff)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript', {
        lineNumbers: true,
        addedLines: [5, 10],
        removedLines: [15],
      })
    })

    bench('ts-syntax-highlighter (with annotations)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript', {
        lineNumbers: true,
        annotations: [
          { line: 5, text: 'Important', type: 'info' },
          { line: 10, text: 'Warning', type: 'warning' },
        ],
      })
    })

    bench('ts-syntax-highlighter (all features)', async () => {
      await tsHighlighter.highlight(mediumCode, 'javascript', {
        lineNumbers: true,
        addedLines: [5],
        removedLines: [10],
        focusLines: [15],
        annotations: [{ line: 5, text: 'Note', type: 'info' }],
        showCopyButton: true,
      })
    })
  })

  await run({
    avg: true,
    json: false,
    colors: true,
    min_max: true,
    percentiles: true,
  })

  console.log('\n✅ Benchmarks complete!')
}

runBenchmarks().catch(console.error)
