import type { Grammar } from '../types'

export const tomlGrammar: Grammar = {
  name: 'TOML',
  scopeName: 'source.toml',
  keywords: {
    'true': 'constant.language.toml',
    'false': 'constant.language.toml',
  },
  patterns: [
    { include: '#comments' },
    { include: '#tables' },
    { include: '#keys' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#dates' },
    { include: '#booleans' },
  ],
  repository: {
    comments: {
      patterns: [
        { name: 'comment.line.number-sign.toml', match: '#.*$' },
      ],
    },
    tables: {
      patterns: [
        { name: 'entity.name.section.toml', match: '^\\[\\[?[a-zA-Z0-9._-]+\\]\\]?' },
      ],
    },
    keys: {
      patterns: [
        { name: 'variable.other.key.toml', match: '^[a-zA-Z0-9_-]+(?=\\s*=)' },
      ],
    },
    strings: {
      patterns: [
        { name: 'string.quoted.triple.toml', begin: '"""', end: '"""' },
        { name: 'string.quoted.triple.toml', begin: "'''", end: "'''" },
        { name: 'string.quoted.double.toml', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.toml', match: '\\\\.' }] },
        { name: 'string.quoted.single.toml', begin: "'", end: "'" },
      ],
    },
    numbers: {
      patterns: [
        { name: 'constant.numeric.toml', match: '\\b[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b' },
        { name: 'constant.numeric.toml', match: '\\b0[xX][0-9a-fA-F]+\\b' },
        { name: 'constant.numeric.toml', match: '\\b0[oO][0-7]+\\b' },
        { name: 'constant.numeric.toml', match: '\\b0[bB][01]+\\b' },
      ],
    },
    dates: {
      patterns: [
        { name: 'constant.other.date.toml', match: '\\d{4}-\\d{2}-\\d{2}(?:T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})?)?' },
      ],
    },
    booleans: {
      patterns: [
        { name: 'constant.language.toml', match: '\\b(true|false)\\b' },
      ],
    },
  },
}
