import { dts } from '@dtsx/bun'
import { buildBrowserEntry } from './scripts/build-browser'

const library = await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  plugins: [dts()],
})
if (!library.success) throw new AggregateError(library.logs, 'Highlighter library build failed')

// The browser entry, built for a browser: no config loader, and each grammar
// in a file of its own so a page that highlights TypeScript does not download
// Fortran. `scripts/build-browser.ts` says why this is not a split build.
//
// Its own declarations as well: nothing in the root entry imports `browser.ts`,
// so the library build above never reaches it and `dist/browser.d.ts`, which
// the `./browser` export names, would not exist.
const browser = await buildBrowserEntry('./dist', [dts()])
if (!browser.success) throw new AggregateError(browser.logs as Error[], 'Highlighter browser build failed')

// The CLI the `bin` field points at. Nothing built it, so `dist/bin/cli.js`
// has never been in a published tarball — the command was declared, resolvable
// by name, and missing. Built separately so it lands under `dist/bin/`, which
// is where the manifest already looks for it.
const cli = await Bun.build({
  entrypoints: ['bin/cli.ts'],
  outdir: './dist/bin',
  target: 'bun',
  minify: true,
})
if (!cli.success) throw new AggregateError(cli.logs, 'Highlighter CLI build failed')
