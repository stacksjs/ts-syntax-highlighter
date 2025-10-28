import type { Grammar } from '../types'

export const javaGrammar: Grammar = {
  name: 'Java',
  scopeName: 'source.java',
  keywords: {
    // Control flow
    'if': 'keyword.control.java',
    'else': 'keyword.control.java',
    'for': 'keyword.control.java',
    'while': 'keyword.control.java',
    'do': 'keyword.control.java',
    'switch': 'keyword.control.java',
    'case': 'keyword.control.java',
    'default': 'keyword.control.java',
    'break': 'keyword.control.java',
    'continue': 'keyword.control.java',
    'return': 'keyword.control.java',
    'try': 'keyword.control.java',
    'catch': 'keyword.control.java',
    'finally': 'keyword.control.java',
    'throw': 'keyword.control.java',
    'throws': 'keyword.control.java',
    'assert': 'keyword.control.java',
    // Types
    'class': 'storage.type.java',
    'interface': 'storage.type.java',
    'enum': 'storage.type.java',
    'record': 'storage.type.java',
    'void': 'storage.type.java',
    'boolean': 'storage.type.primitive.java',
    'byte': 'storage.type.primitive.java',
    'char': 'storage.type.primitive.java',
    'short': 'storage.type.primitive.java',
    'int': 'storage.type.primitive.java',
    'long': 'storage.type.primitive.java',
    'float': 'storage.type.primitive.java',
    'double': 'storage.type.primitive.java',
    // Modifiers
    'public': 'storage.modifier.java',
    'private': 'storage.modifier.java',
    'protected': 'storage.modifier.java',
    'static': 'storage.modifier.java',
    'final': 'storage.modifier.java',
    'abstract': 'storage.modifier.java',
    'native': 'storage.modifier.java',
    'synchronized': 'storage.modifier.java',
    'transient': 'storage.modifier.java',
    'volatile': 'storage.modifier.java',
    'strictfp': 'storage.modifier.java',
    'sealed': 'storage.modifier.java',
    'non-sealed': 'storage.modifier.java',
    // Constants
    'true': 'constant.language.java',
    'false': 'constant.language.java',
    'null': 'constant.language.java',
    'this': 'variable.language.java',
    'super': 'variable.language.java',
    // Other keywords
    'package': 'keyword.other.package.java',
    'import': 'keyword.other.import.java',
    'extends': 'keyword.other.extends.java',
    'implements': 'keyword.other.implements.java',
    'new': 'keyword.operator.new.java',
    'instanceof': 'keyword.operator.instanceof.java',
    'var': 'storage.type.java',
  },
  patterns: [
    { include: '#comments' },
    { include: '#annotations' },
    { include: '#strings' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#functions' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.java',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.documentation.java',
          begin: '\\/\\*\\*',
          end: '\\*\\/',
          patterns: [
            {
              name: 'keyword.other.documentation.java',
              match: '@(?:param|return|throws|author|version|see|since|deprecated)\\b',
            },
          ],
        },
        {
          name: 'comment.block.java',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    annotations: {
      patterns: [
        {
          name: 'storage.type.annotation.java',
          match: '@[A-Z][a-zA-Z0-9]*',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.triple.java',
          begin: '"""',
          end: '"""',
          patterns: [
            {
              name: 'constant.character.escape.java',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.double.java',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.java',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.java',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.java',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.java',
          match: '\\b(if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|assert)\\b',
        },
        {
          name: 'storage.type.java',
          match: '\\b(class|interface|enum|record|void|var)\\b',
        },
        {
          name: 'storage.type.primitive.java',
          match: '\\b(boolean|byte|char|short|int|long|float|double)\\b',
        },
        {
          name: 'storage.modifier.java',
          match: '\\b(public|private|protected|static|final|abstract|native|synchronized|transient|volatile|strictfp|sealed|non-sealed)\\b',
        },
        {
          name: 'constant.language.java',
          match: '\\b(true|false|null)\\b',
        },
        {
          name: 'keyword.other.java',
          match: '\\b(package|import|extends|implements|new|instanceof)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.java',
          match: '\\b(?:0[xX][0-9a-fA-F_]+[lL]?|0[bB][01_]+[lL]?|0[0-7_]+[lL]?|\\d+[._]?\\d*(?:[eE][+-]?\\d+)?[fFdDlL]?)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.java',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.java',
          match: '(\\+\\+|--|\\+|\\-|\\*|/|%|==|!=|<=|>=|<|>|&&|\\|\\||!|\\?|:|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|>>>=|&|\\||\\^|~|<<|>>|>>>)',
        },
      ],
    },
  },
}
