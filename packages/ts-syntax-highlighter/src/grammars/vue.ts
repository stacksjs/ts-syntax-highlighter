import type { Grammar } from '../types'

export const vueGrammar: Grammar = {
  name: 'Vue',
  scopeName: 'source.vue',
  keywords: {},
  patterns: [
    { include: '#template' },
    { include: '#script' },
    { include: '#style' },
    { include: '#comments' },
  ],
  repository: {
    template: {
      patterns: [
        {
          name: 'meta.tag.template.vue',
          begin: '<template>',
          end: '</template>',
          patterns: [
            { name: 'entity.other.attribute-name.vue', match: 'v-[a-z-]+' },
            { name: 'entity.other.attribute-name.vue', match: '@[a-z]+' },
            { name: 'entity.other.attribute-name.vue', match: ':[a-z-]+' },
            { name: 'meta.embedded.expression.vue', begin: '\\{\\{', end: '\\}\\}' },
          ],
        },
      ],
    },
    script: {
      patterns: [
        { name: 'meta.tag.script.vue', begin: '<script.*?>', end: '</script>' },
      ],
    },
    style: {
      patterns: [
        { name: 'meta.tag.style.vue', begin: '<style.*?>', end: '</style>' },
      ],
    },
    comments: {
      patterns: [
        { name: 'comment.block.html.vue', begin: '<!--', end: '-->' },
      ],
    },
  },
}
