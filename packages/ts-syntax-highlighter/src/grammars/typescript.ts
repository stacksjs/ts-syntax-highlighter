import type { Grammar } from '../types'

export const typescriptGrammar: Grammar = {
  name: 'TypeScript',
  scopeName: 'source.ts',
  keywords: {
    // Control keywords
    'if': 'keyword.control.ts',
    'else': 'keyword.control.ts',
    'switch': 'keyword.control.ts',
    'case': 'keyword.control.ts',
    'default': 'keyword.control.ts',
    'for': 'keyword.control.ts',
    'while': 'keyword.control.ts',
    'do': 'keyword.control.ts',
    'break': 'keyword.control.ts',
    'continue': 'keyword.control.ts',
    'return': 'keyword.control.ts',
    'try': 'keyword.control.ts',
    'catch': 'keyword.control.ts',
    'finally': 'keyword.control.ts',
    'throw': 'keyword.control.ts',
    'async': 'keyword.control.ts',
    'await': 'keyword.control.ts',
    // Storage types
    'const': 'storage.type.ts',
    'let': 'storage.type.ts',
    'var': 'storage.type.ts',
    'function': 'storage.type.ts',
    'class': 'storage.type.ts',
    'extends': 'storage.type.ts',
    'implements': 'storage.type.ts',
    'static': 'storage.type.ts',
    'type': 'storage.type.ts',
    'interface': 'storage.type.ts',
    'enum': 'storage.type.ts',
    'namespace': 'storage.type.ts',
    'module': 'storage.type.ts',
    'declare': 'storage.type.ts',
    'public': 'storage.type.ts',
    'private': 'storage.type.ts',
    'protected': 'storage.type.ts',
    'readonly': 'storage.type.ts',
    'abstract': 'storage.type.ts',
    // Built-in types
    'string': 'storage.type.ts',
    'number': 'storage.type.ts',
    'boolean': 'storage.type.ts',
    'any': 'storage.type.ts',
    'void': 'storage.type.ts',
    'never': 'storage.type.ts',
    'unknown': 'storage.type.ts',
    'object': 'storage.type.ts',
    'symbol': 'storage.type.ts',
    'bigint': 'storage.type.ts',
    // Operators
    'new': 'keyword.operator.new.ts',
    'delete': 'keyword.operator.new.ts',
    'typeof': 'keyword.operator.new.ts',
    'instanceof': 'keyword.operator.new.ts',
    'as': 'keyword.operator.new.ts',
    // Constants
    'true': 'constant.language.ts',
    'false': 'constant.language.ts',
    'null': 'constant.language.ts',
    'undefined': 'constant.language.ts',
    'NaN': 'constant.language.ts',
    'Infinity': 'constant.language.ts',
    'this': 'constant.language.ts',
    'super': 'constant.language.ts',
    // Module keywords
    'import': 'keyword.other.ts',
    'export': 'keyword.other.ts',
    'from': 'keyword.other.ts',
  },
  patterns: [
    { include: '#comments' },     // Must be before operators (// vs /)
    { include: '#strings' },      // Must be before operators
    { include: '#keywords' },     // Very common - prioritize
    { include: '#numbers' },      // Common
    { include: '#functions' },    // Common
    { include: '#types' },
    { include: '#operators' },
    { include: '#punctuation' },  // Handled by fast path
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
