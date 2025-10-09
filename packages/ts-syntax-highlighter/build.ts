import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  plugins: [dts()],
})
