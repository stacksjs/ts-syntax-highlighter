import type { Grammar } from '../types'

export const rGrammar: Grammar = {
  name: 'R',
  scopeName: 'source.r',
  keywords: {
    if: 'keyword.control.r',
    else: 'keyword.control.r',
    for: 'keyword.control.r',
    while: 'keyword.control.r',
    repeat: 'keyword.control.r',
    break: 'keyword.control.r',
    next: 'keyword.control.r',
    return: 'keyword.control.r',
    function: 'storage.type.r',
    in: 'keyword.operator.r',
    TRUE: 'constant.language.r',
    FALSE: 'constant.language.r',
    NULL: 'constant.language.r',
    NA: 'constant.language.r',
    NaN: 'constant.language.r',
    Inf: 'constant.language.r',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#numbers' }, { include: '#operators' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.r', match: '#.*$' }] },
    strings: { patterns: [{ name: 'string.quoted.double.r', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.r', match: '\\\\.' }] }, { name: 'string.quoted.single.r', begin: '\'', end: '\'', patterns: [{ name: 'constant.character.escape.r', match: '\\\\.' }] }] },
    keywords: { patterns: [{ name: 'keyword.control.r', match: '\\b(if|else|for|while|repeat|break|next|return|in)\\b' }, { name: 'storage.type.r', match: '\\b(function)\\b' }, { name: 'constant.language.r', match: '\\b(TRUE|FALSE|NULL|NA|NaN|Inf)\\b' }] },
    numbers: { patterns: [{ name: 'constant.numeric.r', match: '\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?[iL]?\\b' }] },
    operators: { patterns: [{ name: 'keyword.operator.r', match: '(<-|<<-|->|->>|==|!=|<=|>=|<|>|&&|\\|\\||!|&|\\||%[a-zA-Z]+%|\\+|\\-|\\*|/|\\^|%%|%/%|::|:::)' }] },
  },
}
