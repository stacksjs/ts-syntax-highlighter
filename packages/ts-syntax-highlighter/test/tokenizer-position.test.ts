import type { Grammar } from '../src/types'
import { expect, test } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

const grammar: Grammar = {
  name: 'Position matching',
  scopeName: 'source.position',
  fastPaths: false,
  patterns: [{
    begin: '"',
    end: '"',
    name: 'string.quoted.position',
    patterns: [{ match: '\\\\.', name: 'constant.character.escape.position' }],
  }],
}

test('long resumed strings do not search the remaining line at every character', () => {
  const tokenizer = new Tokenizer(grammar)
  const state = tokenizer.tokenizeLinesFrom(['"opening']).endState
  const text = `${'a'.repeat(256_000)}\\n"`
  const started = performance.now()
  const result = tokenizer.tokenizeLinesFrom([text], JSON.parse(JSON.stringify(state)), 400)
  const elapsed = performance.now() - started
  const tokens = result.lines[0]!.tokens

  expect(tokens.map(token => token.content).join('')).toBe(text)
  expect(tokens.map(token => token.type)).toEqual(['string', 'constant', 'string'])
  expect(tokens[1]!.content).toBe('\\n')
  expect(result.lines[0]!.line).toBe(400)
  expect(result.endState.frames).toHaveLength(1)
  // The previous global escape/end searches take over two seconds on this
  // input; checking only the current position takes about twenty milliseconds.
  expect(elapsed).toBeLessThan(500)
})

test('a match begins exactly here, preserving anchors, lookbehind and unmatched text', () => {
  const tokenizer = new Tokenizer({
    name: 'Positions', scopeName: 'source.positions', fastPaths: false,
    patterns: [
      { match: '^begin', name: 'keyword.begin' },
      { match: '(?<=:)yes', name: 'constant.yes' },
      { match: 'end$', name: 'keyword.end' },
    ],
  })
  const text = 'begin middle:yes tail end'
  const tokens = tokenizer.tokenize(text)[0]!.tokens
  expect(tokens.map(token => token.content)).toEqual(['begin', ' middle:', 'yes', ' tail ', 'end'])
  expect(tokens.map(token => token.type)).toEqual(['keyword', 'text', 'constant', 'text', 'keyword'])
})

test('raw block content still searches forward for its closing marker after restoration', () => {
  const tokenizer = new Tokenizer({ name: 'Comments', scopeName: 'source.ts', patterns: [] })
  const opening = tokenizer.tokenizeLinesFrom(['/* opening'])
  const text = `${'raw text '.repeat(5_000)}*/const finished = 1`
  const result = tokenizer.tokenizeLinesFrom([text], JSON.parse(JSON.stringify(opening.endState)))
  const tokens = result.lines[0]!.tokens
  expect(tokens.map(token => token.content).join('')).toBe(text)
  expect(tokens[0]!.content).toBe('raw text '.repeat(5_000))
  expect(tokens[1]!.content).toBe('*/')
  expect(result.endState.frames).toHaveLength(1)
})
