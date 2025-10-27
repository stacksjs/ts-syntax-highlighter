import type { Grammar } from '../types'

export const luaGrammar: Grammar = {
  name: 'Lua',
  scopeName: 'source.lua',
  keywords: {
    'and': 'keyword.operator.lua', 'break': 'keyword.control.lua', 'do': 'keyword.control.lua', 'else': 'keyword.control.lua',
    'elseif': 'keyword.control.lua', 'end': 'keyword.control.lua', 'false': 'constant.language.lua', 'for': 'keyword.control.lua',
    'function': 'keyword.control.lua', 'if': 'keyword.control.lua', 'in': 'keyword.control.lua', 'local': 'storage.modifier.lua',
    'nil': 'constant.language.lua', 'not': 'keyword.operator.lua', 'or': 'keyword.operator.lua', 'repeat': 'keyword.control.lua',
    'return': 'keyword.control.lua', 'then': 'keyword.control.lua', 'true': 'constant.language.lua', 'until': 'keyword.control.lua',
    'while': 'keyword.control.lua',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#numbers' }],
  repository: {
    comments: { patterns: [{ name: 'comment.block.lua', begin: '--\\[\\[', end: '\\]\\]' }, { name: 'comment.line.double-dash.lua', match: '--.*$' }] },
    strings: { patterns: [{ name: 'string.quoted.other.multiline.lua', begin: '\\[\\[', end: '\\]\\]' }, { name: 'string.quoted.double.lua', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.lua', match: '\\\\.' }] }, { name: 'string.quoted.single.lua', begin: "'", end: "'", patterns: [{ name: 'constant.character.escape.lua', match: '\\\\.' }] }] },
    keywords: { patterns: [{ name: 'keyword.control.lua', match: '\\b(break|do|else|elseif|end|for|function|if|in|repeat|return|then|until|while)\\b' }, { name: 'constant.language.lua', match: '\\b(true|false|nil)\\b' }, { name: 'storage.modifier.lua', match: '\\b(local)\\b' }] },
    numbers: { patterns: [{ name: 'constant.numeric.lua', match: '\\b(?:0[xX][0-9a-fA-F]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)\\b' }] },
  },
}
