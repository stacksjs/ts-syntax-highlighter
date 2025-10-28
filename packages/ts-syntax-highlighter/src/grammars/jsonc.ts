import type { Grammar } from '../types'

export const jsoncGrammar: Grammar = {
  name: 'JSONC',
  scopeName: 'source.jsonc',
  keywords: {
    true: 'constant.language.json',
    false: 'constant.language.json',
    null: 'constant.language.json',
  },
  patterns: [
    { include: '#comments' },
    { include: '#value' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.jsonc',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.jsonc',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    value: {
      patterns: [
        { include: '#constant' },
        { include: '#number' },
        { include: '#string' },
        { include: '#array' },
        { include: '#object' },
      ],
    },
    constant: {
      patterns: [
        {
          name: 'constant.language.json',
          match: '\\b(true|false|null)\\b',
        },
      ],
    },
    number: {
      patterns: [
        {
          name: 'constant.numeric.json',
          match: '-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?',
        },
      ],
    },
    string: {
      patterns: [
        {
          name: 'string.quoted.double.json',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.json',
              match: '\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})',
            },
            {
              name: 'invalid.illegal.unrecognized-string-escape.json',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    array: {
      patterns: [
        {
          name: 'meta.structure.array.json',
          begin: '\\[',
          end: '\\]',
          patterns: [
            { include: '#value' },
            { include: '#comments' },
          ],
        },
      ],
    },
    object: {
      patterns: [
        {
          name: 'meta.structure.dictionary.json',
          begin: '\\{',
          end: '\\}',
          patterns: [
            { include: '#comments' },
            { include: '#objectkey' },
            { include: '#value' },
          ],
        },
      ],
    },
    objectkey: {
      patterns: [
        {
          name: 'support.type.property-name.json',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.json',
              match: '\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})',
            },
          ],
        },
      ],
    },
  },
}
