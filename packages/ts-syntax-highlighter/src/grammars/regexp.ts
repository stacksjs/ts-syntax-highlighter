import type { Grammar } from '../types'

export const regexpGrammar: Grammar = {
  name: 'RegExp',
  scopeName: 'source.regexp',
  keywords: {},
  patterns: [{ include: '#character-class' }, { include: '#groups' }, { include: '#quantifiers' }, { include: '#anchors' }],
  repository: {
    'character-class': { patterns: [{ name: 'constant.character.character-class.regexp', begin: '\\[', end: '\\]', patterns: [{ name: 'constant.character.escape.regexp', match: '\\\\.' }] }] },
    'groups': { patterns: [{ name: 'meta.group.regexp', begin: '\\(', end: '\\)', patterns: [{ include: '$self' }] }] },
    'quantifiers': { patterns: [{ name: 'keyword.operator.quantifier.regexp', match: '[*+?]|\\{\\d+(,\\d*)?\\}' }] },
    'anchors': { patterns: [{ name: 'keyword.operator.anchor.regexp', match: '\\^|\\$' }] },
  },
}
