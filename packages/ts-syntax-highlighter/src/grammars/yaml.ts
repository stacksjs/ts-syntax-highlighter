import type { Grammar } from '../types'

export const yamlGrammar: Grammar = {
  name: 'YAML',
  scopeName: 'source.yaml',
  keywords: {
    true: 'constant.language.boolean.yaml',
    false: 'constant.language.boolean.yaml',
    null: 'constant.language.null.yaml',
    True: 'constant.language.boolean.yaml',
    False: 'constant.language.boolean.yaml',
    TRUE: 'constant.language.boolean.yaml',
    FALSE: 'constant.language.boolean.yaml',
    yes: 'constant.language.boolean.yaml',
    no: 'constant.language.boolean.yaml',
    Yes: 'constant.language.boolean.yaml',
    No: 'constant.language.boolean.yaml',
    YES: 'constant.language.boolean.yaml',
    NO: 'constant.language.boolean.yaml',
    on: 'constant.language.boolean.yaml',
    off: 'constant.language.boolean.yaml',
  },
  patterns: [
    { include: '#comments' },
    { include: '#document-markers' },
    { include: '#keys' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#constants' },
    { include: '#anchors' },
    { include: '#tags' },
  ],
  repository: {
    'comments': {
      patterns: [
        {
          name: 'comment.line.number-sign.yaml',
          match: '#.*$',
        },
      ],
    },
    'document-markers': {
      patterns: [
        {
          name: 'entity.other.document.begin.yaml',
          match: '^---',
        },
        {
          name: 'entity.other.document.end.yaml',
          match: '^\\.\\.\\.',
        },
      ],
    },
    'keys': {
      patterns: [
        {
          name: 'meta.key.yaml',
          match: '([a-zA-Z0-9_-]+)\\s*:',
          captures: {
            1: { name: 'entity.name.tag.yaml' },
          },
        },
        {
          name: 'string.quoted.yaml',
          match: '(["\'])([a-zA-Z0-9_-]+)\\1\\s*:',
          captures: {
            2: { name: 'entity.name.tag.yaml' },
          },
        },
      ],
    },
    'strings': {
      patterns: [
        {
          name: 'string.quoted.double.yaml',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.yaml',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.yaml',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.yaml',
              match: '\'\'',
            },
          ],
        },
        {
          name: 'string.unquoted.block.yaml',
          match: '[|>][-+]?\\s*$',
        },
      ],
    },
    'numbers': {
      patterns: [
        {
          name: 'constant.numeric.yaml',
          match: '\\b[-+]?(0x[0-9a-fA-F]+|0o[0-7]+|[0-9]+\\.?[0-9]*([eE][-+]?[0-9]+)?)\\b',
        },
      ],
    },
    'constants': {
      patterns: [
        {
          name: 'constant.language.yaml',
          match: '\\b(true|false|null|True|False|TRUE|FALSE|yes|no|Yes|No|YES|NO|on|off)\\b',
        },
      ],
    },
    'anchors': {
      patterns: [
        {
          name: 'entity.name.type.anchor.yaml',
          match: '&[a-zA-Z0-9_-]+',
        },
        {
          name: 'variable.other.alias.yaml',
          match: '\\*[a-zA-Z0-9_-]+',
        },
      ],
    },
    'tags': {
      patterns: [
        {
          name: 'storage.type.tag.yaml',
          match: '!![a-zA-Z0-9_-]+',
        },
        {
          name: 'storage.type.tag.yaml',
          match: '![a-zA-Z0-9_-]+',
        },
      ],
    },
  },
}
