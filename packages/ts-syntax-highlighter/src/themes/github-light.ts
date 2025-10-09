import type { Theme } from '../types'

export const githubLight: Theme = {
  name: 'GitHub Light',
  type: 'light',
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#24292f',
    'editor.lineHighlightBackground': '#f6f8fa',
    'editor.selectionBackground': '#b6d4fe',
  },
  tokenColors: [
    {
      name: 'Comment',
      scope: ['comment', 'comment.line', 'comment.block'],
      settings: {
        foreground: '#6e7781',
        fontStyle: 'italic',
      },
    },
    {
      name: 'String',
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: '#0a3069',
      },
    },
    {
      name: 'Template String',
      scope: ['string.template'],
      settings: {
        foreground: '#0a3069',
      },
    },
    {
      name: 'Number',
      scope: ['constant.numeric'],
      settings: {
        foreground: '#0550ae',
      },
    },
    {
      name: 'Keyword',
      scope: ['keyword', 'keyword.control', 'keyword.operator'],
      settings: {
        foreground: '#cf222e',
      },
    },
    {
      name: 'Storage Type',
      scope: ['storage.type', 'storage.modifier'],
      settings: {
        foreground: '#cf222e',
      },
    },
    {
      name: 'Function',
      scope: ['entity.name.function', 'support.function'],
      settings: {
        foreground: '#8250df',
      },
    },
    {
      name: 'Class',
      scope: ['entity.name.type', 'entity.name.class'],
      settings: {
        foreground: '#953800',
      },
    },
    {
      name: 'Variable',
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: '#953800',
      },
    },
    {
      name: 'Constant',
      scope: ['constant.language', 'constant.character'],
      settings: {
        foreground: '#0550ae',
      },
    },
    {
      name: 'Tag',
      scope: ['entity.name.tag'],
      settings: {
        foreground: '#116329',
      },
    },
    {
      name: 'Attribute',
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: '#0550ae',
      },
    },
    {
      name: 'Punctuation',
      scope: ['punctuation'],
      settings: {
        foreground: '#24292f',
      },
    },
    {
      name: 'Operator',
      scope: ['keyword.operator'],
      settings: {
        foreground: '#cf222e',
      },
    },
    {
      name: 'CSS Property',
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: '#0550ae',
      },
    },
    {
      name: 'CSS Value',
      scope: ['support.constant.property-value.css'],
      settings: {
        foreground: '#0a3069',
      },
    },
    {
      name: 'Color',
      scope: ['constant.other.color'],
      settings: {
        foreground: '#0a3069',
      },
    },
  ],
}
