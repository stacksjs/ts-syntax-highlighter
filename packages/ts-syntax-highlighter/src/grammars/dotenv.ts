import type { Grammar } from '../types'

const key = '[A-Za-z_][A-Za-z0-9_.-]*'
const variable = { name: 'variable.other.interpolation.dotenv', match: '\\$(?:\\{[A-Za-z_][A-Za-z0-9_]*\\}|[A-Za-z_][A-Za-z0-9_]*)' }

export const dotenvGrammar: Grammar = {
  name: 'Dotenv',
  scopeName: 'source.dotenv',
  fastPaths: false,
  patterns: [
    { name: 'comment.line.number-sign.dotenv', match: '#.*$' },
    {
      match: `^[\\t ]*(?:(export)[\\t ]+)?(${key})[\\t ]*(=)`,
      captures: {
        1: { name: 'keyword.control.export.dotenv' },
        2: { name: 'variable.other.key.dotenv' },
        3: { name: 'keyword.operator.assignment.dotenv' },
      },
    },
    {
      name: 'string.quoted.double.dotenv',
      begin: '"',
      end: '"',
      patterns: [{ name: 'constant.character.escape.dotenv', match: '\\\\.' }, variable],
    },
    { name: 'string.quoted.single.dotenv', begin: "'", end: "'" },
    { name: 'string.quoted.other.dotenv', begin: '`', end: '`' },
    variable,
    { name: 'string.unquoted.dotenv', match: '[^"\\x27\\x60#$\\s][^#$]*' },
  ],
}
