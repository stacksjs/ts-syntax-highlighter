import type { Grammar } from '../types'

export const csvGrammar: Grammar = {
  name: 'CSV',
  scopeName: 'text.csv',
  keywords: {},
  patterns: [{ include: '#quoted' }],
  repository: {
    quoted: { patterns: [{ name: 'string.quoted.double.csv', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.csv', match: '""' }] }] },
  },
}
