import type { Grammar } from '../types'

export const rustGrammar: Grammar = {
  name: 'Rust',
  scopeName: 'source.rust',
  /*
   * `println!` is one token and the `!` is what says so, but the identifier
   * fast path has already read `println` and answered by the time any pattern
   * runs. `#macros` below still covers the case the fast path does not reach.
   *
   * `!=` is not a macro, which is what `unless` is for.
   */
  /*
   * No single quote: in Rust it opens a char literal or a lifetime, both of
   * which `#strings` and `#lifetimes` below read properly, and neither of which
   * survives being read as a string that runs to the next quote.
   */
  stringQuotes: '"',
  wordSuffixes: [
    { follows: '!', scope: 'entity.name.function.macro.rust', unless: '=', consume: true },
  ],
  keywords: {
    // Control flow
    if: 'keyword.control.rust',
    else: 'keyword.control.rust',
    for: 'keyword.control.rust',
    while: 'keyword.control.rust',
    loop: 'keyword.control.rust',
    match: 'keyword.control.rust',
    return: 'keyword.control.rust',
    break: 'keyword.control.rust',
    continue: 'keyword.control.rust',
    yield: 'keyword.control.rust',
    // Declaration
    fn: 'keyword.other.fn.rust',
    let: 'keyword.other.rust',
    struct: 'keyword.other.rust',
    enum: 'keyword.other.rust',
    trait: 'keyword.other.rust',
    impl: 'keyword.other.rust',
    type: 'keyword.other.rust',
    mod: 'keyword.other.rust',
    use: 'keyword.other.rust',
    const: 'keyword.other.rust',
    static: 'keyword.other.rust',
    // Modifiers
    pub: 'storage.modifier.rust',
    mut: 'storage.modifier.rust',
    ref: 'storage.modifier.rust',
    unsafe: 'storage.modifier.rust',
    async: 'storage.modifier.rust',
    await: 'keyword.control.rust',
    move: 'storage.modifier.rust',
    // Types
    i8: 'storage.type.rust',
    i16: 'storage.type.rust',
    i32: 'storage.type.rust',
    i64: 'storage.type.rust',
    i128: 'storage.type.rust',
    isize: 'storage.type.rust',
    u8: 'storage.type.rust',
    u16: 'storage.type.rust',
    u32: 'storage.type.rust',
    u64: 'storage.type.rust',
    u128: 'storage.type.rust',
    usize: 'storage.type.rust',
    f32: 'storage.type.rust',
    f64: 'storage.type.rust',
    bool: 'storage.type.rust',
    char: 'storage.type.rust',
    str: 'storage.type.rust',
    Self: 'storage.type.rust',
    // Constants
    true: 'constant.language.rust',
    false: 'constant.language.rust',
    self: 'variable.language.rust',
    super: 'variable.language.rust',
    crate: 'variable.language.rust',
    // Other
    where: 'keyword.other.rust',
    as: 'keyword.other.rust',
    in: 'keyword.other.rust',
    extern: 'keyword.other.rust',
    dyn: 'keyword.other.rust',
  },
  patterns: [
    { include: '#comments' },
    { include: '#attributes' },
    { include: '#lifetimes' },
    { include: '#strings' },
    { include: '#macros' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#functions' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.documentation.rust',
          match: '\\/\\/\\/.*$',
        },
        {
          name: 'comment.line.double-slash.rust',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.block.rust',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    attributes: {
      patterns: [
        {
          name: 'meta.attribute.rust',
          begin: '#!?\\[',
          end: '\\]',
          patterns: [
            {
              name: 'entity.name.function.attribute.rust',
              match: '[a-zA-Z_][a-zA-Z0-9_]*',
            },
          ],
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.byte.raw.rust',
          begin: 'br(#*)"',
          end: '"\\1',
        },
        {
          name: 'string.quoted.raw.rust',
          begin: 'r(#*)"',
          end: '"\\1',
        },
        {
          name: 'string.quoted.double.rust',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.rust',
              match: '\\\\.',
            },
          ],
        },
        /*
         * A char literal, not a string. Rust has no single-quoted string, and
         * reading one is what hid every lifetime in the language: `'a` opened a
         * quote that never closed, so `fn longest<'a>(x: &'a str)` came back as
         * one unterminated string and the lifetime rule below never ran.
         *
         * Matching the whole literal at once is what makes the difference -
         * `'a'` is a char and `'a` is not, and only a rule that requires the
         * closing quote can tell them apart.
         */
        {
          name: 'string.quoted.single.rust',
          match: 'b?\'(?:\\\\.|[^\\\\\'])\'',
        },
      ],
    },
    lifetimes: {
      patterns: [
        /*
         * Tried before the char literal, and therefore required not to look
         * like one: `'a'` is the character a and `'a` is the lifetime a, and
         * the only thing that separates them is the quote that does not come.
         */
        {
          name: 'entity.name.lifetime.rust',
          match: '\'[a-zA-Z_][a-zA-Z0-9_]*(?!\')\\b',
        },
      ],
    },
    macros: {
      patterns: [
        {
          name: 'entity.name.function.macro.rust',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)!',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.rust',
          match: '\\b(if|else|for|while|loop|match|return|break|continue|yield|await)\\b',
        },
        {
          name: 'keyword.other.rust',
          match: '\\b(fn|let|struct|enum|trait|impl|type|mod|use|const|static|where|as|in|extern|dyn)\\b',
        },
        {
          name: 'storage.modifier.rust',
          match: '\\b(pub|mut|ref|unsafe|async|move)\\b',
        },
        {
          name: 'storage.type.rust',
          match: '\\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|Self)\\b',
        },
        {
          name: 'constant.language.rust',
          match: '\\b(true|false)\\b',
        },
        {
          name: 'variable.language.rust',
          match: '\\b(self|super|crate)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.rust',
          match: '\\b(?:0[xX][0-9a-fA-F_]+|0[oO][0-7_]+|0[bB][01_]+|\\d+[._]?\\d*(?:[eE][+-]?\\d+)?)[iu]?(?:8|16|32|64|128|size)?\\b',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.rust',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.rust',
          match: '(->|=>|\\+|\\-|\\*|/|%|==|!=|<=|>=|<|>|&&|\\|\\||!|&|\\||\\^|<<|>>|=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=|::|\\.|\\.\\.|\\.\\.\\.=)',
        },
      ],
    },
  },
}
