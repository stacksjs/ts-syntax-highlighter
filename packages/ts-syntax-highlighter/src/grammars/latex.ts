import type { Grammar } from '../types'

export const latexGrammar: Grammar = {
  name: 'LaTeX',
  scopeName: 'text.tex.latex',
  keywords: {},
  patterns: [{ include: '#comments' }, { include: '#commands' }, { include: '#environments' }, { include: '#math' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.percentage.latex', match: '%.*$' }] },
    commands: { patterns: [{ name: 'support.function.latex', match: '\\\\[a-zA-Z]+' }] },
    environments: { patterns: [{ name: 'meta.environment.latex', begin: '\\\\begin\\{([a-zA-Z]+)\\}', beginCaptures: { 0: { name: 'support.function.latex' }, 1: { name: 'variable.parameter.latex' } }, end: '\\\\end\\{\\1\\}', endCaptures: { 0: { name: 'support.function.latex' } } }] },
    math: { patterns: [{ name: 'string.other.math.latex', begin: '\\$\\$', end: '\\$\\$' }, { name: 'string.other.math.latex', begin: '\\$', end: '\\$' }] },
  },
}
