import type { Grammar } from '../types'

export const javascriptGrammar: Grammar = {
  name: 'JavaScript',
  scopeName: 'source.js',
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#keywords' },
    { include: '#functions' },
    { include: '#operators' },
    { include: '#punctuation' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.js',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.js',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.js',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.js',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.js',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.js',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.template.js',
          begin: '`',
          end: '`',
          patterns: [
            {
              name: 'meta.template.expression.js',
              begin: '\\$\\{',
              end: '\\}',
              patterns: [
                { include: '$self' },
              ],
            },
            {
              name: 'constant.character.escape.js',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.js',
          match: '\\b(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\\d+(\\.\\d+)?([eE][+-]?\\d+)?)\\b',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.js',
          match: '\\b(if|else|switch|case|default|for|while|do|break|continue|return|try|catch|finally|throw|async|await)\\b',
        },
        {
          name: 'storage.type.js',
          match: '\\b(const|let|var|function|class|extends|static|async)\\b',
        },
        {
          name: 'keyword.operator.new.js',
          match: '\\b(new|delete|typeof|instanceof|void)\\b',
        },
        {
          name: 'constant.language.js',
          match: '\\b(true|false|null|undefined|NaN|Infinity)\\b',
        },
        {
          name: 'keyword.other.js',
          match: '\\b(import|export|from|as|default)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.js',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.js',
          match: '(\\+\\+|--|\\+|\\-|\\*|\\/|%|===|==|!==|!=|<=|>=|<|>|&&|\\|\\||!|\\?|:|=>|\\.\\.\\.|&|\\||\\^|~|<<|>>|>>>)',
        },
      ],
    },
    punctuation: {
      patterns: [
        {
          name: 'punctuation.js',
          match: '[{}()\\[\\];,.]',
        },
      ],
    },
  },
}
