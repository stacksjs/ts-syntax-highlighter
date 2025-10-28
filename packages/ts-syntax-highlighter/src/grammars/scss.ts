import type { Grammar } from '../types'

export const scssGrammar: Grammar = {
  name: 'SCSS',
  scopeName: 'source.scss',
  keywords: {
    '@import': 'keyword.control.at-rule.scss',
    '@use': 'keyword.control.at-rule.scss',
    '@forward': 'keyword.control.at-rule.scss',
    '@mixin': 'keyword.control.at-rule.scss',
    '@include': 'keyword.control.at-rule.scss',
    '@function': 'keyword.control.at-rule.scss',
    '@return': 'keyword.control.at-rule.scss',
    '@extend': 'keyword.control.at-rule.scss',
    '@if': 'keyword.control.at-rule.scss',
    '@else': 'keyword.control.at-rule.scss',
    '@for': 'keyword.control.at-rule.scss',
    '@each': 'keyword.control.at-rule.scss',
    '@while': 'keyword.control.at-rule.scss',
    '@media': 'keyword.control.at-rule.scss',
    '@keyframes': 'keyword.control.at-rule.scss',
  },
  patterns: [
    { include: '#comments' },
    { include: '#at-rules' },
    { include: '#variables' },
    { include: '#strings' },
    { include: '#selectors' },
    { include: '#properties' },
  ],
  repository: {
    'comments': {
      patterns: [
        { name: 'comment.line.double-slash.scss', match: '\\/\\/.*$' },
        { name: 'comment.block.scss', begin: '\\/\\*', end: '\\*\\/' },
      ],
    },
    'at-rules': {
      patterns: [
        { name: 'keyword.control.at-rule.scss', match: '@[a-z-]+' },
      ],
    },
    'variables': {
      patterns: [
        { name: 'variable.scss', match: '\\$[a-zA-Z_-][a-zA-Z0-9_-]*' },
      ],
    },
    'strings': {
      patterns: [
        { name: 'string.quoted.double.scss', begin: '"', end: '"' },
        { name: 'string.quoted.single.scss', begin: '\'', end: '\'' },
      ],
    },
    'selectors': {
      patterns: [
        { name: 'entity.name.tag.scss', match: '\\b[a-z][a-z0-9-]*\\b' },
        { name: 'entity.other.attribute-name.class.scss', match: '\\.[a-zA-Z_-][a-zA-Z0-9_-]*' },
        { name: 'entity.other.attribute-name.id.scss', match: '#[a-zA-Z_-][a-zA-Z0-9_-]*' },
      ],
    },
    'properties': {
      patterns: [
        { name: 'support.type.property-name.scss', match: '\\b[a-z-]+(?=\\s*:)' },
      ],
    },
  },
}
