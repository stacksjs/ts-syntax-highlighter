import type { Grammar } from '../types'

export const goGrammar: Grammar = {
  name: 'Go',
  scopeName: 'source.go',
  keywords: {
    break: 'keyword.control.go',
    case: 'keyword.control.go',
    chan: 'keyword.control.go',
    const: 'keyword.control.go',
    continue: 'keyword.control.go',
    default: 'keyword.control.go',
    defer: 'keyword.control.go',
    else: 'keyword.control.go',
    fallthrough: 'keyword.control.go',
    for: 'keyword.control.go',
    func: 'keyword.control.go',
    go: 'keyword.control.go',
    goto: 'keyword.control.go',
    if: 'keyword.control.go',
    import: 'keyword.control.go',
    interface: 'keyword.control.go',
    map: 'keyword.control.go',
    package: 'keyword.control.go',
    range: 'keyword.control.go',
    return: 'keyword.control.go',
    select: 'keyword.control.go',
    struct: 'keyword.control.go',
    switch: 'keyword.control.go',
    type: 'keyword.control.go',
    var: 'keyword.control.go',
    bool: 'storage.type.go',
    byte: 'storage.type.go',
    complex64: 'storage.type.go',
    complex128: 'storage.type.go',
    error: 'storage.type.go',
    float32: 'storage.type.go',
    float64: 'storage.type.go',
    int: 'storage.type.go',
    int8: 'storage.type.go',
    int16: 'storage.type.go',
    int32: 'storage.type.go',
    int64: 'storage.type.go',
    rune: 'storage.type.go',
    string: 'storage.type.go',
    uint: 'storage.type.go',
    uint8: 'storage.type.go',
    uint16: 'storage.type.go',
    uint32: 'storage.type.go',
    uint64: 'storage.type.go',
    uintptr: 'storage.type.go',
    true: 'constant.language.go',
    false: 'constant.language.go',
    nil: 'constant.language.go',
    iota: 'constant.language.go',
    append: 'support.function.builtin.go',
    cap: 'support.function.builtin.go',
    close: 'support.function.builtin.go',
    complex: 'support.function.builtin.go',
    copy: 'support.function.builtin.go',
    delete: 'support.function.builtin.go',
    imag: 'support.function.builtin.go',
    len: 'support.function.builtin.go',
    make: 'support.function.builtin.go',
    new: 'support.function.builtin.go',
    panic: 'support.function.builtin.go',
    print: 'support.function.builtin.go',
    println: 'support.function.builtin.go',
    real: 'support.function.builtin.go',
    recover: 'support.function.builtin.go',
  },
  patterns: [
    { include: '#comments' },
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
          name: 'comment.line.double-slash.go',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.go',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.raw.go',
          begin: '`',
          end: '`',
        },
        {
          name: 'string.quoted.double.go',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.go',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.go',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.go',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.go',
          match: '\\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\\b',
        },
        {
          name: 'storage.type.go',
          match: '\\b(bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr)\\b',
        },
        {
          name: 'constant.language.go',
          match: '\\b(true|false|nil|iota)\\b',
        },
        {
          name: 'support.function.builtin.go',
          match: '\\b(append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.go',
          match: '\\b(?:0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)[i]?\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.go',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.go',
          match: '(\\+\\+|--|\\+|\\-|\\*|/|%|==|!=|<=|>=|<-|<|>|&&|\\|\\||!|&|\\||\\^|&\\^|<<|>>|:=|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|&\\^=|<<=|>>=|\\.\\.\\.)',
        },
      ],
    },
  },
}
