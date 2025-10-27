import type { Grammar } from '../types'

export const nginxGrammar: Grammar = {
  name: 'Nginx',
  scopeName: 'source.nginx',
  keywords: {},
  patterns: [{ include: '#comments' }, { include: '#directives' }, { include: '#blocks' }, { include: '#variables' }, { include: '#strings' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.nginx', match: '#.*$' }] },
    directives: { patterns: [{ name: 'keyword.other.directive.nginx', match: '\\b(server|location|listen|root|index|proxy_pass|return|rewrite|try_files|add_header|set|if|access_log|error_log)\\b' }] },
    blocks: { patterns: [{ name: 'entity.name.section.nginx', match: '\\b(http|server|location|upstream|events)\\b' }] },
    variables: { patterns: [{ name: 'variable.other.nginx', match: '\\$[a-zA-Z_][a-zA-Z0-9_]*' }] },
    strings: { patterns: [{ name: 'string.quoted.double.nginx', begin: '"', end: '"' }, { name: 'string.quoted.single.nginx', begin: "'", end: "'" }] },
  },
}
