/* eslint-disable no-console */
/**
 * What a browser has to download to highlight code in a worker.
 *
 * This is the number that decides whether the browser path is viable at all,
 * and it is the reason `lazy.ts` and the generated catalog exist. The eager
 * barrel in `grammars/index.ts` imports all forty-eight grammars, so a worker
 * built against it ships every language to highlight one - and a diff viewer
 * that has to download the Fortran grammar before it can colour a TypeScript
 * file is not a diff viewer anybody would choose over server-rendered HTML.
 *
 * ## What is measured
 *
 * Three shapes, all built for the browser, minified, and measured **gzipped**,
 * because gzipped is what crosses the network:
 *
 * - **the shell**: the worker entry, the tokenizer, the renderer and the
 *   catalog metadata, with every grammar behind a dynamic import. This is the
 *   fixed cost, paid once.
 * - **one language**: the shell plus the TypeScript grammar chunk, which is the
 *   real first paint of a diff in this repository.
 * - **ten languages**: the shell plus the ten most common languages in a pull
 *   request, which is roughly the worst case for a mixed change.
 *
 * The grammars are separate chunks rather than part of the shell, so "ten
 * languages" is ten fetches a reader only makes when a diff actually contains
 * those languages. Reporting the sum is the pessimistic reading, and it is the
 * one worth holding ourselves to.
 *
 * ## Why not `bun build --compile` or a bundler config
 *
 * `Bun.build` with `splitting: true` is what a consumer's bundler will do to
 * this package, and running it here means the number moves when the library
 * moves rather than when somebody remembers to re-measure.
 */

import { gzipSync } from 'node:zlib'
import process from 'node:process'

/** The ten languages a mixed pull request in this repository actually contains. */
const TEN = ['typescript', 'javascript', 'json', 'yaml', 'markdown', 'css', 'html', 'bash', 'sql', 'toml']

const ROOT = new URL('../../ts-syntax-highlighter/src/', import.meta.url).pathname
const OUT = `${process.env.TMPDIR ?? '/tmp'}/ts-syntax-highlighter-bundle`

async function build(entry: string): Promise<Bun.BuildArtifact[]> {
  const result = await Bun.build({
    entrypoints: [entry],
    outdir: OUT,
    target: 'browser',
    format: 'esm',
    splitting: true,
    minify: true,
  })

  if (!result.success) {
    for (const log of result.logs)
      console.error(log)

    throw new Error(`build failed for ${entry}`)
  }

  return result.outputs
}

async function gzipped(artifact: Bun.BuildArtifact): Promise<number> {
  return gzipSync(new Uint8Array(await artifact.arrayBuffer()), { level: 9 }).byteLength
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}

/**
 * One grammar, built alone.
 *
 * The split worker build emits forty-nine hashed chunks and no way to tell
 * which is which from the outside, so each grammar is built as its own entry
 * instead. A grammar imports nothing but its types, so the artifact is the
 * chunk - which is the check `chunks` below performs rather than assumes.
 */
async function grammarSize(language: string): Promise<number> {
  const outputs = await build(`${ROOT}grammars/${language}.ts`)

  if (outputs.length !== 1)
    throw new Error(`${language} built to ${outputs.length} chunks, so this is measuring the wrong thing`)

  return gzipped(outputs[0]!)
}

async function main(): Promise<void> {
  console.log('\n  Worker bundle, browser target, minified, gzipped\n')

  const worker = await build(`${ROOT}worker.ts`)
  const entry = worker.find(output => output.kind === 'entry-point')!
  const chunks = worker.filter(output => output.kind !== 'entry-point')

  const shell = await gzipped(entry)

  console.log(`  shell (worker, tokenizer, packer, catalogue)      ${kb(shell).padStart(10)}`)
  console.log(`  grammar chunks split out of it                    ${String(chunks.length).padStart(10)}`)
  console.log('')

  const one = await grammarSize('typescript')
  const sizes = await Promise.all(TEN.map(grammarSize))
  const ten = sizes.reduce((total, size) => total + size, 0)

  console.log(`  first paint: shell + typescript                   ${kb(shell + one).padStart(10)}`)
  console.log(`  worst case:  shell + all ten                      ${kb(shell + ten).padStart(10)}`)
  console.log('')
  console.log(`  the typescript grammar alone                      ${kb(one).padStart(10)}`)
  console.log(`  the ten grammars alone                            ${kb(ten).padStart(10)}`)
  console.log('')

  /*
   * What the same worker costs when it reaches the eager barrel instead - which
   * is what it did until the worker was moved onto the catalogue, and what any
   * consumer still gets by importing `grammars/index.ts` directly.
   */
  const eager = await build(`${ROOT}grammars/index.ts`)
  const eagerTotal = (await Promise.all(eager.map(gzipped))).reduce((total, size) => total + size, 0)

  console.log(`  every grammar at once (grammars/index.ts)         ${kb(eagerTotal).padStart(10)}`)
  console.log(`  saved on a one-language diff                      ${kb(eagerTotal - one).padStart(10)}`)
  console.log('')
}

await main()
