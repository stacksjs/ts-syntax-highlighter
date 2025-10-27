import type { Grammar } from '../types'

export const swiftGrammar: Grammar = {
  name: 'Swift',
  scopeName: 'source.swift',
  keywords: {
    'import': 'keyword.other.swift', 'class': 'keyword.other.swift', 'struct': 'keyword.other.swift', 'enum': 'keyword.other.swift',
    'protocol': 'keyword.other.swift', 'extension': 'keyword.other.swift', 'func': 'keyword.other.swift', 'var': 'keyword.other.swift',
    'let': 'keyword.other.swift', 'if': 'keyword.control.swift', 'else': 'keyword.control.swift', 'guard': 'keyword.control.swift',
    'for': 'keyword.control.swift', 'while': 'keyword.control.swift', 'repeat': 'keyword.control.swift', 'switch': 'keyword.control.swift',
    'case': 'keyword.control.swift', 'default': 'keyword.control.swift', 'return': 'keyword.control.swift', 'break': 'keyword.control.swift',
    'continue': 'keyword.control.swift', 'fallthrough': 'keyword.control.swift', 'defer': 'keyword.control.swift', 'in': 'keyword.control.swift',
    'public': 'storage.modifier.swift', 'private': 'storage.modifier.swift', 'fileprivate': 'storage.modifier.swift',
    'internal': 'storage.modifier.swift', 'open': 'storage.modifier.swift', 'static': 'storage.modifier.swift', 'final': 'storage.modifier.swift',
    'true': 'constant.language.swift', 'false': 'constant.language.swift', 'nil': 'constant.language.swift',
    'self': 'variable.language.swift', 'Self': 'variable.language.swift',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#numbers' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.double-slash.swift', match: '\\/\\/.*$' }, { name: 'comment.block.swift', begin: '\\/\\*', end: '\\*\\/' }] },
    strings: { patterns: [{ name: 'string.quoted.double.swift', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.swift', match: '\\\\.' }, { name: 'meta.embedded.line.swift', begin: '\\\\\\(', end: '\\)' }] }] },
    keywords: { patterns: [{ name: 'keyword.control.swift', match: '\\b(if|else|guard|for|while|repeat|switch|case|default|return|break|continue|fallthrough|defer|in)\\b' }, { name: 'keyword.other.swift', match: '\\b(import|class|struct|enum|protocol|extension|func|var|let)\\b' }, { name: 'constant.language.swift', match: '\\b(true|false|nil)\\b' }] },
    numbers: { patterns: [{ name: 'constant.numeric.swift', match: '\\b\\d+\\.?\\d*\\b' }] },
  },
}
