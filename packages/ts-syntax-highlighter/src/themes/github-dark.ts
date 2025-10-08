import type { Theme } from '../types'

export const githubDark: Theme = {
  name: 'GitHub Dark',
  type: 'dark',
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#c9d1d9',
    'editor.lineHighlightBackground': '#161b22',
    'editor.selectionBackground': '#264f78',
  },
  tokenColors: [
    {
      name: 'Comment',
      scope: ['comment', 'comment.line', 'comment.block'],
      settings: {
        foreground: '#8b949e',
        fontStyle: 'italic',
      },
    },
    {
      name: 'String',
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: '#a5d6ff',
      },
    },
    {
      name: 'Template String',
      scope: ['string.template'],
      settings: {
        foreground: '#a5d6ff',
      },
    },
    {
      name: 'Number',
      scope: ['constant.numeric'],
      settings: {
        foreground: '#79c0ff',
      },
    },
    {
      name: 'Keyword',
      scope: ['keyword', 'keyword.control', 'keyword.operator'],
      settings: {
        foreground: '#ff7b72',
      },
    },
    {
      name: 'Storage Type',
      scope: ['storage.type', 'storage.modifier'],
      settings: {
        foreground: '#ff7b72',
      },
    },
    {
      name: 'Function',
      scope: ['entity.name.function', 'support.function'],
      settings: {
        foreground: '#d2a8ff',
      },
    },
    {
      name: 'Class',
      scope: ['entity.name.type', 'entity.name.class'],
      settings: {
        foreground: '#ffa657',
      },
    },
    {
      name: 'Variable',
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: '#ffa657',
      },
    },
    {
      name: 'Constant',
      scope: ['constant.language', 'constant.character'],
      settings: {
        foreground: '#79c0ff',
      },
    },
    {
      name: 'Tag',
      scope: ['entity.name.tag'],
      settings: {
        foreground: '#7ee787',
      },
    },
    {
      name: 'Attribute',
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: '#79c0ff',
      },
    },
    {
      name: 'Punctuation',
      scope: ['punctuation'],
      settings: {
        foreground: '#c9d1d9',
      },
    },
    {
      name: 'Operator',
      scope: ['keyword.operator'],
      settings: {
        foreground: '#ff7b72',
      },
    },
    {
      name: 'CSS Property',
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: '#79c0ff',
      },
    },
    {
      name: 'CSS Value',
      scope: ['support.constant.property-value.css'],
      settings: {
        foreground: '#a5d6ff',
      },
    },
    {
      name: 'Color',
      scope: ['constant.other.color'],
      settings: {
        foreground: '#a5d6ff',
      },
    },
  ],
}
