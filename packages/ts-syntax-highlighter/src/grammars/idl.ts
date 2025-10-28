import type { Grammar } from '../types'

export const idlGrammar: Grammar = {
  name: 'IDL',
  scopeName: 'source.idl',
  keywords: {
    interface: 'keyword.other.idl',
    module: 'keyword.other.idl',
    struct: 'keyword.other.idl',
    union: 'keyword.other.idl',
    enum: 'keyword.other.idl',
    typedef: 'keyword.other.idl',
    exception: 'keyword.other.idl',
    readonly: 'storage.modifier.idl',
    attribute: 'storage.modifier.idl',
    const: 'storage.modifier.idl',
    in: 'keyword.other.idl',
    out: 'keyword.other.idl',
    inout: 'keyword.other.idl',
    void: 'storage.type.idl',
    boolean: 'storage.type.idl',
    byte: 'storage.type.idl',
    short: 'storage.type.idl',
    long: 'storage.type.idl',
    float: 'storage.type.idl',
    double: 'storage.type.idl',
    char: 'storage.type.idl',
    string: 'storage.type.idl',
    TRUE: 'constant.language.idl',
    FALSE: 'constant.language.idl',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#keywords' },
    { include: '#numbers' },
  ],
  repository: {
    comments: {
      patterns: [
        { name: 'comment.line.double-slash.idl', match: '\\/\\/.*$' },
        { name: 'comment.block.idl', begin: '\\/\\*', end: '\\*\\/' },
      ],
    },
    strings: {
      patterns: [
        { name: 'string.quoted.double.idl', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.idl', match: '\\\\.' }] },
      ],
    },
    keywords: {
      patterns: [
        { name: 'keyword.other.idl', match: '\\b(interface|module|struct|union|enum|typedef|exception|in|out|inout)\\b' },
        { name: 'storage.modifier.idl', match: '\\b(readonly|attribute|const)\\b' },
        { name: 'storage.type.idl', match: '\\b(void|boolean|byte|short|long|float|double|char|string)\\b' },
        { name: 'constant.language.idl', match: '\\b(TRUE|FALSE)\\b' },
      ],
    },
    numbers: {
      patterns: [
        { name: 'constant.numeric.idl', match: '\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b' },
      ],
    },
  },
}
