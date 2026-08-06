/**
 * `$VAR`, in the five languages that are full of it.
 *
 * Bash, PHP, PowerShell, SCSS and Dockerfile all use `$` as a variable sigil,
 * and in every one of them it used to tokenize as plain text - so a shell
 * script, a Blade template and a stylesheet of variables all rendered with the
 * one thing a reader is scanning for uncoloured. Five languages that turn up in
 * real pull requests constantly.
 */

import { describe, expect, it } from 'bun:test'
import { createHighlighter } from '../src/highlighter'

const highlighter = await createHighlighter({})

function typesOf(code: string, language: string): string[] {
  return highlighter.highlightFast(code, language)
    .flatMap(line => line.tokens.map(token => `${token.type}:${token.content}`))
}

/** The property everything in this library rests on. */
function reproduces(code: string, language: string): boolean {
  return highlighter.highlightFast(code, language)
    .map(line => line.tokens.map(token => token.content).join(''))
    .join('\n') === code
}

describe('dollar variables', () => {
  const cases: Array<[string, string, string]> = [
    ['bash', 'echo $HOME', 'variable:$HOME'],
    ['bash', 'echo ${PATH}', 'variable:${PATH}'],
    ['php', '$name = 1;', 'variable:$name'],
    ['powershell', 'Write-Host $path', 'variable:$path'],
    ['scss', '$primary: #333;', 'variable:$primary'],
    ['dockerfile', 'RUN echo $VERSION', 'variable:$VERSION'],
  ]

  for (const [language, code, expected] of cases) {
    it(`marks one in ${language}`, () => {
      expect(typesOf(code, language)).toContain(expected)
    })
  }

  /** PowerShell alone scopes a variable with a colon. */
  it('keeps a PowerShell scope with its variable', () => {
    expect(typesOf('$env:HOME', 'powershell')).toContain('variable:$env:HOME')
  })

  /**
   * `$` is a legal identifier character in JavaScript and TypeScript, so `$foo`
   * there is a name rather than a variable reference. Calling it one would be a
   * claim the language does not make.
   */
  it('leaves JavaScript and TypeScript alone, where $ is part of a name', () => {
    expect(typesOf('const $foo = 1', 'typescript')).not.toContain('variable:$foo')
    expect(typesOf('const $ = 1', 'javascript')).not.toContain('variable:$')
  })

  it('a bare dollar is a dollar sign, not a variable with no name', () => {
    expect(typesOf('echo $ 5', 'bash')).toContain('text:$')
  })

  it('an unterminated ${ does not run past the end of the line', () => {
    expect(reproduces('echo ${OPEN', 'bash')).toBe(true)
  })

  /**
   * The one property the whole library rests on. A tokenizer that drops a
   * character is showing code the file does not contain, and in a diff the
   * whitespace is often the entire change.
   */
  it('reproduces every line exactly, in every one of them', () => {
    const sources: Array<[string, string]> = [
      ['bash', 'export PATH="$HOME/bin:${PATH}"\nrun --flag=$1 "$@"'],
      ['php', '<?php\n$user = $repo->find($id);'],
      ['powershell', '$ErrorActionPreference = "Stop"\nWrite-Host "$env:HOME"'],
      ['scss', '$a: 1px;\n.b { margin: $a $a; }'],
      ['dockerfile', 'ARG V=1\nRUN echo "$V ${V}" && exit $?'],
    ]

    for (const [language, code] of sources)
      expect(reproduces(code, language)).toBe(true)
  })
})
