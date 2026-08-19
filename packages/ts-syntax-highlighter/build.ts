import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  plugins: [dts()],
})

// The CLI the `bin` field points at. Nothing built it, so `dist/bin/cli.js`
// has never been in a published tarball — the command was declared, resolvable
// by name, and missing. Built separately so it lands under `dist/bin/`, which
// is where the manifest already looks for it.
await Bun.build({
  entrypoints: ['bin/cli.ts'],
  outdir: './dist/bin',
  target: 'bun',
  minify: true,
})
