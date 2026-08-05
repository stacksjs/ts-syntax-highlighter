/**
 * Tokens as flat arrays.
 *
 * The property everything rests on is that the flat form is *lossless* against
 * the object form, because the contents are not stored - only the boundaries -
 * and the line is cut back up on the way out. That is only sound while the
 * tokens reproduce their line, so the packer checks rather than assumes, and
 * the tests below spend most of their time on the case where they do not.
 */

import { describe, expect, it } from 'bun:test'
import {
  type FlatToken,
  overTokenizeCeiling,
  packLines,
  plainLines,
  TOKENIZE_CEILING_CHARS,
  transferable,
  unpackLines,
} from '../src/flat-tokens'

const line = (...parts: [string, string][]): FlatToken[] =>
  parts.map(([type, content]) => ({ type, content }))

describe('packLines and unpackLines', () => {
  const lines = [
    line(['keyword', 'const'], ['text', ' '], ['variable', 'a'], ['text', ' '], ['operator', '='], ['numeric', '1']),
    line(['comment', '// done']),
    [],
  ]

  it('round trips to exactly what went in', () => {
    expect(unpackLines(packLines(lines))).toEqual(lines)
  })

  it('keeps an empty line as an empty line rather than dropping it', () => {
    const flat = packLines(lines)

    expect(flat.text).toHaveLength(3)
    expect(unpackLines(flat)[2]).toEqual([])
  })

  it('stores each class name once however often it is used', () => {
    const repeated = Array.from({ length: 500 }, () => line(['keyword', 'if'], ['text', ' ']))

    expect(packLines(repeated).classes).toEqual(['keyword', 'text'])
  })

  it('holds the tokens as offsets, not as copies of the text', () => {
    const flat = packLines(lines)

    // Six tokens on the first line, one on the second, none on the third.
    expect([...flat.starts]).toEqual([0, 6, 7, 7])
    expect(flat.ends.length).toBe(7)
    expect(flat.types.length).toBe(7)
  })

  /**
   * The one property this library rests on. A token stream that does not
   * reproduce its line cannot be stored as offsets into that line - the offsets
   * would cut the *original* text at the wrong places and render characters the
   * file does not contain.
   */
  it('falls back to one plain token when the tokens do not reproduce the line', () => {
    const wrong = [line(['keyword', 'const'], ['variable', 'a'])]
    const sources = ['const a']

    const unpacked = unpackLines(packLines(wrong, sources))

    expect(unpacked).toEqual([[{ type: 'text', content: 'const a' }]])
  })

  it('and the fallback does not leave the arrays carrying the difference', () => {
    const flat = packLines([line(['a', 'x'], ['b', 'y'], ['c', 'z'])], ['xyz different'])

    expect(flat.ends.length).toBe(1)
    expect(flat.types.length).toBe(1)
    expect([...flat.starts]).toEqual([0, 1])
  })

  it('takes the sources as given, so a line is the line and not the tokens', () => {
    const flat = packLines([line(['text', 'a'], ['text', 'b'])], ['ab'])

    expect(flat.text).toEqual(['ab'])
    expect(unpackLines(flat)[0]!.map(token => token.content).join('')).toBe('ab')
  })

  it('survives content that is not ASCII', () => {
    const emoji = [line(['text', '✨ '], ['string', '"héllo"'])]

    expect(unpackLines(packLines(emoji))).toEqual(emoji)
  })

  it('names the buffers a caller can transfer', () => {
    const flat = packLines(lines)

    expect(transferable(flat)).toHaveLength(3)
    for (const buffer of transferable(flat))
      expect(buffer.byteLength).toBeGreaterThan(0)
  })
})

describe('the tokenize ceiling', () => {
  it('is over when the source is longer than it', () => {
    expect(overTokenizeCeiling('a'.repeat(TOKENIZE_CEILING_CHARS + 1))).toBe(true)
    expect(overTokenizeCeiling('a'.repeat(TOKENIZE_CEILING_CHARS))).toBe(false)
  })

  it('counts the newlines when it is given lines', () => {
    // Ten lines of nine characters plus their newlines is exactly 100.
    expect(overTokenizeCeiling(Array.from({ length: 10 }, () => 'a'.repeat(9)), 100)).toBe(false)
    expect(overTokenizeCeiling(Array.from({ length: 10 }, () => 'a'.repeat(9)), 99)).toBe(true)
  })

  /** A minified bundle is one line of a hundred thousand characters. */
  it('catches one enormous line as readily as many small ones', () => {
    expect(overTokenizeCeiling(['a'.repeat(200_000)])).toBe(true)
  })

  it('takes a caller-supplied ceiling', () => {
    expect(overTokenizeCeiling('abcdef', 3)).toBe(true)
    expect(overTokenizeCeiling('abc', 3)).toBe(false)
  })
})

describe('plainLines', () => {
  it('is one text token per line, reproducing every line', () => {
    const lines = ['const a = 1', '', '  indented']

    expect(plainLines(lines).map(tokens => tokens.map(token => token.content).join(''))).toEqual(lines)
  })
})
