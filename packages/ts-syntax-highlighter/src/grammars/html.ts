import type { Grammar } from '../types'

export const htmlGrammar: Grammar = {
  name: 'HTML',
  scopeName: 'text.html.basic',
  patterns: [
    { include: '#comments' },
    { include: '#tags' },
    { include: '#entities' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.block.html',
          begin: '<!--',
          end: '-->',
        },
      ],
    },
    tags: {
      patterns: [
        {
          name: 'meta.tag.html',
          begin: '(<)(script|style|template)\\b',
          beginCaptures: {
            '1': { name: 'punctuation.definition.tag.begin.html' },
            '2': { name: 'entity.name.tag.html' },
          },
          end: '(</)(\\2)(>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.begin.html' },
            '2': { name: 'entity.name.tag.html' },
            '3': { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            { include: '#tag-stuff' },
          ],
        },
        {
          name: 'meta.tag.html',
          begin: '(<)([a-zA-Z0-9:-]+)',
          beginCaptures: {
            '1': { name: 'punctuation.definition.tag.begin.html' },
            '2': { name: 'entity.name.tag.html' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.end.html' },
            '2': { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            { include: '#tag-stuff' },
          ],
        },
        {
          name: 'meta.tag.html',
          begin: '(</)([a-zA-Z0-9:-]+)',
          beginCaptures: {
            '1': { name: 'punctuation.definition.tag.begin.html' },
            '2': { name: 'entity.name.tag.html' },
          },
          end: '(>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.end.html' },
          },
        },
      ],
    },
    'tag-stuff': {
      patterns: [
        {
          name: 'entity.other.attribute-name.html',
          match: '\\b([a-zA-Z-:]+)',
        },
        {
          name: 'string.quoted.double.html',
          begin: '"',
          end: '"',
        },
        {
          name: 'string.quoted.single.html',
          begin: '\'',
          end: '\'',
        },
      ],
    },
    entities: {
      patterns: [
        {
          name: 'constant.character.entity.html',
          match: '&[a-zA-Z0-9]+;',
        },
        {
          name: 'constant.character.entity.html',
          match: '&#[0-9]+;',
        },
      ],
    },
  },
}
