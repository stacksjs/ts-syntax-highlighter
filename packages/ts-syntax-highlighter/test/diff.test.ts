import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Diff Grammar', () => {
  const tokenizer = new Tokenizer('diff')

  describe('Basic Tokenization', () => {
    it('should tokenize basic diff', async () => {
      const code = `--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,3 @@
 context
-removed
+added`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('File Headers', () => {
    it('should highlight file headers', async () => {
      const code = `--- a/original.txt
+++ b/modified.txt`
      const tokens = await tokenizer.tokenizeAsync(code)

      const headerTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('meta.diff.header'))

      expect(headerTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Hunk Headers', () => {
    it('should highlight hunk headers', async () => {
      const code = `@@ -10,7 +10,7 @@ function name()`
      const tokens = await tokenizer.tokenizeAsync(code)

      const hunkTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('meta.diff.range'))

      expect(hunkTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Added and Removed Lines', () => {
    it('should highlight added lines', async () => {
      const code = `+added line`
      const tokens = await tokenizer.tokenizeAsync(code)

      const addedTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.inserted'))

      expect(addedTokens.length).toBeGreaterThan(0)
    })

    it('should highlight removed lines', async () => {
      const code = `-removed line`
      const tokens = await tokenizer.tokenizeAsync(code)

      const removedTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('markup.deleted'))

      expect(removedTokens.length).toBeGreaterThan(0)
    })
  })
})
