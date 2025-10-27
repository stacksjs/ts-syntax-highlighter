import type { Grammar } from '../types'

export const powershellGrammar: Grammar = {
  name: 'PowerShell',
  scopeName: 'source.powershell',
  keywords: {
    'if': 'keyword.control.powershell', 'else': 'keyword.control.powershell', 'elseif': 'keyword.control.powershell',
    'switch': 'keyword.control.powershell', 'for': 'keyword.control.powershell', 'foreach': 'keyword.control.powershell',
    'while': 'keyword.control.powershell', 'do': 'keyword.control.powershell', 'until': 'keyword.control.powershell',
    'break': 'keyword.control.powershell', 'continue': 'keyword.control.powershell', 'return': 'keyword.control.powershell',
    'function': 'storage.type.powershell', 'filter': 'storage.type.powershell', 'param': 'storage.type.powershell',
    'begin': 'keyword.control.powershell', 'process': 'keyword.control.powershell', 'end': 'keyword.control.powershell',
    'try': 'keyword.control.powershell', 'catch': 'keyword.control.powershell', 'finally': 'keyword.control.powershell',
    'throw': 'keyword.control.powershell', '$true': 'constant.language.powershell', '$false': 'constant.language.powershell',
    '$null': 'constant.language.powershell',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#variables' }, { include: '#keywords' }, { include: '#cmdlets' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.powershell', match: '#.*$' }, { name: 'comment.block.powershell', begin: '<#', end: '#>' }] },
    strings: { patterns: [{ name: 'string.quoted.double.powershell', begin: '"', end: '"', patterns: [{ name: 'variable.other.powershell', match: '\\$[a-zA-Z_][a-zA-Z0-9_]*' }] }, { name: 'string.quoted.single.powershell', begin: "'", end: "'" }] },
    variables: { patterns: [{ name: 'variable.other.powershell', match: '\\$[a-zA-Z_][a-zA-Z0-9_]*' }] },
    keywords: { patterns: [{ name: 'keyword.control.powershell', match: '\\b(if|else|elseif|switch|for|foreach|while|do|until|break|continue|return|begin|process|end|try|catch|finally|throw)\\b' }, { name: 'storage.type.powershell', match: '\\b(function|filter|param)\\b' }, { name: 'constant.language.powershell', match: '\\$(?:true|false|null)\\b' }] },
    cmdlets: { patterns: [{ name: 'support.function.powershell', match: '\\b[A-Z][a-z]+-[A-Z][a-z]+[a-zA-Z]*\\b' }] },
  },
}
