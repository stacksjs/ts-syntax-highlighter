// Core exports
export * from './config'
export * from './detect'
export * from './dual-theme'
export * from './export-textmate'
// Language and theme exports
export * from './grammars'
export { createHighlighter, Highlighter } from './highlighter'

// Lazy language resolution. Kept out of `./grammars` on purpose: importing that
// pulls all 48 grammars, which is the right trade on a server and the wrong one
// in a browser or a worker that highlights one file at a time.
export {
  catalog,
  clearGrammarCache,
  findLanguage,
  findLanguageForFilename,
  grammarsLoaded,
  listLanguages,
  loadedGrammar,
  resolveGrammar,
  resolveGrammars,
} from './lazy'

// Plugin exports
export * from './plugins'
// Performance utilities
export * from './profiler'

export * from './renderer'

export * from './streaming'
export * from './themes'
export * from './tokenizer'
// Advanced features
export * from './transformers'

export * from './types'

// Convenience function for quick highlighting
export { highlight } from './utils'
