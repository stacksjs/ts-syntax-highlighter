import type { Grammar, GrammarPattern, GrammarRule } from './types'

/**
 * TextMate grammar format for VSCode extensions
 */
export interface TextMateGrammar {
  $schema?: string
  name: string
  scopeName: string
  patterns: TextMatePattern[]
  repository?: Record<string, TextMateRule>
}

export interface TextMatePattern {
  match?: string
  begin?: string
  end?: string
  name?: string
  contentName?: string
  captures?: Record<string, { name: string }>
  beginCaptures?: Record<string, { name: string }>
  endCaptures?: Record<string, { name: string }>
  patterns?: TextMatePattern[]
  include?: string
}

export interface TextMateRule {
  name?: string
  match?: string
  begin?: string
  end?: string
  patterns?: TextMatePattern[]
  captures?: Record<string, { name: string }>
  beginCaptures?: Record<string, { name: string }>
  endCaptures?: Record<string, { name: string }>
  contentName?: string
}

/**
 * Converts a GrammarPattern to TextMate format
 */
function convertPattern(pattern: GrammarPattern): TextMatePattern {
  const result: TextMatePattern = {}

  if (pattern.match) result.match = pattern.match
  if (pattern.begin) result.begin = pattern.begin
  if (pattern.end) result.end = pattern.end
  if (pattern.name) result.name = pattern.name
  if (pattern.contentName) result.contentName = pattern.contentName
  if (pattern.captures) result.captures = pattern.captures
  if (pattern.beginCaptures) result.beginCaptures = pattern.beginCaptures
  if (pattern.endCaptures) result.endCaptures = pattern.endCaptures
  if (pattern.include) result.include = pattern.include
  if (pattern.patterns) {
    result.patterns = pattern.patterns.map(convertPattern)
  }

  return result
}

/**
 * Converts a GrammarRule to TextMate format
 */
function convertRule(rule: GrammarRule): TextMateRule {
  const result: TextMateRule = {}

  if (rule.name) result.name = rule.name
  if (rule.match) result.match = rule.match
  if (rule.begin) result.begin = rule.begin
  if (rule.end) result.end = rule.end
  if (rule.contentName) result.contentName = rule.contentName
  if (rule.captures) result.captures = rule.captures
  if (rule.beginCaptures) result.beginCaptures = rule.beginCaptures
  if (rule.endCaptures) result.endCaptures = rule.endCaptures
  if (rule.patterns) {
    result.patterns = rule.patterns.map(convertPattern)
  }

  return result
}

/**
 * Exports a Grammar to TextMate JSON format
 *
 * @example
 * ```ts
 * import { stxGrammar } from './grammars/stx'
 * import { exportToTextMate } from './export-textmate'
 *
 * const tmGrammar = exportToTextMate(stxGrammar)
 * await Bun.write('stx.tmLanguage.json', JSON.stringify(tmGrammar, null, 2))
 * ```
 */
export function exportToTextMate(grammar: Grammar): TextMateGrammar {
  const result: TextMateGrammar = {
    $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
    name: grammar.name,
    scopeName: grammar.scopeName,
    patterns: grammar.patterns.map(convertPattern),
  }

  if (grammar.repository) {
    result.repository = {}
    for (const [key, rule] of Object.entries(grammar.repository)) {
      result.repository[key] = convertRule(rule)
    }
  }

  return result
}

/**
 * Exports a Grammar to TextMate JSON string
 */
export function exportToTextMateString(grammar: Grammar, pretty = true): string {
  const tmGrammar = exportToTextMate(grammar)
  return pretty ? JSON.stringify(tmGrammar, null, 2) : JSON.stringify(tmGrammar)
}
