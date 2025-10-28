import type { Grammar } from '../types'

export const graphqlGrammar: Grammar = {
  name: 'GraphQL',
  scopeName: 'source.graphql',
  keywords: {
    query: 'keyword.operation.graphql',
    mutation: 'keyword.operation.graphql',
    subscription: 'keyword.operation.graphql',
    fragment: 'keyword.operation.graphql',
    type: 'keyword.type.graphql',
    interface: 'keyword.type.graphql',
    union: 'keyword.type.graphql',
    enum: 'keyword.type.graphql',
    input: 'keyword.type.graphql',
    scalar: 'keyword.type.graphql',
    schema: 'keyword.type.graphql',
    extend: 'keyword.type.graphql',
    implements: 'keyword.type.graphql',
    on: 'keyword.other.graphql',
    true: 'constant.language.graphql',
    false: 'constant.language.graphql',
    null: 'constant.language.graphql',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#directives' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.graphql', match: '#.*$' }] },
    strings: { patterns: [{ name: 'string.quoted.triple.graphql', begin: '"""', end: '"""' }, { name: 'string.quoted.double.graphql', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.graphql', match: '\\\\.' }] }] },
    keywords: { patterns: [{ name: 'keyword.operation.graphql', match: '\\b(query|mutation|subscription|fragment)\\b' }, { name: 'keyword.type.graphql', match: '\\b(type|interface|union|enum|input|scalar|schema|extend|implements)\\b' }, { name: 'constant.language.graphql', match: '\\b(true|false|null)\\b' }] },
    directives: { patterns: [{ name: 'entity.name.function.directive.graphql', match: '@[a-zA-Z_][a-zA-Z0-9_]*' }] },
  },
}
