/**
 * The entry for a browser, or anything else that is not Bun or Node.
 *
 * The root entry exports `config.ts`, which imports `bunfig` to read a config
 * file from disk. That is right for the CLI and wrong for a page: a bundler
 * that reaches it pulls in a config loader, and behind it `node:fs`,
 * `node:path` and `node:process`, and the bundle either fails or ships a
 * filesystem shim to a place with no filesystem. Every consumer that wanted to
 * highlight in a browser has so far mapped this whole package to an empty
 * module and highlighted on the server instead.
 *
 * What is left out, and why:
 *
 * - `config` and `highlight()`, which read that config.
 * - `Highlighter` and `detect`, which import the eager grammar barrel. All
 *   forty-eight grammars is the right trade on a server and the wrong one on
 *   a page that highlights one language; `resolveGrammar` loads one.
 *
 * What is here is what an editor or a diff viewer is made of: the tokenizer and
 * its resumable state, the renderer, the themes, the token classes as CSS, and
 * the worker protocol. `test/browser-entry.test.ts` bundles this file for a
 * browser and fails if `bunfig` or a `node:` module is reachable from it, so
 * the guarantee is checked rather than remembered.
 */

export * from './dual-theme'
export { FastTokenizer, type FastTokenizerOptions } from './fast-tokenizer'
export * from './flat-tokens'
export * from './import-theme'
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
export { Renderer } from './renderer'
export * from './themes'
export * from './token-css'
export { classifyScope, Tokenizer } from './tokenizer'
export * from './transformers'
export type * from './types'
export { handleTokenize, serveTokenizer, type TokenizeRequest, type WorkerRequest, type WorkerResponse } from './worker'
