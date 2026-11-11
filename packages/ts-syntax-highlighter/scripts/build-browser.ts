/**
 * The browser build: one entry, and one file per grammar beside it.
 *
 * The obvious way to keep each grammar behind its dynamic import is
 * `splitting: true`, and it is what this used to do. But a split build is not
 * only chunks. Bun 1.4 also writes a preload manifest into the entry, registered
 * with `import.meta.url`, and `import.meta` is a syntax error anywhere that is
 * not a module. A consumer whose own bundler inlines this package into a
 * classic script - stx's page-level module registry does exactly that - got a
 * page whose whole registry failed to parse, and nothing on it hydrated.
 *
 * So the entry is built unsplit, with the catalogue's imports left as they
 * are and pointed at real files: `import('./grammars/typescript.js')`. Each
 * grammar is then built on its own into `dist/grammars/`. No runtime, no
 * manifest, nothing a second bundler can trip over - and a consumer that wants
 * exactly one grammar, statically, can import that file by name.
 *
 * Shared by `build.ts` and `test/browser-entry.test.ts`, so the test looks at
 * the artifact that ships rather than at a build of its own.
 */

import type { BunPlugin } from 'bun'
import { resolve } from 'node:path'
import { Glob } from 'bun'

const SRC = resolve(import.meta.dir, '../src')

/** Every grammar module: everything in `src/grammars` that is not an index of them. */
export function grammarEntrypoints(): string[] {
  return [...new Glob('*.ts').scanSync(resolve(SRC, 'grammars'))]
    .filter(file => file !== 'index.ts' && file !== 'catalog.ts')
    .sort()
    .map(file => resolve(SRC, 'grammars', file))
}

/**
 * Leave the catalogue's `import('./typescript')` as an import of a file.
 *
 * Matched on who is importing, not only on what: the catalogue is the one
 * module whose relative imports are grammars, and it imports nothing else.
 */
export const keepGrammarsLazy: BunPlugin = {
  name: 'keep-grammars-lazy',
  setup(build) {
    build.onResolve({ filter: /^\.\/[\w-]+$/ }, (args) => {
      if (!/[\\/]grammars[\\/]catalog\.ts$/.test(args.importer))
        return undefined

      return { path: `./grammars/${args.path.slice(2)}.js`, external: true }
    })
  },
}

export interface BrowserBuild {
  success: boolean
  logs: unknown[]
  /** Paths written, entry first. */
  files: string[]
}

export async function buildBrowserEntry(outdir: string, plugins: BunPlugin[] = []): Promise<BrowserBuild> {
  const entry = await Bun.build({
    entrypoints: [resolve(SRC, 'browser.ts')],
    outdir,
    target: 'browser',
    format: 'esm',
    splitting: false,
    minify: true,
    plugins: [keepGrammarsLazy, ...plugins],
  })
  if (!entry.success)
    return { success: false, logs: entry.logs, files: [] }

  const grammars = await Bun.build({
    entrypoints: grammarEntrypoints(),
    // Without a root, Bun mirrors the path from the working directory and the
    // files land in `grammars/src/grammars/`, where the entry does not look.
    root: resolve(SRC, 'grammars'),
    outdir: resolve(outdir, 'grammars'),
    target: 'browser',
    format: 'esm',
    splitting: false,
    minify: true,
  })

  return {
    success: grammars.success,
    logs: grammars.logs,
    files: [...entry.outputs, ...grammars.outputs].map(output => output.path),
  }
}
