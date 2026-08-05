/**
 * Resolving a language without loading every grammar.
 *
 * The eager `languages` export in `grammars/index.ts` imports all forty eight
 * grammars, so importing it costs the whole set even to answer "what language
 * is `main.rs`". On a server that is a startup cost nobody notices. In a
 * browser, or a worker that highlights one file at a time, it is the difference
 * between a bundle worth shipping and one that is not.
 *
 * So this module holds metadata only, and loads one grammar on demand. Nothing
 * here imports a grammar at module scope; the catalog's `load()` functions are
 * dynamic imports, which every bundler splits into its own chunk.
 *
 * Resolution is cached, and two callers asking for the same language while it
 * is still loading share one import rather than racing to start two.
 */

import type { Grammar, LanguageDescriptor } from './types'
import { catalog } from './grammars/catalog'

export { catalog }

const byKey = new Map<string, LanguageDescriptor>()
const byExtension = new Map<string, LanguageDescriptor>()

for (const descriptor of catalog) {
  byKey.set(descriptor.id.toLowerCase(), descriptor)

  for (const alias of descriptor.aliases) {
    // First writer wins, so a language that claims another's id as an alias
    // cannot displace it. The catalog is generated in `languages` order, which
    // puts the common languages first.
    if (!byKey.has(alias.toLowerCase()))
      byKey.set(alias.toLowerCase(), descriptor)
  }

  for (const extension of descriptor.extensions) {
    const key = extension.toLowerCase()
    if (!byExtension.has(key))
      byExtension.set(key, descriptor)
  }
}

/** Every language, as metadata. Cheap: no grammar is loaded. */
export function listLanguages(): LanguageDescriptor[] {
  return [...catalog]
}

/** Look a language up by id or alias. */
export function findLanguage(idOrAlias: string): LanguageDescriptor | undefined {
  return byKey.get(idOrAlias.trim().toLowerCase())
}

/**
 * Guess a language from a file name.
 *
 * Full name first, because `Dockerfile` and `Makefile` have no extension and a
 * `.lock` file is not the language its extension suggests. Then the longest
 * matching extension, so `.d.ts` beats `.ts` when a grammar claims it.
 */
export function findLanguageForFilename(filename: string): LanguageDescriptor | undefined {
  const name = filename.split('/').pop()?.trim().toLowerCase() ?? ''
  if (name === '')
    return undefined

  const exact = byKey.get(name) ?? byExtension.get(name)
  if (exact)
    return exact

  let best: LanguageDescriptor | undefined
  let bestLength = 0

  for (const [extension, descriptor] of byExtension) {
    if (name.endsWith(extension) && extension.length > bestLength) {
      best = descriptor
      bestLength = extension.length
    }
  }

  return best
}

const loaded = new Map<string, Grammar>()
const loading = new Map<string, Promise<Grammar>>()

/**
 * Load one grammar, once.
 *
 * Returns undefined for a language that is not in the catalog rather than
 * throwing: "we do not have a grammar for this" is an ordinary answer for a
 * file browser, and the caller renders it as plain text.
 */
export async function resolveGrammar(idOrAlias: string): Promise<Grammar | undefined> {
  const descriptor = findLanguage(idOrAlias)
  if (!descriptor)
    return undefined

  const cached = loaded.get(descriptor.id)
  if (cached)
    return cached

  const inFlight = loading.get(descriptor.id)
  if (inFlight)
    return await inFlight

  const promise = descriptor.load().then((grammar) => {
    loaded.set(descriptor.id, grammar)
    loading.delete(descriptor.id)
    return grammar
  }).catch((error) => {
    // Not left in the map: a failed import should be retryable, not poisoned
    // for the life of the process.
    loading.delete(descriptor.id)
    throw error
  })

  loading.set(descriptor.id, promise)
  return await promise
}

/** Load several grammars at once, skipping any that are not in the catalog. */
export async function resolveGrammars(idsOrAliases: readonly string[]): Promise<Map<string, Grammar>> {
  const unique = [...new Set(idsOrAliases.map(id => findLanguage(id)?.id).filter((id): id is string => id != null))]
  const grammars = await Promise.all(unique.map(async id => [id, await resolveGrammar(id)] as const))

  const result = new Map<string, Grammar>()
  for (const [id, grammar] of grammars) {
    if (grammar)
      result.set(id, grammar)
  }

  return result
}

/**
 * A grammar that is already loaded, or undefined.
 *
 * The synchronous path, for a caller that has preloaded what it needs and must
 * not await inside a render loop.
 */
export function loadedGrammar(idOrAlias: string): Grammar | undefined {
  const descriptor = findLanguage(idOrAlias)
  return descriptor ? loaded.get(descriptor.id) : undefined
}

/** Whether every one of these is loaded and can be used synchronously. */
export function grammarsLoaded(idsOrAliases: readonly string[]): boolean {
  return idsOrAliases.every(id => loadedGrammar(id) !== undefined)
}

/** Drop cached grammars. Mainly for tests and for a long-lived worker under memory pressure. */
export function clearGrammarCache(): void {
  loaded.clear()
  loading.clear()
}
