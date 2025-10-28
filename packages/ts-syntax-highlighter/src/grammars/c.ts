import type { Grammar } from '../types'

export const cGrammar: Grammar = {
  name: 'C',
  scopeName: 'source.c',
  keywords: {
    // Control flow
    if: 'keyword.control.c',
    else: 'keyword.control.c',
    for: 'keyword.control.c',
    while: 'keyword.control.c',
    do: 'keyword.control.c',
    switch: 'keyword.control.c',
    case: 'keyword.control.c',
    default: 'keyword.control.c',
    break: 'keyword.control.c',
    continue: 'keyword.control.c',
    return: 'keyword.control.c',
    goto: 'keyword.control.c',
    // Types
    void: 'storage.type.c',
    char: 'storage.type.c',
    short: 'storage.type.c',
    int: 'storage.type.c',
    long: 'storage.type.c',
    float: 'storage.type.c',
    double: 'storage.type.c',
    signed: 'storage.type.c',
    unsigned: 'storage.type.c',
    struct: 'storage.type.c',
    union: 'storage.type.c',
    enum: 'storage.type.c',
    typedef: 'storage.type.c',
    // Modifiers
    const: 'storage.modifier.c',
    static: 'storage.modifier.c',
    extern: 'storage.modifier.c',
    register: 'storage.modifier.c',
    volatile: 'storage.modifier.c',
    inline: 'storage.modifier.c',
    restrict: 'storage.modifier.c',
    _Atomic: 'storage.modifier.c',
    // Operators
    sizeof: 'keyword.operator.sizeof.c',
    // Standard library types
    size_t: 'support.type.c',
    FILE: 'support.type.c',
    NULL: 'constant.language.c',
  },
  patterns: [
    { include: '#preprocessor' },
    { include: '#comments' },
    { include: '#strings' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#functions' },
    { include: '#operators' },
  ],
  repository: {
    preprocessor: {
      patterns: [
        {
          name: 'meta.preprocessor.include.c',
          match: '^\\s*#\\s*include\\s+(<[^>]+>|"[^"]+")',
          captures: {
            1: { name: 'string.quoted.other.lt-gt.include.c' },
          },
        },
        {
          name: 'meta.preprocessor.macro.c',
          match: '^\\s*#\\s*(define|undef)\\s+([a-zA-Z_][a-zA-Z0-9_]*)',
          captures: {
            1: { name: 'keyword.control.directive.c' },
            2: { name: 'entity.name.function.preprocessor.c' },
          },
        },
        {
          name: 'meta.preprocessor.c',
          match: '^\\s*#\\s*(if|ifdef|ifndef|elif|else|endif|pragma|error|warning|line)\\b',
          captures: {
            1: { name: 'keyword.control.directive.c' },
          },
        },
      ],
    },
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.c',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.c',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.c',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.c',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.c',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.c',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.c',
          match: '\\b(if|else|for|while|do|switch|case|default|break|continue|return|goto)\\b',
        },
        {
          name: 'storage.type.c',
          match: '\\b(void|char|short|int|long|float|double|signed|unsigned|struct|union|enum|typedef)\\b',
        },
        {
          name: 'storage.modifier.c',
          match: '\\b(const|static|extern|register|volatile|inline|restrict|_Atomic)\\b',
        },
        {
          name: 'constant.language.c',
          match: '\\b(NULL|true|false)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.c',
          match: '\\b(?:0[xX][0-9a-fA-F]+[uUlL]*|0[0-7]+[uUlL]*|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?[fFlL]?)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.c',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.c',
          match: '(\\+\\+|--|\\+|\\-|\\*|/|%|==|!=|<=|>=|<|>|&&|\\|\\||!|&|\\||\\^|~|<<|>>|\\?|:|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|->|\\.)',
        },
      ],
    },
  },
}
