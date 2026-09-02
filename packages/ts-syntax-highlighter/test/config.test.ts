import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'bun:test'
import { config, defaultConfig, getConfig, isVerbose, loadSyntaxHighlighterConfig } from '../src/config'

describe('config', () => {
  it('exposes a usable default config without requiring loadSyntaxHighlighterConfig to run', () => {
    expect(config).toEqual(defaultConfig)
    expect(getConfig('theme')).toBe(defaultConfig.theme)
    expect(isVerbose()).toBe(false)
  })

  it('still loads config from disk when a caller opts in', async () => {
    const loaded = await loadSyntaxHighlighterConfig()
    expect(loaded).toBeTruthy()
    expect(loaded.theme).toBeTruthy()
  })

  it('does not statically import the Node/Bun-only config loader at module scope', () => {
    // `bunfig` reads config files from disk and, as of the version this
    // package depends on, runs its own eager, unguarded `process.env`
    // access the moment it is imported - safe under Bun/Node, but a hard
    // crash for any browser consumer that pulls it in just by importing
    // this package's index, whether or not they ever call
    // `loadSyntaxHighlighterConfig()`. A static top-level import here
    // regresses that; it must stay dynamic, inside the function that
    // actually needs it.
    const source = readFileSync(new URL('../src/config.ts', import.meta.url), 'utf-8')

    expect(source).not.toMatch(/^import\s+.*from\s+['"]bunfig['"]/m)
    expect(source).toContain('await import(\'bunfig\')')
  })
})
