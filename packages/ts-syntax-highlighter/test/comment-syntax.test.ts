/**
 * Which languages have which comments.
 *
 * The check used to be "is this HTML?", so every other language inherited
 * JavaScript's comment syntax. A URL is the shape that exposes it: `curl
 * https://x.dev` in a shell script, or a link in a README, had everything after
 * the second slash rendered as a comment - and there is no string around an
 * unquoted URL to protect it. READMEs and shell scripts are full of URLs, so
 * this was visible on ordinary files and looked like the highlighter simply
 * giving up halfway through a line.
 */

import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'

const highlighter = await createHighlighter({})

function tokens(code: string, language: string): string[] {
  return highlighter.highlightFast(code, language)
    .flatMap(line => line.tokens.map(token => `${token.type}:${token.content}`))
}

function commented(code: string, language: string): string[] {
  return highlighter.highlightFast(code, language)
    .flatMap(line => line.tokens.filter(token => token.type === 'comment').map(token => token.content))
}

describe('a URL is not a comment', () => {
  const cases: Array<[string, string]> = [
    ['bash', 'curl https://example.dev/thing'],
    ['yaml', 'homepage: https://example.dev/thing'],
    ['markdown', 'See [the docs](https://example.dev) and the rest of this sentence.'],
    ['toml', 'homepage = https://example.dev'],
    ['dockerfile', 'RUN curl https://example.dev'],
  ]

  for (const [language, code] of cases) {
    it(`survives in ${language}`, () => {
      expect(commented(code, language)).toEqual([])
    })
  }
})

describe('the languages that do have a double-slash comment', () => {
  const cases: Array<[string, string]> = [
    ['typescript', 'const a = 1 // why'],
    ['javascript', 'const a = 1 // why'],
    ['go', 'x := 1 // why'],
    ['rust', 'let x = 1; // why'],
    ['php', '$a = 1; // why'],
  ]

  for (const [language, code] of cases) {
    it(`keeps it in ${language}`, () => {
      expect(commented(code, language)).toEqual(['// why'])
    })
  }

  it('and the block form, in CSS', () => {
    expect(commented('/* why */ a { color: red }', 'css')).toEqual(['/* why */'])
  })
})

describe('the languages where # is a comment', () => {
  const cases: Array<[string, string, string]> = [
    ['bash', 'ls -la # why', '# why'],
    ['yaml', 'key: value # why', '# why'],
    ['python', 'a = 1 # why', '# why'],
    ['toml', 'a = 1 # why', '# why'],
    ['dockerfile', 'RUN ls # why', '# why'],
  ]

  for (const [language, code, expected] of cases) {
    it(`reads it in ${language}`, () => {
      expect(commented(code, language)).toEqual([expected])
    })
  }

  /**
   * A string is consumed whole before the loop comes back round, so a hash
   * inside one is part of the string and a hash after it is a comment.
   */
  it('but not one inside a string', () => {
    expect(commented('url = "a # b"', 'python')).toEqual([])
    expect(commented('url = "a # b"  # why', 'python')).toEqual(['# why'])
  })

  it('and not in a language that has no hash comment', () => {
    expect(commented('const a = 1 # not a comment', 'typescript')).toEqual([])
  })
})

describe('a markdown heading', () => {
  it('is structure rather than a comment or plain text', () => {
    expect(tokens('# Title', 'markdown')).toContain('keyword:# Title')
    expect(tokens('### Deeper', 'markdown')).toContain('keyword:### Deeper')
  })

  it('needs a space after the hashes, so a hashtag is not one', () => {
    expect(tokens('#hashtag', 'markdown')).not.toContain('keyword:#hashtag')
  })

  it('stops at six, which is as deep as markdown goes', () => {
    expect(tokens('####### seven', 'markdown')).not.toContain('keyword:####### seven')
  })

  it('only at the start of a line', () => {
    expect(commented('a # b', 'markdown')).toEqual([])
  })
})

/** The property everything rests on, across every language touched here. */
describe('every one of them still reproduces its input', () => {
  it('exactly', () => {
    const sources: Array<[string, string]> = [
      ['bash', 'curl https://x.dev # why\necho "a # b"'],
      ['yaml', 'a: https://x.dev # why'],
      ['markdown', '# Title\n\nSee [docs](https://x.dev).'],
      ['python', 'url = "a # b"  # why'],
      ['typescript', 'const a = 1 // why\n/* and */ const b = 2'],
      ['css', 'a { color: red } /* why */'],
    ]

    for (const [language, code] of sources) {
      const rebuilt = highlighter.highlightFast(code, language)
        .map(line => line.tokens.map(token => token.content).join(''))
        .join('\n')

      expect(rebuilt).toBe(code)
    }
  })
})
