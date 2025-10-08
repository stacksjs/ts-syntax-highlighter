import type { Theme } from '../types'

export const nord: Theme = {
  name: 'Nord',
  type: 'dark',
  colors: {
    'editor.background': '#2e3440',
    'editor.foreground': '#d8dee9',
    'editor.lineHighlightBackground': '#3b4252',
    'editor.selectionBackground': '#434c5e',
  },
  tokenColors: [
    {
      name: 'Comment',
      scope: ['comment', 'comment.line', 'comment.block'],
      settings: {
        foreground: '#616e88',
        fontStyle: 'italic',
      },
    },
    {
      name: 'String',
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: '#a3be8c',
      },
    },
    {
      name: 'Template String',
      scope: ['string.template'],
      settings: {
        foreground: '#a3be8c',
      },
    },
    {
      name: 'Number',
      scope: ['constant.numeric'],
      settings: {
        foreground: '#b48ead',
      },
    },
    {
      name: 'Keyword',
      scope: ['keyword', 'keyword.control', 'keyword.operator'],
      settings: {
        foreground: '#81a1c1',
      },
    },
    {
      name: 'Storage Type',
      scope: ['storage.type', 'storage.modifier'],
      settings: {
        foreground: '#81a1c1',
      },
    },
    {
      name: 'Function',
      scope: ['entity.name.function', 'support.function'],
      settings: {
        foreground: '#88c0d0',
      },
    },
    {
      name: 'Class',
      scope: ['entity.name.type', 'entity.name.class'],
      settings: {
        foreground: '#8fbcbb',
      },
    },
    {
      name: 'Variable',
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: '#d8dee9',
      },
    },
    {
      name: 'Constant',
      scope: ['constant.language', 'constant.character'],
      settings: {
        foreground: '#b48ead',
      },
    },
    {
      name: 'Tag',
      scope: ['entity.name.tag'],
      settings: {
        foreground: '#81a1c1',
      },
    },
    {
      name: 'Attribute',
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: '#8fbcbb',
      },
    },
    {
      name: 'Punctuation',
      scope: ['punctuation'],
      settings: {
        foreground: '#eceff4',
      },
    },
    {
      name: 'Operator',
      scope: ['keyword.operator'],
      settings: {
        foreground: '#81a1c1',
      },
    },
    {
      name: 'CSS Property',
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: '#8fbcbb',
      },
    },
    {
      name: 'CSS Value',
      scope: ['support.constant.property-value.css'],
      settings: {
        foreground: '#a3be8c',
      },
    },
    {
      name: 'Color',
      scope: ['constant.other.color'],
      settings: {
        foreground: '#b48ead',
      },
    },
  ],
}
