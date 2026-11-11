import { expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// Build explicitly first. Published archives use the identical consumer gate.
test('the installed highlighter preserves async generator types and streaming behavior', async () => {
  const directory = await mkdtemp(join(process.env.SYNTAX_PACKAGE_EVIDENCE ?? tmpdir(), 'syntax-package-'))
  const consumer = join(directory, 'consumer')
  const archive = join(directory, 'package.tgz')
  const commands: Array<Record<string, unknown>> = []
  const receipt: Record<string, unknown> = { directory, commands, completed: false }
  const hash = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex')
  async function run(phase: string, args: string[], cwd: string) {
    const env = { ...process.env }
    for (const key of Object.keys(env)) {
      if (/token|password|secret|private_key|^npm_config_|^bun_auth_/i.test(key)) delete env[key]
    }
    const child = Bun.spawn(args, { cwd, env, stdout: 'pipe', stderr: 'pipe', timeout: 120_000 })
    const [code, stdout, stderr] = await Promise.all([child.exited, new Response(child.stdout).text(), new Response(child.stderr).text()])
    const output = stdout + stderr
    const log = `${commands.length}-${phase}.log`
    await writeFile(join(directory, log), output)
    commands.push({ phase, args, cwd, code, log })
    return { code, output }
  }
  try {
    const supplied = process.env.SYNTAX_PACKAGE_ARCHIVE
    if (supplied) {
      receipt.archiveInput = resolve(supplied)
      await copyFile(resolve(supplied), archive)
    }
    else {
      const packed = await run('pack', [process.execPath, '--no-env-file', 'pm', 'pack', '--filename', archive], resolve(import.meta.dir, '..'))
      expect(packed.code, packed.output).toBe(0)
    }
    const bytes = await readFile(archive)
    receipt.archiveSHA256 = hash(bytes)
    const files = await new Bun.Archive(bytes).files()
    const manifest = await files.get('package/package.json')!.json()
    expect(manifest.name).toBe('ts-syntax-highlighter')
    receipt.version = manifest.version
    await mkdir(consumer)
    const consumerManifest = { private: true, type: 'module', dependencies: { 'ts-syntax-highlighter': `file:${archive}` }, devDependencies: { typescript: '7.0.2', '@types/bun': '1.4.4' } }
    receipt.consumerManifest = consumerManifest
    await writeFile(join(consumer, 'package.json'), JSON.stringify(consumerManifest))
    const compilerOptions = { target: 'ESNext', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: false, paths: {}, types: [], noEmit: true }
    receipt.compilerOptions = compilerOptions
    await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions, files: ['control.ts'] }))
    for (const flags of [[], ['--frozen-lockfile']]) {
      const installed = await run(flags.length ? 'frozen-install' : 'install', [process.execPath, '--no-env-file', 'install', ...flags], consumer)
      expect(installed.code, installed.output).toBe(0)
      const lock = hash(await readFile(join(consumer, 'bun.lock')))
      if (flags.length) {
        const previous = receipt.lockSHA256
        if (typeof previous !== 'string') throw new Error('The normal installation must establish a lock hash')
        expect(lock).toBe(previous)
      }
      else receipt.lockSHA256 = lock
    }
    for (const [name, file] of files) {
      expect(name.startsWith('package/') && !name.split('/').includes('..')).toBe(true)
      const installed = await readFile(join(consumer, 'node_modules/ts-syntax-highlighter', name.slice('package/'.length)))
      expect(hash(installed), name).toBe(hash(new Uint8Array(await file.arrayBuffer())))
    }
    receipt.installedFiles = files.size
    const compiler = await Bun.file(join(consumer, 'node_modules/typescript/package.json')).json()
    expect(compiler.version).toBe('7.0.2')
    receipt.compiler = compiler.version
    const prefix = `import { BatchHighlighter, highlightStream } from 'ts-syntax-highlighter';
import type { Language, StreamChunk, TokenLine } from 'ts-syntax-highlighter';
declare const language: Language;
declare const chunk: StreamChunk;
type IsAny<T> = 0 extends (1 & T) ? true : false;
type Yield<T> = T extends AsyncGenerator<infer Value> ? Value : never;`
    const controls = [
      { text: `const stream = highlightStream('const value = 1', language);
const preciseStream: AsyncGenerator<StreamChunk> = stream;
const batches = new BatchHighlighter(2).processBatches(['const value = 1'], language);
const precise: AsyncGenerator<TokenLine[]> = batches;
const safeBatchReturn: false = null as unknown as IsAny<typeof batches>;
const safeBatch: false = null as unknown as IsAny<Yield<typeof batches>>;
const safeToken: false = null as unknown as IsAny<Yield<typeof batches>[number]['tokens'][number]>;
const safeStreamReturn: false = null as unknown as IsAny<typeof stream>;
const safeStream: false = null as unknown as IsAny<Yield<typeof stream>>;` },
      { code: 2322, text: 'new BatchHighlighter().processBatches([42], language)' },
      { code: 2339, text: 'const phantom = chunk.notAStreamField' },
    ]
    for (const [index, control] of controls.entries()) {
      await writeFile(join(consumer, 'control.ts'), `${prefix}\n${control.text}\n`)
      const checked = await run(`control-${index}`, [process.execPath, '--no-env-file', join(consumer, 'node_modules/typescript/lib/tsc.js'), '--project', 'tsconfig.json'], consumer)
      expect(checked.code === 0, checked.output).toBe(index === 0)
      if ('code' in control) {
        expect(checked.output.match(/error TS\d+/g), checked.output).toEqual([`error TS${control.code}`])
        expect(checked.output).toContain('control.ts(')
      }
    }
    await writeFile(join(consumer, 'runtime.ts'), `import { BatchHighlighter, highlightStream, languages } from 'ts-syntax-highlighter';
const language = languages.find(language => language.id === 'typescript');
if (!language) throw new Error('missing TypeScript grammar');
const code = ['const before = 1', '/*', ' * const notCode = 2', ' */', 'const after = 3'].join('\\n');
const batches = [];
for await (const batch of new BatchHighlighter(2).processBatches(code.split('\\n'), language)) batches.push(batch);
const rows = batches.flat();
if (batches.length !== 3 || rows.length !== 5 || batches[1][0].line !== 3 || !rows[2].tokens.every(token => token.type === 'block')) throw new Error('wrong batch state or line numbering');
const chunks = [];
for await (const chunk of highlightStream(code, language, { chunkSize: 2 })) chunks.push(chunk);
if (chunks.length !== 3 || !chunks[2].isComplete || !chunks.map(chunk => chunk.html).join('').includes('<span')) throw new Error('wrong streaming rendering');
console.log('PASS installed highlighter generators');`)
    const runtime = await run('runtime', [process.execPath, '--no-env-file', 'runtime.ts'], consumer)
    expect(runtime.code, runtime.output).toBe(0)
    expect(runtime.output.trim()).toBe('PASS installed highlighter generators')
    const cli = await run('cli-help', [process.execPath, '--no-env-file', join(consumer, 'node_modules/ts-syntax-highlighter/dist/bin/cli.js'), '--help'], consumer)
    expect(cli.code, cli.output).toBe(0)
    expect(cli.output).toMatch(/usage/i)
    // Source checks require the built host CLI. Released archive checks can
    // additionally name the actual released native executable.
    const native = supplied ? process.env.SYNTAX_NATIVE_CLI : resolve(import.meta.dir, '../bin/syntax')
    if (native) {
      const binary = resolve(native)
      receipt.nativeCLI = { path: binary, sha256: hash(await readFile(binary)) }
      const checked = await run('native-cli-help', [binary, '--help'], consumer)
      expect(checked.code, checked.output).toBe(0)
      expect(checked.output).toMatch(/usage/i)
    }
    receipt.completed = true
  }
  finally {
    await writeFile(join(directory, 'receipt.json'), JSON.stringify(receipt, null, 2))
    await rm(join(consumer, 'node_modules'), { recursive: true, force: true })
    if (!process.env.SYNTAX_PACKAGE_EVIDENCE) await rm(directory, { recursive: true, force: true })
  }
}, 180_000)
