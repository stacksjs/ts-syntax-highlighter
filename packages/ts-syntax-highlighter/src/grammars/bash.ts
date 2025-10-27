import type { Grammar } from '../types'

export const bashGrammar: Grammar = {
  name: 'Bash',
  scopeName: 'source.bash',
  keywords: {
    // Control flow
    'if': 'keyword.control.bash',
    'then': 'keyword.control.bash',
    'else': 'keyword.control.bash',
    'elif': 'keyword.control.bash',
    'fi': 'keyword.control.bash',
    'case': 'keyword.control.bash',
    'esac': 'keyword.control.bash',
    'for': 'keyword.control.bash',
    'while': 'keyword.control.bash',
    'until': 'keyword.control.bash',
    'do': 'keyword.control.bash',
    'done': 'keyword.control.bash',
    'in': 'keyword.control.bash',
    'select': 'keyword.control.bash',
    // Keywords
    'function': 'storage.type.function.bash',
    'declare': 'storage.type.bash',
    'local': 'storage.type.bash',
    'export': 'storage.type.bash',
    'readonly': 'storage.type.bash',
    'typeset': 'storage.type.bash',
    // Built-in commands
    'echo': 'support.function.builtin.bash',
    'printf': 'support.function.builtin.bash',
    'read': 'support.function.builtin.bash',
    'cd': 'support.function.builtin.bash',
    'pwd': 'support.function.builtin.bash',
    'exit': 'support.function.builtin.bash',
    'return': 'support.function.builtin.bash',
    'source': 'support.function.builtin.bash',
    'test': 'support.function.builtin.bash',
    'eval': 'support.function.builtin.bash',
    'exec': 'support.function.builtin.bash',
    'shift': 'support.function.builtin.bash',
    'set': 'support.function.builtin.bash',
    'unset': 'support.function.builtin.bash',
    'alias': 'support.function.builtin.bash',
    'unalias': 'support.function.builtin.bash',
    // Constants
    'true': 'constant.language.bash',
    'false': 'constant.language.bash',
  },
  patterns: [
    { include: '#strings' },
    { include: '#variables' },
    { include: '#comments' },
    { include: '#keywords' },
    { include: '#functions' },
    { include: '#operators' },
    { include: '#numbers' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.number-sign.bash',
          match: '#.*$',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.bash',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.bash',
              match: '\\\\[\\\\"`$\\n]',
            },
            { include: '#variables' },
            {
              name: 'variable.other.subshell.bash',
              begin: '\\$\\(',
              end: '\\)',
            },
            {
              name: 'variable.other.backtick.bash',
              begin: '`',
              end: '`',
            },
          ],
        },
        {
          name: 'string.quoted.single.bash',
          begin: "'",
          end: "'",
        },
        {
          name: 'string.unquoted.heredoc.bash',
          begin: '<<-?\\s*([\'"]?)(\\w+)\\1',
          end: '^\\2$',
        },
      ],
    },
    variables: {
      patterns: [
        {
          name: 'variable.other.bracket.bash',
          match: '\\$\\{[^}]+\\}',
        },
        {
          name: 'variable.other.normal.bash',
          match: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
        },
        {
          name: 'variable.other.positional.bash',
          match: '\\$[0-9@*#?$!-]',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.bash',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\(\\)',
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.bash',
          match: '\\b(if|then|else|elif|fi|case|esac|for|while|until|do|done|in|select)\\b',
        },
        {
          name: 'storage.type.bash',
          match: '\\b(function|declare|local|export|readonly|typeset)\\b',
        },
        {
          name: 'support.function.builtin.bash',
          match: '\\b(echo|printf|read|cd|pwd|exit|return|source|test|eval|exec|shift|set|unset|alias|unalias)\\b',
        },
        {
          name: 'constant.language.bash',
          match: '\\b(true|false)\\b',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.logical.bash',
          match: '(&&|\\|\\||!)',
        },
        {
          name: 'keyword.operator.pipe.bash',
          match: '\\|',
        },
        {
          name: 'keyword.operator.redirect.bash',
          match: '(>>|>|<<|<|&>|&>>|2>|2>>)',
        },
        {
          name: 'keyword.operator.assignment.bash',
          match: '=',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.bash',
          match: '\\b[0-9]+\\b',
        },
      ],
    },
  },
}
