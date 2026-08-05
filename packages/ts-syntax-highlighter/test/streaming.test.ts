// Chunked highlighting.
//
// The previous implementation of `highlightStream` yielded the source text
// unchanged: it assigned the theme to an unused variable and joined the token
// contents back together. It had no test, which is how it stayed that way. The
// first two tests here are the ones that would have caught it.

import { describe, expect, test } from 'bun:test'
import { languages } from '../src/grammars'
import { BatchHighlighter, highlightRange, highlightStream, streamCSS } from '../src/streaming'
import { Tokenizer } from '../src/tokenizer'

const typescript = languages.find(language => language.id === 'typescript')!

const source = Array.from({ length: 250 }, (_, index) => `const value${index} = ${index}`).join('\n')

const withComment = `const before = 1
/*
 * const notCode = 2
 */
const after = 3`

async function chunksOf(code: string, chunkSize: number) {
  const collected = []
  for await (const chunk of highlightStream(code, typescript, { chunkSize }))
    collected.push(chunk)
  return collected
}

describe('highlightStream', () => {
  test('yields markup, not the source text', async () => {
    const [chunk] = await chunksOf('const a = 1', 100)

    expect(chunk!.html).toContain('<span')
    expect(chunk!.html).not.toBe('const a = 1')
  })

  test('the markup is coloured, which is the whole point of passing a theme', async () => {
    const [chunk] = await chunksOf('const a = 1', 100)

    expect(chunk!.html).toContain('style=')
  })

  test('chunks cover the file once, in order, with absolute line numbers', async () => {
    const chunks = await chunksOf(source, 100)

    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toMatchObject({ firstLine: 1, lineNumber: 100, isComplete: false })
    expect(chunks[1]).toMatchObject({ firstLine: 101, lineNumber: 200, isComplete: false })
    expect(chunks[2]).toMatchObject({ firstLine: 201, lineNumber: 250, isComplete: true })
  })

  test('the tokens carry the line they actually came from', async () => {
    const chunks = await chunksOf(source, 100)

    expect(chunks[1]!.tokens[0]!.line).toBe(101)
  })

  test('chunk size does not change the tokens', async () => {
    const one = (await chunksOf(source, 1000)).flatMap(chunk => chunk.tokens)
    const many = (await chunksOf(source, 7)).flatMap(chunk => chunk.tokens)

    expect(many.map(line => line.tokens.map(token => token.content)))
      .toEqual(one.map(line => line.tokens.map(token => token.content)))
  })

  test('a comment spanning a chunk boundary stays a comment', async () => {
    // The reason the state is carried. With a chunk size of 2 the comment opens
    // in one chunk and closes in another.
    const chunks = await chunksOf(withComment, 2)
    const tokens = chunks.flatMap(chunk => chunk.tokens)

    expect(tokens[2]!.tokens.every(token => token.type === 'block')).toBe(true)
  })

  test('reassembling every chunk reproduces the file exactly', async () => {
    const chunks = await chunksOf(withComment, 2)
    const rebuilt = chunks
      .flatMap(chunk => chunk.tokens)
      .map(line => line.tokens.map(token => token.content).join(''))
      .join('\n')

    expect(rebuilt).toBe(withComment)
  })

  test('an empty file still yields one completed chunk', async () => {
    const chunks = await chunksOf('', 100)

    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toMatchObject({ html: '', isComplete: true })
  })

  test('the last chunk hands back a state that can be resumed from', async () => {
    const chunks = await chunksOf(withComment, 2)
    const { endState } = chunks[chunks.length - 1]!

    expect(endState.scopeName).toBe(typescript.grammar.scopeName)
    expect(() => new Tokenizer(typescript.grammar).setState(endState)).not.toThrow()
  })
})

describe('streamCSS', () => {
  test('produces a stylesheet once for the whole stream', () => {
    expect(streamCSS().length).toBeGreaterThan(0)
  })
})

describe('highlightRange', () => {
  const lines = withComment.split('\n')

  test('numbers the range from where it starts', () => {
    const { tokens } = highlightRange(lines.slice(4), typescript, 5)

    expect(tokens[0]!.line).toBe(5)
  })

  test('given the state before it, a range highlights as it would in the whole file', () => {
    // The diff case: a hunk beginning at line 3 sits inside a block comment,
    // and only the state carries that fact.
    const checkpoints = new Tokenizer(typescript.grammar).checkpoints(withComment, 1)
    const warm = highlightRange(lines.slice(2, 3), typescript, 3, checkpoints.get(3))

    expect(warm.tokens[0]!.tokens.every(token => token.type === 'block')).toBe(true)
  })

  test('without a state the same range is read as code, which is the documented approximation', () => {
    const cold = highlightRange(lines.slice(2, 3), typescript, 3)

    expect(cold.tokens[0]!.tokens.every(token => token.type === 'block')).toBe(false)
  })

  test('reproduces its input either way', () => {
    for (const state of [undefined, new Tokenizer(typescript.grammar).checkpoints(withComment, 1).get(3)]) {
      const { tokens } = highlightRange(lines.slice(2, 3), typescript, 3, state)
      expect(tokens[0]!.tokens.map(token => token.content).join('')).toBe(lines[2])
    }
  })
})

describe('BatchHighlighter', () => {
  test('batches carry state, so a comment does not reopen every batch', async () => {
    const batches = []
    for await (const batch of new BatchHighlighter(2).processBatches(withComment.split('\n'), typescript))
      batches.push(batch)

    const tokens = batches.flat()
    expect(tokens).toHaveLength(5)
    expect(tokens[2]!.tokens.every(token => token.type === 'block')).toBe(true)
  })

  test('numbers lines absolutely across batches', async () => {
    const batches = []
    for await (const batch of new BatchHighlighter(2).processBatches(source.split('\n'), typescript))
      batches.push(batch)

    expect(batches[1]![0]!.line).toBe(3)
  })
})
