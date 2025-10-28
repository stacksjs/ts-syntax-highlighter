import type { Grammar } from '../types'

export const bnfGrammar: Grammar = {
  name: 'BNF',
  scopeName: 'source.bnf',
  keywords: {},
  patterns: [{ include: '#rules' }, { include: '#terminals' }, { include: '#nonterminals' }],
  repository: {
    rules: { patterns: [{ name: 'keyword.operator.bnf', match: '::=' }] },
    nonterminals: { patterns: [{ name: 'entity.name.type.bnf', match: '<[^>]+>' }] },
    terminals: { patterns: [{ name: 'string.quoted.double.bnf', begin: '"', end: '"' }, { name: 'string.quoted.single.bnf', begin: '\'', end: '\'' }] },
  },
}
