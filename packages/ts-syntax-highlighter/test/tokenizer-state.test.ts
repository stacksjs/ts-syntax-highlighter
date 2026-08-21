// Resuming the tokenizer part way through a document.
//
// Two consumers need this and neither can work without it. A worker has to send
// its position across a boundary that cannot carry a RegExp or a reference into
// a grammar. A diff has to highlight a hunk that starts at line four hundred,
// where whether line four hundred is inside a block comment is not knowable
// from the hunk.
//
// The property that matters throughout: highlighting a range from a saved state
// gives the same answer as highlighting the whole file and taking that range.

import { describe, expect, test } from 'bun:test'
import { languages } from '../src/grammars'
import { Tokenizer } from '../src/tokenizer'

const typescript = languages.find(language => language.id === 'typescript')!
const javascript = languages.find(language => language.id === 'javascript')!

/** A file where line 4 onwards is only correct if line 1 is remembered. */
const insideBlockComment = `/*
 * a block comment
 * that keeps going
 * const notCode = 1
 */
const real = 1
`

const lines = (text: string) => text.split('\n')

/** The token types on one line, which is what visibly differs when state is lost. */
function typesOf(tokenizer: Tokenizer, text: string, lineIndex: number): string[] {
  const all = tokenizer.tokenize(text)
  return all[lineIndex]!.tokens.map(token => token.type)
}

describe('getState and setState', () => {
  test('a state survives JSON, which is what a worker boundary does to it', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    tokenizer.tokenize(insideBlockComment)

    const state = tokenizer.getState()
    const roundTripped = JSON.parse(JSON.stringify(state))

    expect(roundTripped).toEqual(state)
    expect(() => tokenizer.setState(roundTripped)).not.toThrow()
  })

  test('an initial state is what a document starts in', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    const initial = tokenizer.initialState()

    expect(initial.scopeName).toBe(typescript.grammar.scopeName)
    expect(initial.frames).toHaveLength(1)
    expect(initial.frames[0]!.pattern).toBeNull()
  })

  test('a state from another grammar is refused rather than quietly misapplied', () => {
    const ts = new Tokenizer(typescript.grammar)
    const js = new Tokenizer(javascript.grammar)

    expect(() => js.setState(ts.initialState())).toThrow(/state belongs to/)
  })

  test('restoring an empty state leaves the tokenizer usable', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    tokenizer.setState({ scopeName: typescript.grammar.scopeName, frames: [] })

    expect(() => tokenizer.tokenizeLine('const a = 1', 1)).not.toThrow()
  })
})

describe('tokenizeLinesFrom', () => {
  test('a run from the start matches tokenizing the whole thing', () => {
    const whole = new Tokenizer(typescript.grammar).tokenize(insideBlockComment)
    const { lines: run } = new Tokenizer(typescript.grammar).tokenizeLinesFrom(lines(insideBlockComment))

    expect(run.map(line => line.tokens.map(token => token.content))).toEqual(
      whole.map(line => line.tokens.map(token => token.content)),
    )
  })

  test('numbers lines from where the run starts, not from one', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    const { lines: run } = tokenizer.tokenizeLinesFrom(['const a = 1', 'const b = 2'], undefined, 400)

    expect(run[0]!.line).toBe(400)
    expect(run[1]!.line).toBe(401)
  })

  test('resuming from a saved state gives the same tokens as never having stopped', () => {
    const all = lines(insideBlockComment)

    const whole = new Tokenizer(typescript.grammar).tokenizeLinesFrom(all).lines

    const split = new Tokenizer(typescript.grammar)
    const first = split.tokenizeLinesFrom(all.slice(0, 3), undefined, 1)
    const second = split.tokenizeLinesFrom(all.slice(3), first.endState, 4)

    const rejoined = [...first.lines, ...second.lines]
    expect(rejoined.map(line => line.tokens.map(token => token.content)))
      .toEqual(whole.map(line => line.tokens.map(token => token.content)))
  })

  test('resuming through a JSON round trip gives the same tokens again', () => {
    const all = lines(insideBlockComment)

    const direct = new Tokenizer(typescript.grammar)
    const firstDirect = direct.tokenizeLinesFrom(all.slice(0, 3), undefined, 1)
    const expected = direct.tokenizeLinesFrom(all.slice(3), firstDirect.endState, 4).lines

    const viaJson = new Tokenizer(typescript.grammar)
    const firstJson = viaJson.tokenizeLinesFrom(all.slice(0, 3), undefined, 1)
    const posted = JSON.parse(JSON.stringify(firstJson.endState))
    const actual = viaJson.tokenizeLinesFrom(all.slice(3), posted, 4).lines

    expect(actual.map(line => line.tokens.map(token => token.type)))
      .toEqual(expected.map(line => line.tokens.map(token => token.type)))
  })

  test('starting mid-comment with no state is different from starting with one', () => {
    // The failure this whole mechanism exists to prevent: a hunk starting on
    // line 4 of the fixture is inside a block comment, and tokenized cold it is
    // read as code.
    const all = lines(insideBlockComment)

    const cold = new Tokenizer(typescript.grammar)
    const coldTokens = cold.tokenizeLinesFrom(all.slice(3, 4), undefined, 4).lines

    const warm = new Tokenizer(typescript.grammar)
    const upTo = warm.tokenizeLinesFrom(all.slice(0, 3), undefined, 1)
    const warmTokens = warm.tokenizeLinesFrom(all.slice(3, 4), upTo.endState, 4).lines

    const coldScopes = coldTokens[0]!.tokens.map(token => token.scopes.join(' ')).join('|')
    const warmScopes = warmTokens[0]!.tokens.map(token => token.scopes.join(' ')).join('|')

    expect(warmScopes).not.toBe(coldScopes)
  })
})

describe('checkpoints', () => {
  const long = Array.from({ length: 1000 }, (_, index) => `const value${index} = ${index}`).join('\n')

  test('records a state every interval, keyed by the line it precedes', () => {
    const checkpoints = new Tokenizer(typescript.grammar).checkpoints(long, 100)

    expect(checkpoints.has(1)).toBe(true)
    expect(checkpoints.has(101)).toBe(true)
    expect(checkpoints.size).toBe(10)
  })

  test('a range resumed from its checkpoint matches the whole-file answer', () => {
    const all = long.split('\n')
    const whole = new Tokenizer(typescript.grammar).tokenize(long)
    const checkpoints = new Tokenizer(typescript.grammar).checkpoints(long, 100)

    const resumed = new Tokenizer(typescript.grammar)
      .tokenizeLinesFrom(all.slice(400, 450), checkpoints.get(401), 401).lines

    expect(resumed.map(line => line.tokens.map(token => token.content)))
      .toEqual(whole.slice(400, 450).map(line => line.tokens.map(token => token.content)))
  })

  test('an empty document has no checkpoints past the first', () => {
    expect(new Tokenizer(typescript.grammar).checkpoints('', 100).size).toBe(1)
  })
})

describe('token content reproduces the input', () => {
  // The one property everything downstream rests on. A highlighter that drops a
  // space is showing code that is not in the file, and in a diff the whitespace
  // is often the entire change. Asserted across every grammar rather than for
  // the languages somebody happened to think of.
  const samples = [
    'const a = 1',
    '  indented(  spaced  )  ',
    '\tif (a) {\t}',
    '// a comment with "quotes" and \'apostrophes\'',
    'x = "a string with \\" an escape"',
    '',
    '   ',
    'ünïcödé + 日本語 + 🎉',
    '<<<<<<< HEAD',
    'a.b.c[0]?.d ?? e',
  ]

  for (const language of languages) {
    test(`${language.id} reproduces every sample exactly`, () => {
      const tokenizer = new Tokenizer(language.grammar)

      for (const sample of samples) {
        const tokenLine = tokenizer.tokenizeLine(sample, 1)
        const rebuilt = tokenLine.tokens.map(token => token.content).join('')

        expect(rebuilt).toBe(sample)
      }
    })
  }

  test('and reproduces a multi-line document, line by line', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    const source = insideBlockComment

    const rebuilt = tokenizer.tokenize(source)
      .map(line => line.tokens.map(token => token.content).join(''))
      .join('\n')

    expect(rebuilt).toBe(source)
  })
})

describe('line numbers are absolute', () => {
  test('a run tokenized from line 400 reports line 400', () => {
    const tokenizer = new Tokenizer(typescript.grammar)
    const { lines: run } = tokenizer.tokenizeLinesFrom(['const a = 1'], undefined, 400)

    expect(run[0]!.tokens[0]!.line).toBe(400)
  })

  test('typesOf is stable across repeated tokenizes, so state does not leak between calls', () => {
    const tokenizer = new Tokenizer(typescript.grammar)

    expect(typesOf(tokenizer, insideBlockComment, 5)).toEqual(typesOf(tokenizer, insideBlockComment, 5))
  })
})

/**
 * A frame opened by a repository rule has to survive being written down.
 *
 * `getState` records a frame as a path into the pattern tree, and only the
 * *root* patterns were in that tree. Nearly every begin/end rule in every
 * grammar here lives in the repository, so nearly every frame serialised as
 * `pattern: null` and came back with a scope, no rule and no closing pattern -
 * a template literal that could never end, its contents tokenized as code and
 * the code after it swallowed.
 *
 * Block comments hid it for as long as it existed, because the fast path opens
 * those as raw frames carrying their own marker, so the one case anybody
 * checked was the one case that did not go through the pattern tree at all.
 */
describe('a frame from the repository survives a round trip', () => {
  const tokenizer = new Tokenizer(typescript.grammar)

  test('records the rule that opened it', () => {
    const state = tokenizer.tokenizeLinesFrom(['const html = `', '  <div>']).endState
    const frame = state.frames[state.frames.length - 1]!

    expect(frame.scopes).toContain('string.template.ts')
    expect(frame.pattern).not.toBeNull()
  })

  test('resumes inside the template, closes it, and returns to code', () => {
    const opened = tokenizer.tokenizeLinesFrom(['const html = `', '  <div>']).endState
    const { lines } = tokenizer.tokenizeLinesFrom(['  return null', '`', 'const after = 2'], opened)

    const types = lines.map(line => line.tokens.map(token => token.type))

    // Inside the template, `return` is not a keyword.
    expect(types[0]).toEqual(['string'])
    // The backtick belongs to the string it closes.
    expect(types[1]).toEqual(['string'])
    // And the line after it is code again, which is what proves the frame
    // closed rather than simply never opening.
    expect(types[2]).toContain('keyword')
  })

  test('is the same answer as tokenizing the whole thing in one pass', () => {
    const whole = 'const html = `\n  <div>\n  return null\n`\nconst after = 2'
    const inOnePass = new Tokenizer(typescript.grammar).tokenize(whole)
      .map(line => line.tokens.map(token => `${token.type}:${token.content}`))

    const first = tokenizer.tokenizeLinesFrom(['const html = `', '  <div>'])
    const rest = tokenizer.tokenizeLinesFrom(['  return null', '`', 'const after = 2'], first.endState)
    const resumed = [...first.lines, ...rest.lines]
      .map(line => line.tokens.map(token => `${token.type}:${token.content}`))

    expect(resumed).toEqual(inOnePass)
  })
})
