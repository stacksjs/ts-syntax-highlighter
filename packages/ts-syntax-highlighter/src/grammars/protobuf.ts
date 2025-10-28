import type { Grammar } from '../types'

export const protobufGrammar: Grammar = {
  name: 'Protocol Buffers',
  scopeName: 'source.proto',
  keywords: {
    syntax: 'keyword.other.proto',
    package: 'keyword.other.proto',
    import: 'keyword.other.proto',
    option: 'keyword.other.proto',
    message: 'keyword.other.proto',
    enum: 'keyword.other.proto',
    service: 'keyword.other.proto',
    rpc: 'keyword.other.proto',
    returns: 'keyword.other.proto',
    repeated: 'storage.modifier.proto',
    optional: 'storage.modifier.proto',
    required: 'storage.modifier.proto',
    true: 'constant.language.proto',
    false: 'constant.language.proto',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#numbers' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.double-slash.proto', match: '\\/\\/.*$' }, { name: 'comment.block.proto', begin: '\\/\\*', end: '\\*\\/' }] },
    strings: { patterns: [{ name: 'string.quoted.double.proto', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.proto', match: '\\\\.' }] }] },
    keywords: { patterns: [{ name: 'keyword.other.proto', match: '\\b(syntax|package|import|option|message|enum|service|rpc|returns)\\b' }, { name: 'storage.modifier.proto', match: '\\b(repeated|optional|required)\\b' }, { name: 'constant.language.proto', match: '\\b(true|false)\\b' }] },
    numbers: { patterns: [{ name: 'constant.numeric.proto', match: '\\b\\d+\\b' }] },
  },
}
