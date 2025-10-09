import type { Grammar } from '../types'

export const typescriptGrammar: Grammar = {
  name: 'TypeScript',
  scopeName: 'source.ts',
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#types' },
    { include: '#keywords' },
    { include: '#functions' },
    { include: '#operators' },
    { include: '#punctuation' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.ts',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.ts',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.ts',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.ts',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.ts',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.ts',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.template.ts',
          begin: '`',
          end: '`',
          patterns: [
            {
              name: 'meta.template.expression.ts',
              begin: '\\$\\{',
              end: '\\}',
              patterns: [
                { include: '$self' },
              ],
            },
            {
              name: 'constant.character.escape.ts',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.ts',
          match: '\\b(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\\d+(\\.\\d+)?([eE][+-]?\\d+)?)\\b',
        },
      ],
    },
    types: {
      patterns: [
        {
          name: 'storage.type.ts',
          match: '\\b(string|number|boolean|any|void|never|unknown|object|symbol|bigint)\\b',
        },
        {
          name: 'entity.name.type.ts',
          match: ':\\s*([A-Z][a-zA-Z0-9_]*)',
        },
        {
          name: 'meta.type.annotation.ts',
          match: '<[^>]+>',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.ts',
          match: '\\b(if|else|switch|case|default|for|while|do|break|continue|return|try|catch|finally|throw|async|await)\\b',
        },
        {
          name: 'storage.type.ts',
          match: '\\b(const|let|var|function|class|extends|implements|static|async|type|interface|enum|namespace|module|declare|public|private|protected|readonly|abstract)\\b',
        },
        {
          name: 'keyword.operator.new.ts',
          match: '\\b(new|delete|typeof|instanceof|void|as)\\b',
        },
        {
          name: 'constant.language.ts',
          match: '\\b(true|false|null|undefined|NaN|Infinity|this|super)\\b',
        },
        {
          name: 'keyword.other.ts',
          match: '\\b(import|export|from|default)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.ts',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.ts',
          match: '(\\+\\+|--|\\+|\\-|\\*|\\/|%|===|==|!==|!=|<=|>=|<|>|&&|\\|\\||!|\\?|:|=>|\\.\\.\\.|&|\\||\\^|~|<<|>>|>>>)',
        },
      ],
    },
    punctuation: {
      patterns: [
        {
          name: 'punctuation.ts',
          match: '[{}()\\[\\];,.]',
        },
      ],
    },
  },
}
