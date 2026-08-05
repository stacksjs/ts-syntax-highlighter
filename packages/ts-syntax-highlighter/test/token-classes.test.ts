// What a token's `type` says it is.
//
// Two bugs lived here for a long time, both found by rendering a real diff
// rather than by a test. Every keyword in every language was typed with the
// language name, and a block comment spanning lines was tokenized as code. The
// second is the one a reader sees: a documented file becomes a wash of colour
// with no relationship to what it says.

import { describe, expect, test } from 'bun:test'
import { FastTokenizer } from '../src/fast-tokenizer'
import { languages } from '../src/grammars'
import { classifyScope, Tokenizer } from '../src/tokenizer'

const typescript = languages.find(language => language.id === 'typescript')!
const html = languages.find(language => language.id === 'html')!

/** The classes a stylesheet can reasonably colour. Anything else is a bug. */
const KNOWN = new Set([
  'text',
  'whitespace',
  'keyword',
  'string',
  'comment',
  'numeric',
  'constant',
  'function',
  'operator',
  'punctuation',
  'type',
  'variable',
  'tag',
  'attribute',
  // The tokenizer's own interned names for comment and string shapes.
  'line',
  'block',
  'double',
  'single',
  'template',
])

describe('classifyScope', () => {
  test('reads the kind from the front, not the language from the back', () => {
    expect(classifyScope('storage.type.ts')).toBe('keyword')
    expect(classifyScope('keyword.control.python')).toBe('keyword')
    expect(classifyScope('keyword.other.rust')).toBe('keyword')
  })

  test('an operator is an operator, not a keyword, despite the prefix', () => {
    expect(classifyScope('keyword.operator.rust')).toBe('operator')
  })

  test('a number is a number, not a constant in general', () => {
    expect(classifyScope('constant.numeric.go')).toBe('numeric')
    expect(classifyScope('constant.language.js')).toBe('constant')
  })

  test('the remaining classes map to what a stylesheet would call them', () => {
    expect(classifyScope('string.quoted.double.ts')).toBe('string')
    expect(classifyScope('comment.block.ts')).toBe('comment')
    expect(classifyScope('entity.name.function.python')).toBe('function')
    expect(classifyScope('entity.name.tag.html')).toBe('tag')
    expect(classifyScope('entity.other.attribute-name.html')).toBe('attribute')
    expect(classifyScope('punctuation.definition.ts')).toBe('punctuation')
    expect(classifyScope('variable.other.ts')).toBe('variable')
  })

  test('something it has never seen is text rather than a made-up class', () => {
    expect(classifyScope('meta.whatever.ts')).toBe('text')
    expect(classifyScope('ts')).toBe('text')
  })
})

describe('token types across every grammar', () => {
  const samples = ['const a = 1', 'function f(x) { return x }', 'x = "a string"', '// a comment']

  for (const language of languages) {
    test(`${language.id} only emits classes a stylesheet knows`, () => {
      const tokenizer = new Tokenizer(language.grammar)

      for (const sample of samples) {
        for (const token of tokenizer.tokenizeLine(sample, 1).tokens) {
          // A language name here means the scope was read from the wrong end,
          // which is what put every keyword in its own per-language bucket.
          expect(KNOWN.has(token.type)).toBe(true)
        }
      }
    })
  }
})

describe('multi-line block comments', () => {
  const documented = `/**
 * The total for a cart.
 * Tax is applied per line, not once at the end.
 */
export const total = 1`

  test('the fast tokenizer keeps a block comment open across lines', () => {
    const lines = new FastTokenizer(typescript.grammar).tokenize(documented)

    for (let index = 0; index < 4; index++)
      expect(lines[index]!.tokens.every(token => token.type === 'comment')).toBe(true)
  })

  test('so a word inside prose is not a keyword', () => {
    // `for` and `is` are keywords in TypeScript and ordinary English words in a
    // sentence. This is the case that made a documented file unreadable.
    const lines = new FastTokenizer(typescript.grammar).tokenize(documented)
    const types = lines[1]!.tokens.map(token => token.type)

    expect(types).not.toContain('keyword')
  })

  test('code after the comment closes is code again', () => {
    const lines = new FastTokenizer(typescript.grammar).tokenize(documented)

    expect(lines[4]!.tokens.some(token => token.type === 'keyword')).toBe(true)
  })

  test('it still reproduces the input exactly', () => {
    const lines = new FastTokenizer(typescript.grammar).tokenize(documented)
    const rebuilt = lines.map(line => line.tokens.map(token => token.content).join('')).join('\n')

    expect(rebuilt).toBe(documented)
  })

  test('a single-line block comment does not leave one open', () => {
    const tokenizer = new FastTokenizer(typescript.grammar)
    tokenizer.tokenize('/* short */\nconst a = 1')

    expect(tokenizer.getOpenComment()).toBeNull()
  })

  test('an empty line inside a comment stays inside it', () => {
    const withBlank = '/*\n\n*/\nconst a = 1'
    const lines = new FastTokenizer(typescript.grammar).tokenize(withBlank)

    expect(lines[1]!.tokens).toEqual([])
    expect(lines[3]!.tokens.some(token => token.type === 'keyword')).toBe(true)
  })

  test('tokenizing one document does not leave a comment open for the next', () => {
    const tokenizer = new FastTokenizer(typescript.grammar)
    tokenizer.tokenize('/* never closed')
    const second = tokenizer.tokenize('const a = 1')

    expect(second[0]!.tokens.some(token => token.type === 'keyword')).toBe(true)
  })

  test('a caller tokenizing in pieces can carry the state itself', () => {
    const first = new FastTokenizer(typescript.grammar)
    first.tokenize('/* opened here')

    const second = new FastTokenizer(typescript.grammar)
    const lines = second.tokenize('still inside the comment', first.getOpenComment())

    expect(lines[0]!.tokens.every(token => token.type === 'comment')).toBe(true)
  })

  test('html comments span lines too', () => {
    const markup = '<!--\n<div>not an element</div>\n-->\n<p>real</p>'
    const lines = new FastTokenizer(html.grammar).tokenize(markup)

    expect(lines[1]!.tokens.every(token => token.type === 'comment')).toBe(true)
    expect(lines.map(line => line.tokens.map(token => token.content).join('')).join('\n')).toBe(markup)
  })
})
