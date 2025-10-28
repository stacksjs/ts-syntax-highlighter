import type { Grammar } from '../types'

export const csharpGrammar: Grammar = {
  name: 'C#',
  scopeName: 'source.cs',
  keywords: {
    // Control flow
    if: 'keyword.control.cs',
    else: 'keyword.control.cs',
    for: 'keyword.control.cs',
    foreach: 'keyword.control.cs',
    while: 'keyword.control.cs',
    do: 'keyword.control.cs',
    switch: 'keyword.control.cs',
    case: 'keyword.control.cs',
    default: 'keyword.control.cs',
    break: 'keyword.control.cs',
    continue: 'keyword.control.cs',
    return: 'keyword.control.cs',
    goto: 'keyword.control.cs',
    try: 'keyword.control.cs',
    catch: 'keyword.control.cs',
    finally: 'keyword.control.cs',
    throw: 'keyword.control.cs',
    yield: 'keyword.control.cs',
    await: 'keyword.control.cs',
    // Types
    class: 'keyword.other.class.cs',
    struct: 'keyword.other.struct.cs',
    interface: 'keyword.other.interface.cs',
    enum: 'keyword.other.enum.cs',
    delegate: 'keyword.other.delegate.cs',
    record: 'keyword.other.record.cs',
    void: 'keyword.type.cs',
    bool: 'keyword.type.cs',
    byte: 'keyword.type.cs',
    sbyte: 'keyword.type.cs',
    char: 'keyword.type.cs',
    decimal: 'keyword.type.cs',
    double: 'keyword.type.cs',
    float: 'keyword.type.cs',
    int: 'keyword.type.cs',
    uint: 'keyword.type.cs',
    long: 'keyword.type.cs',
    ulong: 'keyword.type.cs',
    short: 'keyword.type.cs',
    ushort: 'keyword.type.cs',
    object: 'keyword.type.cs',
    string: 'keyword.type.cs',
    var: 'keyword.type.cs',
    dynamic: 'keyword.type.cs',
    // Modifiers
    public: 'storage.modifier.cs',
    private: 'storage.modifier.cs',
    protected: 'storage.modifier.cs',
    internal: 'storage.modifier.cs',
    static: 'storage.modifier.cs',
    readonly: 'storage.modifier.cs',
    const: 'storage.modifier.cs',
    virtual: 'storage.modifier.cs',
    override: 'storage.modifier.cs',
    abstract: 'storage.modifier.cs',
    sealed: 'storage.modifier.cs',
    partial: 'storage.modifier.cs',
    async: 'storage.modifier.cs',
    extern: 'storage.modifier.cs',
    volatile: 'storage.modifier.cs',
    // Other keywords
    namespace: 'keyword.other.namespace.cs',
    using: 'keyword.other.using.cs',
    new: 'keyword.operator.new.cs',
    this: 'variable.language.cs',
    base: 'variable.language.cs',
    true: 'constant.language.cs',
    false: 'constant.language.cs',
    null: 'constant.language.cs',
    typeof: 'keyword.operator.cs',
    sizeof: 'keyword.operator.cs',
    is: 'keyword.operator.cs',
    as: 'keyword.operator.cs',
    in: 'keyword.operator.cs',
    out: 'keyword.operator.cs',
    ref: 'keyword.operator.cs',
    params: 'keyword.other.cs',
    operator: 'keyword.other.cs',
    implicit: 'keyword.other.cs',
    explicit: 'keyword.other.cs',
    get: 'keyword.other.cs',
    set: 'keyword.other.cs',
    value: 'keyword.other.cs',
    add: 'keyword.other.cs',
    remove: 'keyword.other.cs',
    event: 'keyword.other.cs',
    lock: 'keyword.control.cs',
    checked: 'keyword.control.cs',
    unchecked: 'keyword.control.cs',
    unsafe: 'keyword.other.cs',
    fixed: 'keyword.other.cs',
    stackalloc: 'keyword.operator.cs',
    nameof: 'keyword.operator.cs',
    when: 'keyword.control.cs',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#attributes' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#functions' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.cs',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.documentation.cs',
          begin: '\\/\\/\\/',
          end: '$',
        },
        {
          name: 'comment.block.cs',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.verbatim.cs',
          begin: '@"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.cs',
              match: '""',
            },
          ],
        },
        {
          name: 'string.quoted.interpolated.cs',
          begin: '\\$"',
          end: '"',
          patterns: [
            {
              name: 'meta.interpolation.cs',
              begin: '\\{',
              end: '\\}',
              patterns: [
                { include: '$self' },
              ],
            },
            {
              name: 'constant.character.escape.cs',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.double.cs',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.cs',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.cs',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.cs',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    attributes: {
      patterns: [
        {
          name: 'meta.attribute.cs',
          begin: '\\[',
          end: '\\]',
          patterns: [
            {
              name: 'entity.name.type.attribute.cs',
              match: '[A-Z][a-zA-Z0-9]*',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.cs',
          match: '\\b(if|else|for|foreach|while|do|switch|case|default|break|continue|return|goto|try|catch|finally|throw|yield|await|lock|checked|unchecked|when)\\b',
        },
        {
          name: 'keyword.other.cs',
          match: '\\b(class|struct|interface|enum|delegate|record|namespace|using|operator|implicit|explicit|get|set|value|add|remove|event|params|unsafe|fixed)\\b',
        },
        {
          name: 'keyword.type.cs',
          match: '\\b(void|bool|byte|sbyte|char|decimal|double|float|int|uint|long|ulong|short|ushort|object|string|var|dynamic)\\b',
        },
        {
          name: 'storage.modifier.cs',
          match: '\\b(public|private|protected|internal|static|readonly|const|virtual|override|abstract|sealed|partial|async|extern|volatile)\\b',
        },
        {
          name: 'constant.language.cs',
          match: '\\b(true|false|null)\\b',
        },
        {
          name: 'variable.language.cs',
          match: '\\b(this|base)\\b',
        },
        {
          name: 'keyword.operator.cs',
          match: '\\b(new|typeof|sizeof|is|as|in|out|ref|stackalloc|nameof)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.cs',
          match: '\\b(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\\d+[._]?\\d*(?:[eE][+-]?\\d+)?)[fFdDmMlLuU]*\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.cs',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.cs',
          match: '(\\+\\+|--|\\+|\\-|\\*|/|%|==|!=|<=|>=|<|>|&&|\\|\\||!|&|\\||\\^|~|<<|>>|\\?\\?|\\?|:|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|=>|\\.|->)',
        },
      ],
    },
  },
}
