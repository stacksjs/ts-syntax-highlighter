import type { Grammar } from '../types'

export const solidityGrammar: Grammar = {
  name: 'Solidity',
  scopeName: 'source.solidity',
  keywords: {
    'pragma': 'keyword.other.solidity', 'import': 'keyword.other.solidity', 'contract': 'keyword.other.solidity',
    'interface': 'keyword.other.solidity', 'library': 'keyword.other.solidity', 'function': 'keyword.other.solidity',
    'modifier': 'keyword.other.solidity', 'event': 'keyword.other.solidity', 'struct': 'keyword.other.solidity',
    'enum': 'keyword.other.solidity', 'if': 'keyword.control.solidity', 'else': 'keyword.control.solidity',
    'for': 'keyword.control.solidity', 'while': 'keyword.control.solidity', 'do': 'keyword.control.solidity',
    'return': 'keyword.control.solidity', 'break': 'keyword.control.solidity', 'continue': 'keyword.control.solidity',
    'public': 'storage.modifier.solidity', 'private': 'storage.modifier.solidity', 'internal': 'storage.modifier.solidity',
    'external': 'storage.modifier.solidity', 'pure': 'storage.modifier.solidity', 'view': 'storage.modifier.solidity',
    'payable': 'storage.modifier.solidity', 'true': 'constant.language.solidity', 'false': 'constant.language.solidity',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#numbers' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.double-slash.solidity', match: '\\/\\/.*$' }, { name: 'comment.block.solidity', begin: '\\/\\*', end: '\\*\\/' }] },
    strings: { patterns: [{ name: 'string.quoted.double.solidity', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.solidity', match: '\\\\.' }] }] },
    keywords: { patterns: [{ name: 'keyword.other.solidity', match: '\\b(pragma|import|contract|interface|library|function|modifier|event|struct|enum)\\b' }, { name: 'keyword.control.solidity', match: '\\b(if|else|for|while|do|return|break|continue)\\b' }, { name: 'storage.modifier.solidity', match: '\\b(public|private|internal|external|pure|view|payable)\\b' }, { name: 'constant.language.solidity', match: '\\b(true|false)\\b' }] },
    numbers: { patterns: [{ name: 'constant.numeric.solidity', match: '\\b(?:0[xX][0-9a-fA-F]+|\\d+)\\b' }] },
  },
}
