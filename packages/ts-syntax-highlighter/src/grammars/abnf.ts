import type { Grammar } from '../types'

export const abnfGrammar: Grammar = {
  name: 'ABNF',
  scopeName: 'source.abnf',
  keywords: {},
  patterns: [{ include: '#rules' }, { include: '#comments' }],
  repository: {
    rules: { patterns: [{ name: 'entity.name.type.abnf', match: '^[a-zA-Z][a-zA-Z0-9-]*(?=\\s*=)' }, { name: 'keyword.operator.abnf', match: '=' }] },
    comments: { patterns: [{ name: 'comment.line.semicolon.abnf', match: ';.*$' }] },
  },
}
