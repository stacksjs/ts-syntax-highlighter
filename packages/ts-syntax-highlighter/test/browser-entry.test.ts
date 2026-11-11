// The browser entry stays loadable in a browser.
//
// `src/browser.ts` exists because the root entry cannot be bundled for one: it
// exports `config.ts`, which imports `bunfig`, which reads the filesystem. That
// is one `export * from './config'` away from coming back, in this file or in
// anything it imports, and nothing would notice - the tests run in Bun, where
// `bunfig` and `node:fs` both resolve happily.
//
// So this bundles the entry the way a consumer's bundler will and looks at what
// was reachable, rather than at what the entry file says it imports.

import type { BunPlugin } from 'bun'
import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { builtinModules } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { buildBrowserEntry } from '../scripts/build-browser'
import { catalog } from '../src/grammars/catalog'

const ENTRY = resolve(import.meta.dir, '../src/browser.ts')
const ROOT_ENTRY = resolve(import.meta.dir, '../src/index.ts')

const BUILTINS = new Set(builtinModules)

/** A specifier no browser can load: a Node builtin, a Bun module, or the config loader. */
function forbidden(specifier: string): boolean {
  if (specifier === 'bunfig' || specifier.startsWith('bunfig/'))
    return true
  if (specifier.startsWith('node:') || specifier.startsWith('bun:') || specifier === 'bun')
    return true

  return BUILTINS.has(specifier)
}

interface Reached {
  specifier: string
  importer: string
}

/** Bundle for a browser, recording every specifier the bundler was asked to resolve. */
async function bundle(entry: string): Promise<{ success: boolean, reached: Reached[], output: string, chunks: number }> {
  const reached: Reached[] = []

  const record: BunPlugin = {
    name: 'record-imports',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        reached.push({ specifier: args.path, importer: args.importer })
        // Left unresolved on purpose: a forbidden import is reported by the
        // assertion with its importer, rather than by a bundler error that
        // names neither.
        if (forbidden(args.path))
          return { path: args.path, external: true }

        return undefined
      })
    },
  }

  const result = await Bun.build({
    entrypoints: [entry],
    target: 'browser',
    format: 'esm',
    splitting: true,
    minify: false,
    plugins: [record],
  })

  const texts = await Promise.all(result.outputs.map(output => output.text()))

  return {
    success: result.success,
    reached,
    output: texts.join('\n'),
    chunks: result.outputs.filter(output => output.kind === 'chunk').length,
  }
}

describe('the browser entry', () => {
  test('bundles for a browser', async () => {
    const built = await bundle(ENTRY)

    expect(built.success).toBe(true)
    expect(built.output.length).toBeGreaterThan(0)
  })

  test('reaches neither bunfig nor any node: module', async () => {
    const built = await bundle(ENTRY)
    const offending = built.reached
      .filter(entry => forbidden(entry.specifier))
      .map(entry => `${entry.specifier} (from ${entry.importer})`)

    expect(offending).toEqual([])
  })

  test('the bundle itself names neither, whatever the resolver was told', async () => {
    // The second look. A specifier can reach the output without passing through
    // a resolver hook, and the output is what a browser is actually given.
    const { output } = await bundle(ENTRY)

    expect(output).not.toMatch(/from\s*["']bunfig["']/)
    expect(output).not.toMatch(/["']node:[a-z_/]+["']/)
    expect(output).not.toMatch(/\brequire\(\s*["'](?:bunfig|fs|path|os|process)["']\s*\)/)
  })

  test('keeps each grammar behind its own dynamic import', async () => {
    // One chunk per grammar is the point of `lazy.ts`. If this drops to zero,
    // something imported the eager barrel and a page now downloads every
    // language to highlight one.
    const built = await bundle(ENTRY)
    const eager = built.reached.filter(entry => /grammars(?:\/index)?$/.test(entry.specifier))

    expect(eager).toEqual([])
    expect(built.chunks).toBeGreaterThan(40)
  })

  test('the check can fail: the root entry does reach bunfig', async () => {
    // Without this, a recorder that silently recorded nothing would pass every
    // test above. The root entry is the known-bad case.
    const built = await bundle(ROOT_ENTRY)

    expect(built.reached.some(entry => entry.specifier === 'bunfig')).toBe(true)
  })
})

describe('the built artifact', () => {
  // What ships, built the way `build.ts` builds it, into a directory of its own.
  const outdir = mkdtempSync(join(tmpdir(), 'syntax-browser-'))
  let built: Awaited<ReturnType<typeof buildBrowserEntry>>
  let entry = ''

  beforeAll(async () => {
    built = await buildBrowserEntry(outdir)
    entry = await Bun.file(join(outdir, 'browser.js')).text()
  })

  afterAll(() => rmSync(outdir, { recursive: true, force: true }))

  test('builds', () => {
    expect(built.success).toBe(true)
    expect(entry.length).toBeGreaterThan(0)
  })

  test('has no import.meta, so it survives being inlined into a classic script', () => {
    // A split build registers a preload manifest with `import.meta.url`. That
    // is a syntax error outside a module, and a consumer whose bundler inlines
    // this package into a classic script loses the whole script to it.
    expect(entry).not.toContain('import.meta')
    for (const file of built.files)
      expect(readFileSync(file, 'utf8'), file).not.toContain('import.meta')
  })

  test('names neither bunfig nor a node: module, in any file', () => {
    for (const file of built.files) {
      const text = readFileSync(file, 'utf8')
      expect(text, file).not.toMatch(/from\s*["']bunfig["']/)
      expect(text, file).not.toMatch(/["']node:[a-z_/]+["']/)
    }
  })

  test('loads each grammar from a file that exists', () => {
    const imported = [...entry.matchAll(/import\(["']\.\/grammars\/([\w-]+)\.js["']\)/g)].map(match => match[1]!)

    expect(imported.length).toBe(catalog.length)
    for (const name of imported)
      expect(existsSync(join(outdir, 'grammars', `${name}.js`)), name).toBe(true)
  })

  test('does not carry a grammar in the entry itself', () => {
    // The TypeScript grammar's scope name appears in the catalogue's metadata
    // once. Its keyword table would put it there many more times.
    expect(entry.split('storage.type.ts').length - 1).toBe(0)
    expect(statSync(join(outdir, 'browser.js')).size).toBeLessThan(120_000)
  })

  test('the entry resolves a grammar through those files and tokenizes with it', async () => {
    const module = await import(join(outdir, 'browser.js'))
    const grammar = await module.resolveGrammar('typescript')
    const { lines } = new module.Tokenizer(grammar).tokenizeLinesFrom(['const a = 1'])

    expect(lines[0].tokens[0]).toMatchObject({ type: 'keyword', content: 'const' })
  })
})

describe('what the browser entry offers', () => {
  test('the tokenizer, its resumable state, the themes and the worker protocol', async () => {
    const entry = await import('../src/browser')

    expect(typeof entry.Tokenizer).toBe('function')
    expect(typeof entry.Tokenizer.prototype.tokenizeLinesFrom).toBe('function')
    expect(typeof entry.Tokenizer.prototype.checkpoints).toBe('function')
    expect(typeof entry.Tokenizer.prototype.getState).toBe('function')
    expect(typeof entry.resolveGrammar).toBe('function')
    expect(typeof entry.serveTokenizer).toBe('function')
    expect(typeof entry.handleTokenize).toBe('function')
    expect(typeof entry.getTheme).toBe('function')
    expect(entry.themes.length).toBeGreaterThan(0)
    expect(typeof entry.themeTokenCss).toBe('function')
  })

  test('does not offer the parts that need a filesystem', async () => {
    const entry = await import('../src/browser') as Record<string, unknown>

    expect(entry.loadSyntaxHighlighterConfig).toBeUndefined()
    expect(entry.config).toBeUndefined()
    expect(entry.highlight).toBeUndefined()
  })

  test('tokenizes a line from a saved state without the root entry', async () => {
    const { resolveGrammar, Tokenizer } = await import('../src/browser')
    const grammar = await resolveGrammar('typescript')
    const tokenizer = new Tokenizer(grammar!)

    const first = tokenizer.tokenizeLinesFrom(['/* open'])
    const second = tokenizer.tokenizeLinesFrom(['still a comment */ const a = 1'], first.endState, 2)

    expect(second.lines[0]!.tokens[0]!.type).toBe('block')
    expect(second.lines[0]!.tokens.some(token => token.type === 'keyword' && token.content === 'const')).toBe(true)
  })

  test('the package manifest exports it', async () => {
    const manifest = await Bun.file(resolve(import.meta.dir, '../package.json')).json()

    expect(manifest.exports['./browser']).toEqual({
      types: './dist/browser.d.ts',
      import: './dist/browser.js',
    })
  })
})
