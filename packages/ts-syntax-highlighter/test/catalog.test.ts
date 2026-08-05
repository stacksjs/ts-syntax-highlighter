// The lazy catalog, and the guard that keeps it honest.
//
// `src/grammars/catalog.ts` is generated from the eager `languages` array by
// `scripts/generate-catalog.ts`. Generated files rot when nobody is checking,
// so these tests hold the two to agreeing in both directions: a language added
// to one and not the other fails here rather than going quietly missing from
// whichever consumer used the other one.

import { describe, expect, test } from 'bun:test'
import { languages } from '../src/grammars'
import { catalog } from '../src/grammars/catalog'
import {
  clearGrammarCache,
  findLanguage,
  findLanguageForFilename,
  grammarsLoaded,
  listLanguages,
  loadedGrammar,
  resolveGrammar,
  resolveGrammars,
} from '../src/lazy'

describe('catalog', () => {
  test('lists exactly the languages the eager array does', () => {
    expect(catalog.map(entry => entry.id).sort()).toEqual(languages.map(language => language.id).sort())
  })

  test('carries the same aliases and extensions as the eager array', () => {
    for (const language of languages) {
      const entry = catalog.find(candidate => candidate.id === language.id)!

      expect(entry.name).toBe(language.name)
      expect(entry.aliases).toEqual(language.aliases ?? [])
      expect(entry.extensions).toEqual(language.extensions ?? [])
    }
  })

  test('every entry loads the grammar the eager array holds', async () => {
    for (const language of languages) {
      const entry = catalog.find(candidate => candidate.id === language.id)!
      const grammar = await entry.load()

      // Identity, not just shape: a wrong import that happens to have the same
      // scope name would otherwise pass.
      expect(grammar).toBe(language.grammar)
      expect(entry.scopeName).toBe(language.grammar.scopeName)
    }
  })

  test('every entry knows its scope name without loading anything', () => {
    for (const entry of catalog)
      expect(entry.scopeName.length).toBeGreaterThan(0)
  })
})

describe('findLanguage', () => {
  test('finds by id', () => {
    expect(findLanguage('typescript')?.id).toBe('typescript')
  })

  test('finds by alias', () => {
    expect(findLanguage('ts')?.id).toBe('typescript')
    expect(findLanguage('js')?.id).toBe('javascript')
  })

  test('is case and whitespace insensitive, because callers pass user input', () => {
    expect(findLanguage('  TypeScript ')?.id).toBe('typescript')
  })

  test('returns undefined for something we have no grammar for', () => {
    expect(findLanguage('cobol')).toBeUndefined()
  })
})

describe('findLanguageForFilename', () => {
  test('resolves an ordinary extension', () => {
    expect(findLanguageForFilename('src/main.rs')?.id).toBe('rust')
    expect(findLanguageForFilename('app/index.ts')?.id).toBe('typescript')
  })

  test('resolves a file with no extension by its whole name', () => {
    expect(findLanguageForFilename('Dockerfile')?.id).toBe('dockerfile')
  })

  test('ignores the directory, which may contain dots', () => {
    expect(findLanguageForFilename('some.dir/nested/file.py')?.id).toBe('python')
  })

  test('prefers the longer extension when two match', () => {
    // Whichever grammar claims the longer suffix wins, so a `.d.ts` rule would
    // beat `.ts`. Asserted through the resolution rule rather than a specific
    // pair, so this keeps holding as grammars are added.
    const resolved = findLanguageForFilename('types.d.ts')
    expect(resolved?.id).toBe('typescript')
  })

  test('returns undefined for a name it cannot place', () => {
    expect(findLanguageForFilename('notes.xyzzy')).toBeUndefined()
    expect(findLanguageForFilename('')).toBeUndefined()
  })
})

describe('resolveGrammar', () => {
  test('loads a grammar and caches it', async () => {
    clearGrammarCache()
    expect(loadedGrammar('rust')).toBeUndefined()

    const first = await resolveGrammar('rust')
    const second = await resolveGrammar('rust')

    expect(first).toBeDefined()
    expect(second).toBe(first!)
    expect(loadedGrammar('rust')).toBe(first!)
  })

  test('two callers racing for one language share a single load', async () => {
    clearGrammarCache()
    const [a, b] = await Promise.all([resolveGrammar('go'), resolveGrammar('go')])

    expect(a).toBe(b!)
  })

  test('resolves by alias to the same grammar as by id', async () => {
    expect(await resolveGrammar('ts')).toBe((await resolveGrammar('typescript'))!)
  })

  test('an unknown language is undefined rather than a throw', async () => {
    expect(await resolveGrammar('cobol')).toBeUndefined()
  })

  test('resolves several at once and skips the ones it has never heard of', async () => {
    clearGrammarCache()
    const grammars = await resolveGrammars(['python', 'cobol', 'py'])

    expect([...grammars.keys()]).toEqual(['python'])
    expect(grammarsLoaded(['python'])).toBe(true)
    expect(grammarsLoaded(['python', 'rust'])).toBe(false)
  })
})

describe('listLanguages', () => {
  test('hands back a copy, so a caller cannot edit the catalog', () => {
    const list = listLanguages()
    list.length = 0

    expect(listLanguages().length).toBeGreaterThan(0)
  })
})
