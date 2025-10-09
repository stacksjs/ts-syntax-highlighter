import type { Grammar } from '../types'

export const javascriptGrammar: Grammar = {
  name: 'JavaScript',
  scopeName: 'source.js',
  keywords: {
    // Control keywords
    'if': 'keyword.control.js',
    'else': 'keyword.control.js',
    'switch': 'keyword.control.js',
    'case': 'keyword.control.js',
    'default': 'keyword.control.js',
    'for': 'keyword.control.js',
    'while': 'keyword.control.js',
    'do': 'keyword.control.js',
    'break': 'keyword.control.js',
    'continue': 'keyword.control.js',
    'return': 'keyword.control.js',
    'try': 'keyword.control.js',
    'catch': 'keyword.control.js',
    'finally': 'keyword.control.js',
    'throw': 'keyword.control.js',
    'async': 'keyword.control.js',
    'await': 'keyword.control.js',
    'yield': 'keyword.control.js',
    // Storage types
    'const': 'storage.type.js',
    'let': 'storage.type.js',
    'var': 'storage.type.js',
    'function': 'storage.type.js',
    'class': 'storage.type.js',
    'extends': 'storage.type.js',
    'static': 'storage.type.js',
    'get': 'storage.type.js',
    'set': 'storage.type.js',
    // Operators
    'new': 'keyword.operator.new.js',
    'delete': 'keyword.operator.new.js',
    'typeof': 'keyword.operator.new.js',
    'instanceof': 'keyword.operator.new.js',
    'void': 'keyword.operator.new.js',
    'in': 'keyword.operator.new.js',
    'of': 'keyword.operator.new.js',
    // Constants
    'true': 'constant.language.js',
    'false': 'constant.language.js',
    'null': 'constant.language.js',
    'undefined': 'constant.language.js',
    'NaN': 'constant.language.js',
    'Infinity': 'constant.language.js',
    'this': 'constant.language.js',
    'super': 'constant.language.js',
    'arguments': 'constant.language.js',
    // Module keywords
    'import': 'keyword.other.js',
    'export': 'keyword.other.js',
    'from': 'keyword.other.js',
    'as': 'keyword.other.js',
    'with': 'keyword.other.js',
    'debugger': 'keyword.other.js',
  },
  patterns: [
    { include: '#comments' },     // Must be before operators (// vs /)
    { include: '#strings' },      // Must be before operators
    { include: '#jsx' },          // JSX elements
    { include: '#regex' },        // Must be before operators (/ vs /)
    { include: '#keywords' },     // Very common - prioritize
    { include: '#numbers' },      // Common
    { include: '#functions' },    // Common
    { include: '#operators' },
    { include: '#punctuation' },  // Handled by fast path
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
    jsx: {
      patterns: [
        {
          name: 'meta.tag.jsx',
          begin: '<([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9-]*)',
          beginCaptures: {
            '0': { name: 'punctuation.definition.tag.begin.jsx' },
            '1': { name: 'entity.name.tag.jsx' },
          },
          end: '(/?>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.end.jsx' },
          },
          patterns: [
            {
              name: 'entity.other.attribute-name.jsx',
              match: '[a-zA-Z_:][a-zA-Z0-9_:.-]*',
            },
            {
              name: 'meta.embedded.expression.jsx',
              begin: '\\{',
              end: '\\}',
              patterns: [
                { include: '$self' },
              ],
            },
            {
              name: 'string.quoted.double.jsx',
              begin: '"',
              end: '"',
            },
            {
              name: 'string.quoted.single.jsx',
              begin: '\'',
              end: '\'',
            },
          ],
        },
        {
          name: 'meta.tag.jsx',
          begin: '(</)([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9-]*)',
          beginCaptures: {
            '1': { name: 'punctuation.definition.tag.begin.jsx' },
            '2': { name: 'entity.name.tag.jsx' },
          },
          end: '(>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.end.jsx' },
          },
        },
      ],
    },
    regex: {
      patterns: [
        {
          name: 'string.regexp.js',
          begin: '(?<=[=(,\\[!&|?{};:])\\s*(\\/)',
          beginCaptures: {
            '1': { name: 'punctuation.definition.string.begin.js' },
          },
          end: '(\\/)[gimsuvy]*',
          endCaptures: {
            '1': { name: 'punctuation.definition.string.end.js' },
          },
          patterns: [
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
          match: '\\b(0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\\d+(_\\d+)*(\\.\\d+(_\\d+)?)?([eE][+-]?\\d+)?)[nN]?\\b',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.js',
          match: '\\b(if|else|switch|case|default|for|while|do|break|continue|return|try|catch|finally|throw|async|await|yield)\\b',
        },
        {
          name: 'storage.type.js',
          match: '\\b(const|let|var|function|class|extends|static|async|get|set)\\b',
        },
        {
          name: 'keyword.operator.new.js',
          match: '\\b(new|delete|typeof|instanceof|void|in|of)\\b',
        },
        {
          name: 'constant.language.js',
          match: '\\b(true|false|null|undefined|NaN|Infinity|this|super|arguments)\\b',
        },
        {
          name: 'keyword.other.js',
          match: '\\b(import|export|from|as|default|with|debugger)\\b',
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
