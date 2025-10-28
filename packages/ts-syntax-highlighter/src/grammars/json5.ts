import type { Grammar } from '../types'

export const json5Grammar: Grammar = {
  name: 'JSON5',
  scopeName: 'source.json5',
  keywords: {
    true: 'constant.language.json5',
    false: 'constant.language.json5',
    null: 'constant.language.json5',
    Infinity: 'constant.language.json5',
    NaN: 'constant.language.json5',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#constants' },
    { include: '#keys' },
  ],
  repository: {
    comments: {
      patterns: [
        { name: 'comment.line.double-slash.json5', match: '\\/\\/.*$' },
        { name: 'comment.block.json5', begin: '\\/\\*', end: '\\*\\/' },
      ],
    },
    strings: {
      patterns: [
        { name: 'string.quoted.single.json5', begin: '\'', end: '\'', patterns: [{ name: 'constant.character.escape.json5', match: '\\\\.' }] },
        { name: 'string.quoted.double.json5', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.json5', match: '\\\\.' }] },
      ],
    },
    numbers: {
      patterns: [
        { name: 'constant.numeric.json5', match: '\\b(?:0[xX][0-9a-fA-F]+|[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][+-]?\\d+)?)\\b' },
      ],
    },
    constants: {
      patterns: [
        { name: 'constant.language.json5', match: '\\b(true|false|null|Infinity|NaN)\\b' },
      ],
    },
    keys: {
      patterns: [
        { name: 'support.type.property-name.json5', match: '\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\s*(?=:)' },
        { name: 'support.type.property-name.json5', begin: '"', end: '"(?=\\s*:)' },
        { name: 'support.type.property-name.json5', begin: '\'', end: '\'(?=\\s*:)' },
      ],
    },
  },
}
