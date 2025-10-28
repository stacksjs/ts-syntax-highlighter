import type { Grammar } from '../types'

export const makefileGrammar: Grammar = {
  name: 'Makefile',
  scopeName: 'source.makefile',
  keywords: {
    ifeq: 'keyword.control.makefile',
    ifneq: 'keyword.control.makefile',
    ifdef: 'keyword.control.makefile',
    ifndef: 'keyword.control.makefile',
    else: 'keyword.control.makefile',
    endif: 'keyword.control.makefile',
    include: 'keyword.control.makefile',
    define: 'keyword.control.makefile',
    endef: 'keyword.control.makefile',
  },
  patterns: [{ include: '#comments' }, { include: '#targets' }, { include: '#variables' }, { include: '#directives' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.makefile', match: '#.*$' }] },
    targets: { patterns: [{ name: 'entity.name.function.target.makefile', match: '^[a-zA-Z0-9._-]+(?=:)' }] },
    variables: { patterns: [{ name: 'variable.other.makefile', match: '\\$[({][a-zA-Z0-9_]+[})]' }, { name: 'variable.other.makefile', match: '\\$[a-zA-Z0-9_]' }] },
    directives: { patterns: [{ name: 'keyword.control.makefile', match: '^\\s*(ifeq|ifneq|ifdef|ifndef|else|endif|include|define|endef)\\b' }] },
  },
}
