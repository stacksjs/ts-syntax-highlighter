import type { Grammar } from '../types'

export const jsonGrammar: Grammar = {
  name: 'JSON',
  scopeName: 'source.json',
  patterns: [
    { include: '#value' },
  ],
  repository: {
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
          match: '-?(0|[1-9]\\d*)(\\.\\d+)?([eE][+-]?\\d+)?',
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
              match: '\\\\(["\\\\\/bfnrt]|u[0-9a-fA-F]{4})',
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
          beginCaptures: {
            '0': { name: 'punctuation.definition.array.begin.json' },
          },
          end: '\\]',
          endCaptures: {
            '0': { name: 'punctuation.definition.array.end.json' },
          },
          patterns: [
            { include: '#value' },
            {
              name: 'punctuation.separator.array.json',
              match: ',',
            },
          ],
        },
      ],
    },
    object: {
      patterns: [
        {
          name: 'meta.structure.dictionary.json',
          begin: '\\{',
          beginCaptures: {
            '0': { name: 'punctuation.definition.dictionary.begin.json' },
          },
          end: '\\}',
          endCaptures: {
            '0': { name: 'punctuation.definition.dictionary.end.json' },
          },
          patterns: [
            {
              name: 'meta.structure.dictionary.key.json',
              begin: '"',
              beginCaptures: {
                '0': { name: 'punctuation.support.type.property-name.begin.json' },
              },
              end: '"',
              endCaptures: {
                '0': { name: 'punctuation.support.type.property-name.end.json' },
              },
              patterns: [
                {
                  name: 'constant.character.escape.json',
                  match: '\\\\(["\\\\\/bfnrt]|u[0-9a-fA-F]{4})',
                },
              ],
            },
            {
              name: 'punctuation.separator.dictionary.key-value.json',
              match: ':',
            },
            {
              name: 'punctuation.separator.dictionary.pair.json',
              match: ',',
            },
            { include: '#value' },
          ],
        },
      ],
    },
  },
}
