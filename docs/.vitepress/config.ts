import type { HeadConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import { defineConfig } from 'vitepress'

import viteConfig from './vite.config'

// https://vitepress.dev/reference/site-config

const analyticsHead: HeadConfig[] = [
  [
    'script',
    {
      'src': 'https://cdn.usefathom.com/script.js',
      'data-site': 'DCOEHMGA',
      'defer': '',
    },
  ],
]

const nav = [
  { text: 'News', link: 'https://stacksjs.org/news' },
  {
    text: 'Changelog',
    link: 'https://github.com/stacksjs/ts-syntax-highlighter/blob/main/CHANGELOG.md',
  },
  // { text: 'Blog', link: 'https://updates.ow3.org' },
  {
    text: 'Resources',
    items: [
      { text: 'Team', link: '/team' },
      { text: 'Sponsors', link: '/sponsors' },
      { text: 'Partners', link: '/partners' },
      { text: 'Postcardware', link: '/postcardware' },
      { text: 'Stargazers', link: '/stargazers' },
      { text: 'License', link: '/license' },
      {
        items: [
          {
            text: 'Awesome Stacks',
            link: 'https://github.com/stacksjs/awesome-stacks',
          },
          {
            text: 'Contributing',
            link: 'https://github.com/stacksjs/stacks/blob/main/.github/CONTRIBUTING.md',
          },
        ],
      },
    ],
  },
]

const sidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/intro' },
      { text: 'Installation', link: '/install' },
      { text: 'Quick Start', link: '/usage' },
    ],
  },
  {
    text: 'Features',
    items: [
      { text: 'Performance', link: '/features/performance' },
      { text: 'Modern Syntax', link: '/features/modern-syntax' },
      { text: 'JSX/TSX Support', link: '/features/jsx-tsx' },
    ],
  },
  {
    text: 'Core Concepts',
    items: [
      { text: 'Grammars', link: '/grammars' },
      { text: 'Tokenization', link: '/usage#working-with-tokens' },
      { text: 'Configuration', link: '/config' },
    ],
  },
  {
    text: 'Supported Languages',
    items: [
      { text: 'JavaScript/JSX', link: '/grammars#javascript-jsx' },
      { text: 'TypeScript/TSX', link: '/grammars#typescript-tsx' },
      { text: 'HTML', link: '/grammars#html' },
      { text: 'CSS', link: '/grammars#css' },
      { text: 'JSON', link: '/grammars#json' },
      { text: 'STX', link: '/grammars#stx' },
    ],
  },
  {
    text: 'Advanced',
    items: [
      { text: 'Custom Themes', link: '/advanced/custom-themes' },
      { text: 'Batch Processing', link: '/advanced/batch-processing' },
      { text: 'Code Analysis', link: '/usage#code-statistics' },
      { text: 'Performance Tuning', link: '/config#performance-tuning' },
    ],
  },
  {
    text: 'API Reference',
    items: [
      { text: 'Overview', link: '/api' },
      { text: 'Tokenizer', link: '/api#tokenizer' },
      { text: 'Language Functions', link: '/api#language-functions' },
      { text: 'Types', link: '/api#types' },
    ],
  },
  { text: 'Showcase', link: '/showcase' },
]
const description = 'Blazing-fast, TypeScript-native syntax highlighter with comprehensive grammar support for modern web languages.'
const title = 'ts-syntax-highlighter | Blazing-Fast Syntax Highlighting for TypeScript'

export default withPwa(
  defineConfig({
    lang: 'en-US',
    title: 'ts-syntax-highlighter',
    description,
    metaChunk: true,
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: './images/logo-mini.svg' }],
      ['link', { rel: 'icon', type: 'image/png', href: './images/logo.png' }],
      ['meta', { name: 'theme-color', content: '#0A0ABC' }],
      ['meta', { name: 'title', content: title }],
      ['meta', { name: 'description', content: description }],
      ['meta', { name: 'author', content: 'Stacks.js, Inc.' }],
      ['meta', {
        name: 'tags',
        content: 'syntax highlighter, typescript, javascript, jsx, tsx, html, css, json, tokenizer, code highlighting, performance',
      }],

      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'en' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],

      ['meta', { property: 'og:site_name', content: 'ts-syntax-highlighter' }],
      ['meta', { property: 'og:image', content: './images/og-image.jpg' }],
      ['meta', { property: 'og:url', content: 'https://github.com/stacksjs/ts-syntax-highlighter' }],
      // ['script', { 'src': 'https://cdn.usefathom.com/script.js', 'data-site': '', 'data-spa': 'auto', 'defer': '' }],
      ...analyticsHead,
    ],

    themeConfig: {
      search: {
        provider: 'local',
      },
      logo: {
        light: './images/logo-transparent.svg',
        dark: './images/logo-white-transparent.svg',
      },

      nav,
      sidebar,

      editLink: {
        pattern: 'https://github.com/stacksjs/ts-syntax-highlighter/edit/main/docs/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025-present Stacks.js, Inc.',
      },

      socialLinks: [
        { icon: 'twitter', link: 'https://twitter.com/stacksjs' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/chrisbreuer.dev' },
        { icon: 'github', link: 'https://github.com/stacksjs/ts-syntax-highlighter' },
        { icon: 'discord', link: 'https://discord.gg/stacksjs' },
      ],

      // algolia: services.algolia,

      // carbonAds: {
      //   code: '',
      //   placement: '',
      // },
    },

    pwa: {
      manifest: {
        theme_color: '#0A0ABC',
      },
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },

      codeTransformers: [
        transformerTwoslash(),
      ],
    },

    vite: viteConfig,
  }),
)
