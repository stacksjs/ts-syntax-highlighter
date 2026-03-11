import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'ts-syntax-highlighter',
  description: 'A blazing-fast, TypeScript-native syntax highlighter with comprehensive grammar support',
  url: 'https://ts-syntax-highlighter.netlify.app',

  theme: {
    primaryColor: '#3178c6',
  },

  sidebar: [
    { text: 'Introduction', link: '/' },
    {
      text: 'Guide',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Supported Languages', link: '/guide/languages' },
        { text: 'Themes', link: '/guide/themes' },
        { text: 'Tokenization', link: '/guide/tokenizer' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Custom Grammars', link: '/advanced/custom-grammars' },
        { text: 'Custom Themes', link: '/advanced/custom-themes' },
        { text: 'Batch Processing', link: '/advanced/batch-processing' },
        { text: 'Testing', link: '/advanced/testing' },
      ],
    },
    {
      text: 'Features',
      items: [
        { text: 'Performance', link: '/features/performance' },
        { text: 'Modern Syntax', link: '/features/modern-syntax' },
        { text: 'JSX/TSX', link: '/features/jsx-tsx' },
      ],
    },
    { text: 'API Reference', link: '/api' },
    { text: 'Languages', link: '/languages' },
  ],

  navbar: [
    { text: 'Guide', link: '/guide/getting-started' },
    { text: 'API', link: '/api' },
    { text: 'Languages', link: '/languages' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-syntax-highlighter' },
  ],

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'og:title', content: 'ts-syntax-highlighter' }],
    ['meta', { name: 'og:description', content: 'A blazing-fast, TypeScript-native syntax highlighter with 48 languages' }],
  ],
}

export default config
