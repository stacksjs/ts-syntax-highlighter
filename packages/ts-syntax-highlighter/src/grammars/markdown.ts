import type { Grammar } from '../types'

export const markdownGrammar: Grammar = {
  name: 'Markdown',
  scopeName: 'text.html.markdown',
  keywords: {},
  patterns: [
    { include: '#heading' },
    { include: '#code-block' },
    { include: '#code-inline' },
    { include: '#bold' },
    { include: '#italic' },
    { include: '#strikethrough' },
    { include: '#link' },
    { include: '#image' },
    { include: '#list' },
    { include: '#blockquote' },
    { include: '#horizontal-rule' },
    { include: '#table' },
  ],
  repository: {
    'heading': {
      patterns: [
        {
          name: 'markup.heading.markdown',
          match: '^(#{1,6})\\s+(.+)$',
          captures: {
            1: { name: 'markup.heading.marker.markdown' },
            2: { name: 'markup.heading.content.markdown' },
          },
        },
        {
          name: 'markup.heading.setext.markdown',
          match: '^(=+|-+)$',
        },
      ],
    },
    'code-block': {
      patterns: [
        {
          name: 'markup.fenced_code.block.markdown',
          begin: '^```([a-zA-Z0-9]*)',
          end: '^```',
          captures: {
            1: { name: 'entity.name.function.markdown' },
          },
          contentName: 'markup.raw.code.markdown',
        },
        {
          name: 'markup.raw.code.markdown',
          match: '^(    |\\t)(.*)$',
        },
      ],
    },
    'code-inline': {
      patterns: [
        {
          name: 'markup.inline.raw.markdown',
          match: '`[^`]+`',
        },
      ],
    },
    'bold': {
      patterns: [
        {
          name: 'markup.bold.markdown',
          match: '(\\*\\*|__)(?=\\S)(.+?[*_]*)(?<=\\S)\\1',
          captures: {
            1: { name: 'punctuation.definition.bold.markdown' },
            2: { name: 'markup.bold.content.markdown' },
          },
        },
      ],
    },
    'italic': {
      patterns: [
        {
          name: 'markup.italic.markdown',
          match: '(\\*|_)(?=\\S)(.+?)(?<=\\S)\\1',
          captures: {
            1: { name: 'punctuation.definition.italic.markdown' },
            2: { name: 'markup.italic.content.markdown' },
          },
        },
      ],
    },
    'strikethrough': {
      patterns: [
        {
          name: 'markup.strikethrough.markdown',
          match: '~~(.+?)~~',
          captures: {
            1: { name: 'markup.strikethrough.content.markdown' },
          },
        },
      ],
    },
    'link': {
      patterns: [
        {
          name: 'meta.link.inline.markdown',
          match: '\\[([^\\]]+)\\]\\(([^)]+)\\)',
          captures: {
            1: { name: 'string.other.link.title.markdown' },
            2: { name: 'markup.underline.link.markdown' },
          },
        },
        {
          name: 'meta.link.reference.markdown',
          match: '\\[([^\\]]+)\\]\\[([^\\]]+)\\]',
          captures: {
            1: { name: 'string.other.link.title.markdown' },
            2: { name: 'constant.other.reference.link.markdown' },
          },
        },
      ],
    },
    'image': {
      patterns: [
        {
          name: 'meta.image.inline.markdown',
          match: '!\\[([^\\]]*)\\]\\(([^)]+)\\)',
          captures: {
            1: { name: 'string.other.link.description.markdown' },
            2: { name: 'markup.underline.link.image.markdown' },
          },
        },
      ],
    },
    'list': {
      patterns: [
        {
          name: 'markup.list.unnumbered.markdown',
          match: '^\\s*([-*+])\\s+',
          captures: {
            1: { name: 'punctuation.definition.list.markdown' },
          },
        },
        {
          name: 'markup.list.numbered.markdown',
          match: '^\\s*(\\d+\\.)\\s+',
          captures: {
            1: { name: 'punctuation.definition.list.markdown' },
          },
        },
      ],
    },
    'blockquote': {
      patterns: [
        {
          name: 'markup.quote.markdown',
          match: '^\\s*>\\s*(.*)$',
          captures: {
            1: { name: 'markup.quote.content.markdown' },
          },
        },
      ],
    },
    'horizontal-rule': {
      patterns: [
        {
          name: 'meta.separator.markdown',
          match: '^\\s*([-*_]){3,}\\s*$',
        },
      ],
    },
    'table': {
      patterns: [
        {
          name: 'markup.table.markdown',
          match: '^\\|(.+)\\|$',
        },
        {
          name: 'markup.table.delimiter.markdown',
          match: '^\\|([:\\-\\s|]+)\\|$',
        },
      ],
    },
  },
}
