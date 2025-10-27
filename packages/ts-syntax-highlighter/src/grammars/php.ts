import type { Grammar } from '../types'

export const phpGrammar: Grammar = {
  name: 'PHP',
  scopeName: 'source.php',
  keywords: {
    // Control flow
    'if': 'keyword.control.php',
    'else': 'keyword.control.php',
    'elseif': 'keyword.control.php',
    'endif': 'keyword.control.php',
    'for': 'keyword.control.php',
    'foreach': 'keyword.control.php',
    'endfor': 'keyword.control.php',
    'endforeach': 'keyword.control.php',
    'while': 'keyword.control.php',
    'endwhile': 'keyword.control.php',
    'do': 'keyword.control.php',
    'switch': 'keyword.control.php',
    'case': 'keyword.control.php',
    'default': 'keyword.control.php',
    'endswitch': 'keyword.control.php',
    'break': 'keyword.control.php',
    'continue': 'keyword.control.php',
    'return': 'keyword.control.php',
    'goto': 'keyword.control.php',
    'try': 'keyword.control.php',
    'catch': 'keyword.control.php',
    'finally': 'keyword.control.php',
    'throw': 'keyword.control.php',
    'match': 'keyword.control.php',
    // Declarations
    'function': 'storage.type.function.php',
    'class': 'storage.type.class.php',
    'interface': 'storage.type.interface.php',
    'trait': 'storage.type.trait.php',
    'enum': 'storage.type.enum.php',
    'namespace': 'storage.type.namespace.php',
    'use': 'keyword.other.use.php',
    'extends': 'storage.modifier.extends.php',
    'implements': 'storage.modifier.implements.php',
    // Modifiers
    'public': 'storage.modifier.php',
    'private': 'storage.modifier.php',
    'protected': 'storage.modifier.php',
    'static': 'storage.modifier.php',
    'final': 'storage.modifier.php',
    'abstract': 'storage.modifier.php',
    'readonly': 'storage.modifier.php',
    // Constants
    'true': 'constant.language.php',
    'false': 'constant.language.php',
    'null': 'constant.language.php',
    'TRUE': 'constant.language.php',
    'FALSE': 'constant.language.php',
    'NULL': 'constant.language.php',
    'this': 'variable.language.php',
    'parent': 'variable.language.php',
    'self': 'variable.language.php',
    // Operators
    'new': 'keyword.operator.new.php',
    'clone': 'keyword.operator.clone.php',
    'instanceof': 'keyword.operator.instanceof.php',
    'and': 'keyword.operator.logical.php',
    'or': 'keyword.operator.logical.php',
    'xor': 'keyword.operator.logical.php',
    // Other
    'echo': 'support.function.construct.php',
    'print': 'support.function.construct.php',
    'require': 'keyword.control.import.php',
    'require_once': 'keyword.control.import.php',
    'include': 'keyword.control.import.php',
    'include_once': 'keyword.control.import.php',
    'die': 'keyword.control.php',
    'exit': 'keyword.control.php',
    'isset': 'support.function.construct.php',
    'empty': 'support.function.construct.php',
    'unset': 'support.function.construct.php',
    'yield': 'keyword.control.php',
    'yield from': 'keyword.control.php',
    'declare': 'keyword.control.php',
    'const': 'storage.type.const.php',
    'var': 'storage.type.var.php',
    'global': 'storage.modifier.php',
  },
  patterns: [
    { include: '#php-tags' },
    { include: '#comments' },
    { include: '#strings' },
    { include: '#heredoc' },
    { include: '#keywords' },
    { include: '#variables' },
    { include: '#functions' },
    { include: '#numbers' },
    { include: '#operators' },
  ],
  repository: {
    'php-tags': {
      patterns: [
        {
          name: 'meta.embedded.block.php',
          begin: '<\\?(?:php|=)?',
          beginCaptures: {
            '0': { name: 'punctuation.section.embedded.begin.php' },
          },
          end: '\\?>',
          endCaptures: {
            '0': { name: 'punctuation.section.embedded.end.php' },
          },
          patterns: [
            { include: '#comments' },
            { include: '#strings' },
            { include: '#heredoc' },
            { include: '#keywords' },
            { include: '#variables' },
            { include: '#functions' },
            { include: '#numbers' },
            { include: '#operators' },
          ],
        },
      ],
    },
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.php',
          match: '\\/\\/.*$',
        },
        {
          name: 'comment.line.number-sign.php',
          match: '#.*$',
        },
        {
          name: 'comment.block.php',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.php',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.php',
              match: '\\\\.',
            },
            {
              name: 'variable.other.php',
              match: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
            },
            {
              name: 'meta.embedded.expression.php',
              begin: '\\{\\$',
              end: '\\}',
              patterns: [
                { include: '#variables' },
              ],
            },
          ],
        },
        {
          name: 'string.quoted.single.php',
          begin: "'",
          end: "'",
          patterns: [
            {
              name: 'constant.character.escape.php',
              match: "\\\\['\\\\]",
            },
          ],
        },
      ],
    },
    heredoc: {
      patterns: [
        {
          name: 'string.unquoted.heredoc.php',
          begin: '<<<(["\']?)([a-zA-Z_][a-zA-Z0-9_]*)\\1',
          end: '^\\2;?$',
          patterns: [
            {
              name: 'variable.other.php',
              match: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.php',
          match: '\\b(if|else|elseif|endif|for|foreach|endfor|endforeach|while|endwhile|do|switch|case|default|endswitch|break|continue|return|goto|try|catch|finally|throw|match|die|exit|yield|declare)\\b',
        },
        {
          name: 'storage.type.php',
          match: '\\b(function|class|interface|trait|enum|namespace|const|var)\\b',
        },
        {
          name: 'storage.modifier.php',
          match: '\\b(public|private|protected|static|final|abstract|readonly|global)\\b',
        },
        {
          name: 'keyword.other.php',
          match: '\\b(use|extends|implements)\\b',
        },
        {
          name: 'constant.language.php',
          match: '\\b(true|false|null|TRUE|FALSE|NULL)\\b',
        },
        {
          name: 'keyword.control.import.php',
          match: '\\b(require|require_once|include|include_once)\\b',
        },
      ],
    },
    variables: {
      patterns: [
        {
          name: 'variable.language.php',
          match: '\\$(?:this|GLOBALS|_GET|_POST|_REQUEST|_SESSION|_COOKIE|_SERVER|_FILES|_ENV)\\b',
        },
        {
          name: 'variable.other.php',
          match: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
        },
      ],
    },
    functions: {
      patterns: [
        {
          name: 'entity.name.function.php',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(?=\\()',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.php',
          match: '\\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)\\b',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.php',
          match: '(===|!==|==|!=|<=|>=|<>|<|>|\\+\\+|--|\\+|\\-|\\*|/|%|&&|\\|\\||!|\\.|=>|->|::|\\.=|\\+=|-=|\\*=|/=|%=|&=|\\|=|\\^=|<<=|>>=)',
        },
      ],
    },
  },
}
