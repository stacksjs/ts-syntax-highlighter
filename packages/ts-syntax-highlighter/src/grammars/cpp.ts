import type { Grammar } from '../types'

export const cppGrammar: Grammar = {
  name: 'C++',
  scopeName: 'source.cpp',
  keywords: {
    // Control flow
    if: 'keyword.control.cpp',
    else: 'keyword.control.cpp',
    for: 'keyword.control.cpp',
    while: 'keyword.control.cpp',
    do: 'keyword.control.cpp',
    switch: 'keyword.control.cpp',
    case: 'keyword.control.cpp',
    default: 'keyword.control.cpp',
    break: 'keyword.control.cpp',
    continue: 'keyword.control.cpp',
    return: 'keyword.control.cpp',
    goto: 'keyword.control.cpp',
    try: 'keyword.control.cpp',
    catch: 'keyword.control.cpp',
    throw: 'keyword.control.cpp',
    // Types
    void: 'storage.type.cpp',
    bool: 'storage.type.cpp',
    char: 'storage.type.cpp',
    short: 'storage.type.cpp',
    int: 'storage.type.cpp',
    long: 'storage.type.cpp',
    float: 'storage.type.cpp',
    double: 'storage.type.cpp',
    signed: 'storage.type.cpp',
    unsigned: 'storage.type.cpp',
    struct: 'storage.type.cpp',
    union: 'storage.type.cpp',
    enum: 'storage.type.cpp',
    class: 'storage.type.cpp',
    typedef: 'storage.type.cpp',
    typename: 'storage.type.cpp',
    auto: 'storage.type.cpp',
    decltype: 'storage.type.cpp',
    // Modifiers
    const: 'storage.modifier.cpp',
    static: 'storage.modifier.cpp',
    extern: 'storage.modifier.cpp',
    register: 'storage.modifier.cpp',
    volatile: 'storage.modifier.cpp',
    inline: 'storage.modifier.cpp',
    virtual: 'storage.modifier.cpp',
    explicit: 'storage.modifier.cpp',
    friend: 'storage.modifier.cpp',
    mutable: 'storage.modifier.cpp',
    constexpr: 'storage.modifier.cpp',
    consteval: 'storage.modifier.cpp',
    constinit: 'storage.modifier.cpp',
    // Access
    public: 'storage.modifier.access.cpp',
    private: 'storage.modifier.access.cpp',
    protected: 'storage.modifier.access.cpp',
    // Operators
    new: 'keyword.operator.new.cpp',
    delete: 'keyword.operator.delete.cpp',
    sizeof: 'keyword.operator.sizeof.cpp',
    alignof: 'keyword.operator.alignof.cpp',
    typeid: 'keyword.operator.typeid.cpp',
    static_cast: 'keyword.operator.cast.cpp',
    dynamic_cast: 'keyword.operator.cast.cpp',
    const_cast: 'keyword.operator.cast.cpp',
    reinterpret_cast: 'keyword.operator.cast.cpp',
    // Other
    namespace: 'keyword.other.namespace.cpp',
    using: 'keyword.other.using.cpp',
    template: 'keyword.other.template.cpp',
    this: 'variable.language.cpp',
    nullptr: 'constant.language.cpp',
    true: 'constant.language.cpp',
    false: 'constant.language.cpp',
    operator: 'keyword.operator.cpp',
    concept: 'keyword.other.concept.cpp',
    requires: 'keyword.other.requires.cpp',
    co_await: 'keyword.control.cpp',
    co_return: 'keyword.control.cpp',
    co_yield: 'keyword.control.cpp',
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
          name: 'meta.preprocessor.include.cpp',
          match: '^\\s*#\\s*include\\s+(<[^>]+>|"[^"]+")',
          captures: {
            1: { name: 'string.quoted.other.lt-gt.include.cpp' },
          },
        },
        {
          name: 'meta.preprocessor.macro.cpp',
          match: '^\\s*#\\s*(define|undef)\\s+([a-zA-Z_][a-zA-Z0-9_]*)',
          captures: {
            1: { name: 'keyword.control.directive.cpp' },
            2: { name: 'entity.name.function.preprocessor.cpp' },
          },
        },
        {
          name: 'meta.preprocessor.cpp',
          match: '^\\s*#\\s*(if|ifdef|ifndef|elif|else|endif|pragma|error|warning|line)\\b',
          captures: {
            1: { name: 'keyword.control.directive.cpp' },
          },
        },
      ],
    },
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.cpp',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.cpp',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.raw.cpp',
          begin: 'R"([a-zA-Z0-9_]*)\\(',
          end: '\\)\\1"',
        },
        {
          name: 'string.quoted.double.cpp',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.cpp',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.cpp',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.cpp',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.cpp',
          match: '\\b(if|else|for|while|do|switch|case|default|break|continue|return|goto|try|catch|throw|co_await|co_return|co_yield)\\b',
        },
        {
          name: 'storage.type.cpp',
          match: '\\b(void|bool|char|short|int|long|float|double|signed|unsigned|struct|union|enum|class|typedef|typename|auto|decltype)\\b',
        },
        {
          name: 'storage.modifier.cpp',
          match: '\\b(const|static|extern|register|volatile|inline|virtual|explicit|friend|mutable|constexpr|consteval|constinit)\\b',
        },
        {
          name: 'storage.modifier.access.cpp',
          match: '\\b(public|private|protected)\\b',
        },
        {
          name: 'constant.language.cpp',
          match: '\\b(true|false|nullptr)\\b',
        },
        {
          name: 'keyword.other.cpp',
          match: '\\b(namespace|using|template|operator|concept|requires)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.cpp',
          match: '\\b(?:0[xX][0-9a-fA-F]+[uUlL]*|0[bB][01]+[uUlL]*|0[0-7]+[uUlL]*|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?[fFlL]?)\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.cpp',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.cpp',
          match: '(\\+\\+|--|\\+|\\-|\\*|/|%|==|!=|<=|>=|<|>|&&|\\|\\||!|&|\\||\\^|~|<<|>>|\\?|:|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|->|\\.|::)',
        },
      ],
    },
  },
}
