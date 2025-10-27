import type { Grammar } from '../types'

export const rubyGrammar: Grammar = {
  name: 'Ruby',
  scopeName: 'source.ruby',
  keywords: {
    'if': 'keyword.control.ruby',
    'elsif': 'keyword.control.ruby',
    'else': 'keyword.control.ruby',
    'unless': 'keyword.control.ruby',
    'case': 'keyword.control.ruby',
    'when': 'keyword.control.ruby',
    'while': 'keyword.control.ruby',
    'until': 'keyword.control.ruby',
    'for': 'keyword.control.ruby',
    'break': 'keyword.control.ruby',
    'next': 'keyword.control.ruby',
    'redo': 'keyword.control.ruby',
    'retry': 'keyword.control.ruby',
    'return': 'keyword.control.ruby',
    'yield': 'keyword.control.ruby',
    'begin': 'keyword.control.ruby',
    'rescue': 'keyword.control.ruby',
    'ensure': 'keyword.control.ruby',
    'raise': 'keyword.control.ruby',
    'end': 'keyword.control.ruby',
    'then': 'keyword.control.ruby',
    'do': 'keyword.control.ruby',
    'def': 'keyword.control.ruby',
    'class': 'keyword.control.ruby',
    'module': 'keyword.control.ruby',
    'include': 'keyword.other.ruby',
    'extend': 'keyword.other.ruby',
    'require': 'keyword.other.ruby',
    'require_relative': 'keyword.other.ruby',
    'load': 'keyword.other.ruby',
    'alias': 'keyword.other.ruby',
    'undef': 'keyword.other.ruby',
    'defined?': 'keyword.other.ruby',
    'super': 'variable.language.ruby',
    'self': 'variable.language.ruby',
    'true': 'constant.language.ruby',
    'false': 'constant.language.ruby',
    'nil': 'constant.language.ruby',
    '__FILE__': 'constant.language.ruby',
    '__LINE__': 'constant.language.ruby',
    '__ENCODING__': 'constant.language.ruby',
    'and': 'keyword.operator.logical.ruby',
    'or': 'keyword.operator.logical.ruby',
    'not': 'keyword.operator.logical.ruby',
    'private': 'keyword.other.ruby',
    'protected': 'keyword.other.ruby',
    'public': 'keyword.other.ruby',
    'attr_reader': 'keyword.other.ruby',
    'attr_writer': 'keyword.other.ruby',
    'attr_accessor': 'keyword.other.ruby',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#symbols' },
    { include: '#regex' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#functions' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.number-sign.ruby',
          match: '#.*$',
        },
        {
          name: 'comment.block.ruby',
          begin: '^=begin',
          end: '^=end',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.ruby',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.ruby',
              match: '\\\\.',
            },
            {
              name: 'meta.interpolation.ruby',
              begin: '#\\{',
              end: '\\}',
              patterns: [
                { include: '$self' },
              ],
            },
          ],
        },
        {
          name: 'string.quoted.single.ruby',
          begin: "'",
          end: "'",
          patterns: [
            {
              name: 'constant.character.escape.ruby',
              match: "\\\\['\\\\]",
            },
          ],
        },
        {
          name: 'string.quoted.other.ruby',
          begin: '%[qQ]?[{(\\[]',
          end: '[})\\]]',
        },
      ],
    },
    symbols: {
      patterns: [
        {
          name: 'constant.other.symbol.ruby',
          match: ':[a-zA-Z_][a-zA-Z0-9_]*[?!]?',
        },
        {
          name: 'constant.other.symbol.ruby',
          match: ':"[^"]*"',
        },
      ],
    },
    regex: {
      patterns: [
        {
          name: 'string.regexp.ruby',
          begin: '/',
          end: '/[iomxneus]*',
          patterns: [
            {
              name: 'constant.character.escape.ruby',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.ruby',
          match: '\\b(if|elsif|else|unless|case|when|while|until|for|break|next|redo|retry|return|yield|begin|rescue|ensure|raise|end|then|do|def|class|module)\\b',
        },
        {
          name: 'keyword.other.ruby',
          match: '\\b(include|extend|require|require_relative|load|alias|undef|defined\\?|private|protected|public|attr_reader|attr_writer|attr_accessor)\\b',
        },
        {
          name: 'constant.language.ruby',
          match: '\\b(true|false|nil|__FILE__|__LINE__|__ENCODING__)\\b',
        },
        {
          name: 'variable.language.ruby',
          match: '\\b(self|super)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.ruby',
          match: '\\b(?:0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.ruby',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*[?!]?)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.ruby',
          match: '(=>|\\+|\\-|\\*|/|%|\\*\\*|==|!=|<|>|<=|>=|<=>|===|=~|!~|&&|\\|\\||!|&|\\||\\^|~|<<|>>|\\.\\.|\\.\\.\\.)',
        },
      ],
    },
  },
}
