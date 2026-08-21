/**
 * The capture groups a grammar names, and the two that were read by nothing.
 *
 * `captures: { 0: { name } }` is how a TextMate grammar names the whole match,
 * and it is what a rule with nothing to subdivide writes. It was skipped - and
 * skipping it did not fall back to the pattern's own name either, because the
 * capture path had already been entered: the loop found nothing to emit, the
 * tail emitted the match as plain text under the *outer* scopes, and that was
 * the token the reader got. `<?php` came back carrying `source.php` and nothing
 * else, from a grammar that names it twice.
 *
 * `endCaptures` was read by nothing at all, which is the same fault at the
 * other end of a begin/end rule.
 *
 * Both are worth a test rather than a fix alone, because the symptom is a
 * missing colour on a token that is otherwise perfectly correct, which is the
 * kind of wrong nobody reports.
 */

import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { phpGrammar } from '../src/grammars/php'
import { Tokenizer } from '../src/tokenizer'

function scopesOf(code: string, content: string): string[] {
  return new Tokenizer(phpGrammar).tokenize(code)
    .flatMap((line: TokenLine) => line.tokens)
    .filter((token: Token) => token.content === content)
    .flatMap((token: Token) => token.scopes)
}

describe('a capture group named 0', () => {
  it('names the opening tag of a php block', () => {
    expect(scopesOf('<?php\n$a = 1;\n?>', '<?php')).toContain('punctuation.section.embedded.begin.php')
  })

  it('names the closing tag too, which is endCaptures', () => {
    expect(scopesOf('<?php\n$a = 1;\n?>', '?>')).toContain('punctuation.section.embedded.end.php')
  })

  it('leaves the block between them scoped as the block', () => {
    expect(scopesOf('<?php\n$a = 1;\n?>', '$a')).toEqual([
      'source.php',
      'meta.embedded.block.php',
      'variable.other.php',
    ])
  })

  it('keeps the line exactly, which is the property all of this sits on', () => {
    const code = '<?php\n$a = 1;\n?>'
    const source = code.split('\n')

    new Tokenizer(phpGrammar).tokenize(code).forEach((line: TokenLine, index: number) => {
      expect(line.tokens.map((token: Token) => token.content).join('')).toBe(source[index]!)
    })
  })
})
