import type { Grammar } from '../types'

export const cmdGrammar: Grammar = {
  name: 'Batch',
  scopeName: 'source.cmd',
  keywords: {
    'if': 'keyword.control.cmd', 'else': 'keyword.control.cmd', 'for': 'keyword.control.cmd', 'do': 'keyword.control.cmd',
    'goto': 'keyword.control.cmd', 'call': 'keyword.control.cmd', 'exit': 'keyword.control.cmd', 'echo': 'support.function.cmd',
    'set': 'support.function.cmd', 'setlocal': 'support.function.cmd', 'endlocal': 'support.function.cmd',
  },
  patterns: [{ include: '#comments' }, { include: '#variables' }, { include: '#labels' }, { include: '#keywords' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.rem.cmd', match: '^\\s*[Rr][Ee][Mm]\\b.*$' }, { name: 'comment.line.colons.cmd', match: '^\\s*::.*$' }] },
    variables: { patterns: [{ name: 'variable.other.cmd', match: '%[a-zA-Z_][a-zA-Z0-9_]*%' }, { name: 'variable.other.cmd', match: '![a-zA-Z_][a-zA-Z0-9_]*!' }] },
    labels: { patterns: [{ name: 'entity.name.label.cmd', match: '^:[a-zA-Z_][a-zA-Z0-9_]*' }] },
    keywords: { patterns: [{ name: 'keyword.control.cmd', match: '\\b(if|else|for|do|goto|call|exit)\\b' }, { name: 'support.function.cmd', match: '\\b(echo|set|setlocal|endlocal)\\b' }] },
  },
}
