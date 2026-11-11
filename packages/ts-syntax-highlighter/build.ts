import { dts } from '@dtsx/bun'

const library = await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  plugins: [dts()],
})
if (!library.success) throw new AggregateError(library.logs, 'Highlighter library build failed')

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
