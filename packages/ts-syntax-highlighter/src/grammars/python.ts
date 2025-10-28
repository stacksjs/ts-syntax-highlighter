import type { Grammar } from '../types'

export const pythonGrammar: Grammar = {
  name: 'Python',
  scopeName: 'source.python',
  keywords: {
    // Control flow
    if: 'keyword.control.python',
    elif: 'keyword.control.python',
    else: 'keyword.control.python',
    for: 'keyword.control.python',
    while: 'keyword.control.python',
    break: 'keyword.control.python',
    continue: 'keyword.control.python',
    return: 'keyword.control.python',
    yield: 'keyword.control.python',
    try: 'keyword.control.python',
    except: 'keyword.control.python',
    finally: 'keyword.control.python',
    raise: 'keyword.control.python',
    with: 'keyword.control.python',
    as: 'keyword.control.python',
    pass: 'keyword.control.python',
    match: 'keyword.control.python',
    case: 'keyword.control.python',
    // Storage
    def: 'storage.type.function.python',
    class: 'storage.type.class.python',
    lambda: 'storage.type.function.python',
    async: 'storage.modifier.async.python',
    await: 'keyword.control.python',
    // Operators
    and: 'keyword.operator.logical.python',
    or: 'keyword.operator.logical.python',
    not: 'keyword.operator.logical.python',
    in: 'keyword.operator.python',
    is: 'keyword.operator.python',
    // Import
    import: 'keyword.control.import.python',
    from: 'keyword.control.import.python',
    // Constants
    True: 'constant.language.python',
    False: 'constant.language.python',
    None: 'constant.language.python',
    self: 'variable.language.python',
    cls: 'variable.language.python',
    // Built-ins
    print: 'support.function.builtin.python',
    len: 'support.function.builtin.python',
    range: 'support.function.builtin.python',
    str: 'support.function.builtin.python',
    int: 'support.function.builtin.python',
    float: 'support.function.builtin.python',
    list: 'support.function.builtin.python',
    dict: 'support.function.builtin.python',
    tuple: 'support.function.builtin.python',
    set: 'support.function.builtin.python',
    bool: 'support.function.builtin.python',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#decorators' },
    { include: '#keywords' },
    { include: '#functions' },
    { include: '#numbers' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.number-sign.python',
          match: '#.*$',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.docstring.python',
          begin: '"""',
          end: '"""',
        },
        {
          name: 'string.quoted.docstring.python',
          begin: '\'\'\'',
          end: '\'\'\'',
        },
        {
          name: 'string.quoted.double.python',
          begin: 'f"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.python',
              match: '\\\\.',
            },
            {
              name: 'meta.embedded.expression.python',
              begin: '\\{',
              end: '\\}',
            },
          ],
        },
        {
          name: 'string.quoted.double.python',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.python',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.python',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.python',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    decorators: {
      patterns: [
        {
          name: 'entity.name.function.decorator.python',
          match: '@[a-zA-Z_][a-zA-Z0-9_]*',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.python',
          match: '\\b(if|elif|else|for|while|break|continue|return|yield|try|except|finally|raise|with|as|pass|match|case|await)\\b',
        },
        {
          name: 'storage.type.python',
          match: '\\b(def|class|lambda|async)\\b',
        },
        {
          name: 'keyword.control.import.python',
          match: '\\b(import|from)\\b',
        },
        {
          name: 'constant.language.python',
          match: '\\b(True|False|None)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.python',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.python',
          match: '\\b(?:0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:[eE][-+]?[0-9]+)?)\\b',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.python',
          match: '(\\+|-|\\*|/|//|%|\\*\\*|==|!=|<|>|<=|>=|=|\\+=|-=|\\*=|/=)',
        },
      ],
    },
  },
}
