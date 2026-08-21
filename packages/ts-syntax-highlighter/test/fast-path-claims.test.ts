/**
 * What the fast paths are allowed to answer.
 *
 * The root character fast paths exist because most of a source file is
 * whitespace, punctuation, identifiers and numbers, and running twelve regular
 * expressions over each of those characters is most of what a slow tokenizer
 * spends its time on. They answer before the pattern loop, which is the point.
 *
 * They also answered for three languages that had said otherwise, and in every
 * case the grammar carried a correct rule that never ran:
 *
 * - `'` opens a string in most languages. In Rust it opens a char literal or a
 *   lifetime, and reading `'a` in `fn longest<'a>` as a string swallowed the
 *   rest of the signature into it.
 * - `[` is punctuation in every language. In C# it opens an attribute, and
 *   `[Serializable]` came back as three plain tokens with `meta.attribute.cs`
 *   nowhere in sight.
 * - A word is an identifier unless a `(` follows it. `println!` is a macro and
 *   `name:` is a key, and the character that says so is the one after the word.
 *
 * All three are the same shape: the fast path is right about the character and
 * wrong about the language, and being wrong costs a rule that exists.
 */

import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { csharpGrammar } from '../src/grammars/csharp'
import { rustGrammar } from '../src/grammars/rust'
import { typescriptGrammar } from '../src/grammars/typescript'
import { yamlGrammar } from '../src/grammars/yaml'
import { Tokenizer } from '../src/tokenizer'

function scoped(tokenizer: Tokenizer, code: string): Array<[string, string]> {
  return tokenizer.tokenize(code)
    .flatMap((line: TokenLine) => line.tokens)
    .map((token: Token) => [token.content, token.scopes.join(' ')] as [string, string])
}

function scopesOf(tokenizer: Tokenizer, code: string, content: string): string {
  return scoped(tokenizer, code).filter(([text]) => text === content).map(([, scopes]) => scopes).join(' | ')
}

describe('a quote the grammar does not want', () => {
  const rust = new Tokenizer(rustGrammar)

  it('reads every lifetime in a signature, and none of them as a string', () => {
    const found = scoped(rust, `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {`)
      .filter(([, scopes]) => scopes.includes('lifetime'))

    expect(found.map(([text]) => text)).toEqual(['\'a', '\'a', '\'a', '\'a'])
  })

  it('still reads a char literal as one, because it is the closing quote that decides', () => {
    expect(scopesOf(rust, `let c = 'a';`, '\'a\'')).toContain('string.quoted.single.rust')
    expect(scopesOf(rust, `let n = '\\n';`, '\'\\n\'')).toContain('string.quoted.single.rust')
  })

  it('does not let the lifetime run past the code after it', () => {
    const after = scoped(rust, `struct Excerpt<'a> { part: &'a str }`)

    expect(after.some(([text, scopes]) => text === 'str' && scopes.includes('storage.type.rust'))).toBe(true)
  })

  it('leaves a language that does quote with single quotes alone', () => {
    const ts = new Tokenizer(typescriptGrammar)

    expect(scopesOf(ts, `const a = 'hello'`, `'hello'`)).toContain('string')
  })
})

describe('a punctuation character the grammar does want', () => {
  const csharp = new Tokenizer(csharpGrammar)

  it('opens the attribute rule that was already in the grammar', () => {
    const found = scoped(csharp, `[Serializable]`).filter(([, scopes]) => scopes.includes('attribute'))

    expect(found.length).toBeGreaterThan(0)
    expect(found.map(([text]) => text)).toContain('Serializable')
  })

  it('reads an attribute with arguments', () => {
    const found = scoped(csharp, `[Obsolete("Use NewMethod instead")]`)
      .filter(([, scopes]) => scopes.includes('attribute'))

    expect(found.map(([text]) => text)).toContain('Obsolete')
  })

  it('leaves punctuation no rule claims to the fast path', () => {
    const ts = new Tokenizer(typescriptGrammar)
    const braces = scoped(ts, `function f() { return 1 }`).filter(([text]) => text === '{' || text === '}')

    expect(braces.length).toBe(2)
    expect(braces.every(([, scopes]) => scopes === 'source.ts')).toBe(true)
  })
})

describe('a word decided by the character after it', () => {
  it('reads a rust macro invocation, with the bang', () => {
    const rust = new Tokenizer(rustGrammar)
    const found = scoped(rust, `println!("hi");\nvec![1, 2];\nassert_eq!(x, y);`)
      .filter(([, scopes]) => scopes.includes('macro'))

    expect(found.map(([text]) => text)).toEqual(['println!', 'vec!', 'assert_eq!'])
  })

  it('does not read a not-equals as a macro', () => {
    const rust = new Tokenizer(rustGrammar)

    expect(scoped(rust, `if a != b { }`).some(([, scopes]) => scopes.includes('macro'))).toBe(false)
  })

  it('reads a yaml key', () => {
    const yaml = new Tokenizer(yamlGrammar)
    const found = scoped(yaml, `name: John\nage: 30`).filter(([, scopes]) => scopes.includes('entity.name.tag'))

    expect(found.map(([text]) => text)).toEqual(['name', 'age'])
  })

  it('does not read a URL scheme as a yaml key', () => {
    const yaml = new Tokenizer(yamlGrammar)
    const found = scoped(yaml, `image: https://example.dev/thing`).filter(([, scopes]) => scopes.includes('entity.name.tag'))

    expect(found.map(([text]) => text)).toEqual(['image'])
  })
})

describe('the property none of this may break', () => {
  const cases: Array<[Tokenizer, string]> = [
    [new Tokenizer(rustGrammar), `fn longest<'a>(x: &'a str) -> &'a str { let c = 'x'; println!("{}", c); x }`],
    [new Tokenizer(csharpGrammar), `[Obsolete("x")] public class C { int[] a = new int[4]; }`],
    [new Tokenizer(yamlGrammar), `image: https://example.dev/x\nname: John\n  nested: true`],
  ]

  it.each(cases)('concatenated token contents equal the line', (tokenizer, code) => {
    const source = code.split('\n')
    const lines = tokenizer.tokenize(code)

    expect(lines.length).toBe(source.length)

    lines.forEach((line: TokenLine, index: number) => {
      expect(line.tokens.map((token: Token) => token.content).join('')).toBe(source[index]!)
    })
  })
})
