import type { Grammar } from '../types'

export const cssGrammar: Grammar = {
  name: 'CSS',
  scopeName: 'source.css',
  patterns: [
    { include: '#comments' },
    { include: '#at-rules' },
    { include: '#selectors' },
    { include: '#properties' },
    { include: '#functions' },
    { include: '#variables' },
    { include: '#values' },
    { include: '#strings' },
    { include: '#numbers' },
    { include: '#colors' },
    { include: '#punctuation' },
  ],
  repository: {
    'comments': {
      patterns: [
        {
          name: 'comment.block.css',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    'at-rules': {
      patterns: [
        {
          name: 'keyword.control.at-rule.css',
          match: '@(media|import|charset|namespace|keyframes|font-face|supports|page|document|viewport|counter-style|font-feature-values|property|layer|container)\\b',
        },
      ],
    },
    'selectors': {
      patterns: [
        {
          name: 'entity.name.tag.css',
          match: '\\b(a|abbr|address|article|aside|audio|b|blockquote|body|button|canvas|caption|cite|code|div|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|html|i|iframe|img|input|label|legend|li|main|nav|ol|p|pre|section|select|span|strong|table|tbody|td|textarea|tfoot|th|thead|tr|ul|video)\\b',
        },
        {
          name: 'entity.other.attribute-name.class.css',
          match: '\\.[a-zA-Z_-][a-zA-Z0-9_-]*',
        },
        {
          name: 'entity.other.attribute-name.id.css',
          match: '#[a-zA-Z_-][a-zA-Z0-9_-]*',
        },
        {
          name: 'entity.other.attribute-name.pseudo-class.css',
          match: ':[a-zA-Z_-][a-zA-Z0-9_-]*',
        },
        {
          name: 'entity.other.attribute-name.pseudo-element.css',
          match: '::[a-zA-Z_-][a-zA-Z0-9_-]*',
        },
      ],
    },
    'properties': {
      patterns: [
        {
          name: 'support.type.property-name.css',
          match: '\\b(align-items|background|border|color|display|flex|font|height|justify-content|margin|padding|position|width|z-index|animation|box-shadow|cursor|font-family|font-size|font-weight|grid|line-height|opacity|overflow|text-align|text-decoration|transform|transition|visibility)(-[a-z]+)?\\b',
        },
      ],
    },
    'values': {
      patterns: [
        {
          name: 'support.constant.property-value.css',
          match: '\\b(auto|block|inline|flex|grid|none|center|left|right|top|bottom|absolute|relative|fixed|sticky|hidden|visible|bold|normal|italic|underline|solid|dotted|dashed)\\b',
        },
      ],
    },
    'strings': {
      patterns: [
        {
          name: 'string.quoted.double.css',
          begin: '"',
          end: '"',
        },
        {
          name: 'string.quoted.single.css',
          begin: '\'',
          end: '\'',
        },
      ],
    },
    'numbers': {
      patterns: [
        {
          name: 'constant.numeric.css',
          match: '\\b\\d+(\\.\\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|deg|rad|turn|s|ms)?\\b',
        },
      ],
    },
    'colors': {
      patterns: [
        {
          name: 'constant.other.color.css',
          match: '#[0-9a-fA-F]{3,8}\\b',
        },
        {
          name: 'support.function.color.css',
          match: '\\b(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\\s*\\(',
        },
      ],
    },
    'functions': {
      patterns: [
        {
          name: 'support.function.css',
          match: '\\b(var|calc|min|max|clamp|round|abs|sign|mod|rem|sin|cos|tan|asin|acos|atan|atan2|pow|sqrt|hypot|log|exp|url|attr|counter|counters|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient)\\s*\\(',
        },
      ],
    },
    'variables': {
      patterns: [
        {
          name: 'variable.other.custom-property.css',
          match: '--[a-zA-Z0-9_-]+',
        },
      ],
    },
    'punctuation': {
      patterns: [
        {
          name: 'punctuation.css',
          match: '[{}();:,]',
        },
      ],
    },
  },
}
