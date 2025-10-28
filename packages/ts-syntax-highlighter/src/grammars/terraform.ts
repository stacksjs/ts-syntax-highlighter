import type { Grammar } from '../types'

export const terraformGrammar: Grammar = {
  name: 'Terraform',
  scopeName: 'source.terraform',
  keywords: {
    resource: 'keyword.other.terraform',
    data: 'keyword.other.terraform',
    variable: 'keyword.other.terraform',
    output: 'keyword.other.terraform',
    locals: 'keyword.other.terraform',
    module: 'keyword.other.terraform',
    provider: 'keyword.other.terraform',
    terraform: 'keyword.other.terraform',
    for: 'keyword.control.terraform',
    if: 'keyword.control.terraform',
    else: 'keyword.control.terraform',
    in: 'keyword.control.terraform',
    true: 'constant.language.terraform',
    false: 'constant.language.terraform',
    null: 'constant.language.terraform',
  },
  patterns: [{ include: '#comments' }, { include: '#strings' }, { include: '#keywords' }, { include: '#blocks' }],
  repository: {
    comments: { patterns: [{ name: 'comment.line.number-sign.terraform', match: '#.*$' }, { name: 'comment.line.double-slash.terraform', match: '\\/\\/.*$' }, { name: 'comment.block.terraform', begin: '\\/\\*', end: '\\*\\/' }] },
    strings: { patterns: [{ name: 'string.quoted.double.terraform', begin: '"', end: '"', patterns: [{ name: 'constant.character.escape.terraform', match: '\\\\.' }, { name: 'meta.interpolation.terraform', begin: '\\$\\{', end: '\\}' }] }] },
    keywords: { patterns: [{ name: 'keyword.other.terraform', match: '\\b(resource|data|variable|output|locals|module|provider|terraform)\\b' }, { name: 'keyword.control.terraform', match: '\\b(for|if|else|in)\\b' }, { name: 'constant.language.terraform', match: '\\b(true|false|null)\\b' }] },
    blocks: { patterns: [{ name: 'entity.name.type.terraform', match: '^\\s*(resource|data|variable|output|module|provider|terraform)\\s+"[^"]+"' }] },
  },
}
