import type { Grammar } from '../types'

export const diffGrammar: Grammar = {
  name: 'Diff',
  scopeName: 'source.diff',
  keywords: {},
  patterns: [
    { include: '#file-header' },
    { include: '#hunk-header' },
    { include: '#added-line' },
    { include: '#removed-line' },
    { include: '#context-line' },
    { include: '#metadata' },
  ],
  repository: {
    'file-header': {
      patterns: [
        {
          name: 'meta.diff.header.from-file',
          match: '^(---\\s+)(.*)$',
          captures: {
            '1': { name: 'punctuation.definition.from-file.diff' },
            '2': { name: 'meta.diff.header.from-path' },
          },
        },
        {
          name: 'meta.diff.header.to-file',
          match: '^(\\+\\+\\+\\s+)(.*)$',
          captures: {
            '1': { name: 'punctuation.definition.to-file.diff' },
            '2': { name: 'meta.diff.header.to-path' },
          },
        },
        {
          name: 'meta.diff.header.git',
          match: '^diff --git.*$',
        },
      ],
    },
    'hunk-header': {
      patterns: [
        {
          name: 'meta.diff.range.unified',
          match: '^(@@)\\s+(-\\d+,\\d+\\s+\\+\\d+,\\d+)\\s+(@@)(.*)$',
          captures: {
            '1': { name: 'punctuation.definition.range.diff' },
            '2': { name: 'meta.diff.range.context' },
            '3': { name: 'punctuation.definition.range.diff' },
            '4': { name: 'entity.name.function.diff' },
          },
        },
      ],
    },
    'added-line': {
      patterns: [
        {
          name: 'markup.inserted.diff',
          match: '^\\+.*$',
        },
      ],
    },
    'removed-line': {
      patterns: [
        {
          name: 'markup.deleted.diff',
          match: '^-.*$',
        },
      ],
    },
    'context-line': {
      patterns: [
        {
          name: 'meta.diff.context',
          match: '^ .*$',
        },
      ],
    },
    metadata: {
      patterns: [
        {
          name: 'meta.diff.index',
          match: '^index [0-9a-f]+\\.\\.[0-9a-f]+.*$',
        },
        {
          name: 'meta.diff.mode',
          match: '^(new|deleted) file mode \\d+$',
        },
      ],
    },
  },
}
