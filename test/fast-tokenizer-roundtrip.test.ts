import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../packages/ts-syntax-highlighter/src'

/**
 * A token stream has to reproduce its input.
 *
 * The fast tokenizer stepped over whitespace, so `  const a = 1` came back as
 * `consta=1`. Anything rendering code from these tokens then showed something
 * that was not the file: indentation gone, spacing gone, and in a diff view the
 * whitespace is frequently the entire change being reviewed.
 *
 * Round-trip fidelity is the property that matters, so it is asserted directly
 * rather than through the shape of the tokens.
 */
async function roundTrips(code: string, language: string): Promise<boolean> {
  const highlighter = await createHighlighter({})
  const lines = highlighter.highlightFast(code, language)

  const rebuilt = lines.map(line => line.tokens.map(token => token.content).join('')).join('\n')

  return rebuilt === code
}

describe('fast tokenizer round trip', () => {
  it('keeps leading indentation', async () => {
    expect(await roundTrips('  const a = 1', 'typescript')).toBe(true)
  })

  it('keeps tabs', async () => {
    expect(await roundTrips('\tif (a) {', 'typescript')).toBe(true)
  })

  it('keeps the spacing between operators', async () => {
    expect(await roundTrips('const total = a + b', 'typescript')).toBe(true)
  })

  it('keeps runs of several spaces, which alignment depends on', async () => {
    expect(await roundTrips('const a   =   1', 'typescript')).toBe(true)
  })

  it('handles an empty line', async () => {
    expect(await roundTrips('', 'typescript')).toBe(true)
  })

  it('handles a line that is only whitespace', async () => {
    expect(await roundTrips('    ', 'typescript')).toBe(true)
  })

  it('handles several lines together', async () => {
    const code = ['function go() {', '  const a = 1', '', '  return a', '}'].join('\n')

    expect(await roundTrips(code, 'typescript')).toBe(true)
  })

  it('keeps template literals intact', async () => {
    expect(await roundTrips('const s = `a ${b} c`', 'typescript')).toBe(true)
  })

  it('keeps comments and the space before them', async () => {
    expect(await roundTrips('const a = 1 // a note', 'typescript')).toBe(true)
  })

  it('round trips css', async () => {
    expect(await roundTrips('.a {\n  color: red;\n}', 'css')).toBe(true)
  })

  it('round trips html', async () => {
    expect(await roundTrips('<div class="a">\n  <span>hi</span>\n</div>', 'html')).toBe(true)
  })

  it('round trips json', async () => {
    expect(await roundTrips('{\n  "a": 1\n}', 'json')).toBe(true)
  })
})

describe('preserveWhitespace: false', () => {
  it('still classifies, for callers that only measure', async () => {
    const { FastTokenizer } = await import('../packages/ts-syntax-highlighter/src/fast-tokenizer')
    const highlighter = await createHighlighter({})
    const grammar = (highlighter as any).getLanguageById('typescript').grammar

    const tokens = new FastTokenizer(grammar, { preserveWhitespace: false })
      .tokenize('  const a = 1')[0]!
      .tokens

    expect(tokens.some(token => token.type === 'whitespace')).toBe(false)
    expect(tokens.some(token => token.type === 'keyword')).toBe(true)
  })
})
