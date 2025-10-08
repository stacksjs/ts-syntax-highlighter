import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'

describe('Cache and Memory', () => {
  describe('Cache Functionality', () => {
    it('should cache highlighted code when enabled', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      // First highlight
      await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(1)

      // Second highlight (should use cache)
      await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(1) // Still only 1 entry
    })

    it('should not cache when disabled', async () => {
      const highlighter = await createHighlighter({ cache: false })
      const code = 'const x = 42;'

      await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(0)

      await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(0)
    })

    it('should clear cache correctly', async () => {
      const highlighter = await createHighlighter({ cache: true })

      await highlighter.highlight('const x = 1;', 'javascript')
      await highlighter.highlight('const y = 2;', 'javascript')

      expect(highlighter.getCacheSize()).toBe(2)

      highlighter.clearCache()
      expect(highlighter.getCacheSize()).toBe(0)
    })

    it('should cache multiple different code snippets', async () => {
      const highlighter = await createHighlighter({ cache: true })

      await highlighter.highlight('const x = 1;', 'javascript')
      await highlighter.highlight('const y = 2;', 'javascript')
      await highlighter.highlight('const z = 3;', 'javascript')

      expect(highlighter.getCacheSize()).toBe(3)
    })

    it('should use different cache keys for different languages', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;'

      await highlighter.highlight(code, 'javascript')
      await highlighter.highlight(code, 'typescript')

      expect(highlighter.getCacheSize()).toBe(2)
    })

    it('should use different cache keys for different options', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;'

      await highlighter.highlight(code, 'javascript', { lineNumbers: false })
      await highlighter.highlight(code, 'javascript', { lineNumbers: true })

      // Different options = different cache keys
      expect(highlighter.getCacheSize()).toBe(2)
    })

    it('should reuse cache for identical code and options', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;'

      const result1 = await highlighter.highlight(code, 'javascript', { lineNumbers: true })
      const result2 = await highlighter.highlight(code, 'javascript', { lineNumbers: true })

      // Both results should be the same
      expect(result1.html).toBe(result2.html)
      expect(highlighter.getCacheSize()).toBe(1)
    })
  })

  describe('Cache Performance', () => {
    it('should be faster on second highlight with cache', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = Array.from({ length: 100 }, (_, i) => `const x${i} = ${i};`).join('\n')

      // First highlight (no cache)
      const start1 = performance.now()
      await highlighter.highlight(code, 'javascript')
      const end1 = performance.now()
      const time1 = end1 - start1

      // Second highlight (with cache)
      const start2 = performance.now()
      await highlighter.highlight(code, 'javascript')
      const end2 = performance.now()
      const time2 = end2 - start2

      // Cached version should be significantly faster
      expect(time2).toBeLessThan(time1)
    })

    it('should handle rapid consecutive cache hits', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      // Prime the cache
      await highlighter.highlight(code, 'javascript')

      // Rapid cache hits
      const promises = Array.from({ length: 100 }, () =>
        highlighter.highlight(code, 'javascript'),
      )

      const results = await Promise.all(promises)
      expect(results.length).toBe(100)
      expect(highlighter.getCacheSize()).toBe(1) // Only one entry
    })

    it('should handle many different cache entries', async () => {
      const highlighter = await createHighlighter({ cache: true })

      // Create 100 different code snippets
      const promises = Array.from({ length: 100 }, (_, i) =>
        highlighter.highlight(`const x${i} = ${i};`, 'javascript'),
      )

      await Promise.all(promises)
      expect(highlighter.getCacheSize()).toBe(100)
    })
  })

  describe('Memory Management', () => {
    it('should not leak memory with repeated highlighting', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      // Initial cache size
      const initialSize = highlighter.getCacheSize()

      // Highlight the same code 1000 times
      for (let i = 0; i < 1000; i++) {
        await highlighter.highlight(code, 'javascript')
      }

      // Cache should still only have 1 entry
      expect(highlighter.getCacheSize()).toBe(initialSize + 1)
    })

    it('should handle large code blocks efficiently', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const largeCode = Array.from({ length: 1000 }, (_, i) => `const x${i} = ${i};`).join('\n')

      const start = performance.now()
      const result = await highlighter.highlight(largeCode, 'javascript')
      const end = performance.now()

      expect(result).toBeDefined()
      expect(end - start).toBeLessThan(10000) // Should complete in < 10 seconds
      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should clear cache without errors', async () => {
      const highlighter = await createHighlighter({ cache: true })

      // Add many entries
      for (let i = 0; i < 100; i++) {
        await highlighter.highlight(`const x${i} = ${i};`, 'javascript')
      }

      expect(highlighter.getCacheSize()).toBe(100)

      // Clear cache
      highlighter.clearCache()
      expect(highlighter.getCacheSize()).toBe(0)

      // Should still work after clearing
      const result = await highlighter.highlight('const x = 1;', 'javascript')
      expect(result).toBeDefined()
      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle empty cache operations', async () => {
      const highlighter = await createHighlighter({ cache: true })

      expect(highlighter.getCacheSize()).toBe(0)
      highlighter.clearCache() // Should not error
      expect(highlighter.getCacheSize()).toBe(0)
    })
  })

  describe('Cache Edge Cases', () => {
    it('should handle empty code caching', async () => {
      const highlighter = await createHighlighter({ cache: true })

      await highlighter.highlight('', 'javascript')
      await highlighter.highlight('', 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle whitespace-only code caching', async () => {
      const highlighter = await createHighlighter({ cache: true })

      await highlighter.highlight('   \n  \n   ', 'javascript')
      await highlighter.highlight('   \n  \n   ', 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle very long single line caching', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const longLine = 'const x = ' + '"a"'.repeat(5000) + ';'

      await highlighter.highlight(longLine, 'javascript')
      await highlighter.highlight(longLine, 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle Unicode code caching', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const 你好 = "世界";'

      await highlighter.highlight(code, 'javascript')
      await highlighter.highlight(code, 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle emoji code caching', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const msg = "Hello 👋🌍🚀";'

      await highlighter.highlight(code, 'javascript')
      await highlighter.highlight(code, 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle special characters in caching', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = "<div>&amp;</div>";'

      await highlighter.highlight(code, 'javascript')
      await highlighter.highlight(code, 'javascript')

      expect(highlighter.getCacheSize()).toBe(1)
    })
  })

  describe('Cache with Advanced Features', () => {
    it('should cache with line numbers option', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;\nconst y = 2;'

      await highlighter.highlight(code, 'javascript', { lineNumbers: true })
      await highlighter.highlight(code, 'javascript', { lineNumbers: true })

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should cache with focus lines option', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;\nconst y = 2;'

      await highlighter.highlight(code, 'javascript', { focusLines: [1] })
      await highlighter.highlight(code, 'javascript', { focusLines: [1] })

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should cache with diff highlighting', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;\nconst y = 2;'

      await highlighter.highlight(code, 'javascript', { addedLines: [1], removedLines: [2] })
      await highlighter.highlight(code, 'javascript', { addedLines: [1], removedLines: [2] })

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should cache with annotations', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;'

      await highlighter.highlight(code, 'javascript', {
        annotations: [{ line: 1, text: 'Test', type: 'info' }],
      })
      await highlighter.highlight(code, 'javascript', {
        annotations: [{ line: 1, text: 'Test', type: 'info' }],
      })

      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should use different cache entries for different themes', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;'

      await highlighter.highlight(code, 'javascript', { theme: 'github-dark' })
      await highlighter.highlight(code, 'javascript', { theme: 'github-light' })

      // Different themes = different cache keys
      expect(highlighter.getCacheSize()).toBe(2)
    })

    it('should use different cache entries for all combined features', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 1;\nconst y = 2;'

      const options1 = {
        lineNumbers: true,
        focusLines: [1],
        addedLines: [1],
        annotations: [{ line: 1, text: 'Test', type: 'info' as const }],
      }

      const options2 = {
        lineNumbers: false,
        focusLines: [2],
        removedLines: [2],
        annotations: [{ line: 2, text: 'Other', type: 'warning' as const }],
      }

      await highlighter.highlight(code, 'javascript', options1)
      await highlighter.highlight(code, 'javascript', options2)

      // Different options = different cache keys
      expect(highlighter.getCacheSize()).toBe(2)
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent cache reads', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      // Prime the cache
      await highlighter.highlight(code, 'javascript')

      // Concurrent cache reads
      const promises = Array.from({ length: 50 }, () =>
        highlighter.highlight(code, 'javascript'),
      )

      const results = await Promise.all(promises)

      expect(results.length).toBe(50)
      results.forEach(result => {
        expect(result.html).toBeDefined()
      })
      expect(highlighter.getCacheSize()).toBe(1)
    })

    it('should handle concurrent cache writes', async () => {
      const highlighter = await createHighlighter({ cache: true })

      // Concurrent writes of different code
      const promises = Array.from({ length: 50 }, (_, i) =>
        highlighter.highlight(`const x${i} = ${i};`, 'javascript'),
      )

      const results = await Promise.all(promises)

      expect(results.length).toBe(50)
      expect(highlighter.getCacheSize()).toBe(50)
    })

    it('should handle mixed concurrent reads and writes', async () => {
      const highlighter = await createHighlighter({ cache: true })

      const promises = []

      // Some repeated code (cache hits)
      for (let i = 0; i < 25; i++) {
        promises.push(highlighter.highlight('const x = 1;', 'javascript'))
      }

      // Some unique code (cache misses)
      for (let i = 0; i < 25; i++) {
        promises.push(highlighter.highlight(`const y${i} = ${i};`, 'javascript'))
      }

      const results = await Promise.all(promises)

      expect(results.length).toBe(50)
      expect(highlighter.getCacheSize()).toBe(26) // 1 + 25
    })
  })

  describe('Cache Invalidation', () => {
    it('should not reuse cache after clearing', async () => {
      const highlighter = await createHighlighter({ cache: true })
      const code = 'const x = 42;'

      const result1 = await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(1)

      highlighter.clearCache()
      expect(highlighter.getCacheSize()).toBe(0)

      const result2 = await highlighter.highlight(code, 'javascript')
      expect(highlighter.getCacheSize()).toBe(1)

      // Results should still be the same
      expect(result1.html).toBe(result2.html)
    })

    it('should allow selective cache clearing', async () => {
      const highlighter = await createHighlighter({ cache: true })

      await highlighter.highlight('const x = 1;', 'javascript')
      await highlighter.highlight('const y = 2;', 'javascript')

      expect(highlighter.getCacheSize()).toBe(2)

      // Clear all cache
      highlighter.clearCache()
      expect(highlighter.getCacheSize()).toBe(0)

      // Re-cache one
      await highlighter.highlight('const x = 1;', 'javascript')
      expect(highlighter.getCacheSize()).toBe(1)
    })
  })
})
