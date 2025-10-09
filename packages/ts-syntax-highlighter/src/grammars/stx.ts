import type { Grammar } from '../types'

export const stxGrammar: Grammar = {
  name: 'STX',
  scopeName: 'text.html.stx',
  patterns: [
    { include: '#stx-comments' },
    { include: '#stx-echo' },
    { include: '#stx-directives' },
    { include: '#html' },
  ],
  repository: {
    'stx-comments': {
      patterns: [
        {
          name: 'comment.block.stx',
          begin: '\\{\\{--',
          end: '--\\}\\}',
        },
      ],
    },
    'stx-echo': {
      patterns: [
        // Unescaped triple braces {{{ }}}
        {
          name: 'meta.embedded.block.stx.unescaped',
          begin: '(?<!@)\\{\\{\\{',
          beginCaptures: {
            '0': { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '\\}\\}\\}',
          endCaptures: {
            '0': { name: 'punctuation.section.embedded.end.stx' },
          },
          contentName: 'source.ts.embedded.stx',
        },
        // Escaped double braces {{ }}
        {
          name: 'meta.embedded.block.stx.escaped',
          begin: '(?<![@{])\\{\\{',
          beginCaptures: {
            '0': { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '\\}\\}',
          endCaptures: {
            '0': { name: 'punctuation.section.embedded.end.stx' },
          },
          contentName: 'source.ts.embedded.stx',
        },
        // Raw HTML {!! !!}
        {
          name: 'meta.embedded.block.stx.raw',
          begin: '(?<!@)\\{!!',
          beginCaptures: {
            '0': { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '!!\\}',
          endCaptures: {
            '0': { name: 'punctuation.section.embedded.end.stx' },
          },
          contentName: 'source.ts.embedded.stx',
        },
      ],
    },
    'stx-directives': {
      patterns: [
        // Control flow
        {
          name: 'keyword.control.conditional.stx',
          match: '@(if|else|elseif|endif|unless|endunless|switch|case|default|endswitch|break)\\b',
        },
        // Loops
        {
          name: 'keyword.control.loop.stx',
          match: '@(for|endfor|foreach|endforeach|while|endwhile|continue|forelse|empty)\\b',
        },
        // Authentication & Authorization
        {
          name: 'keyword.control.auth.stx',
          match: '@(auth|guest|can|cannot|endauth|endguest|endcan|endcannot)\\b',
        },
        // Components
        {
          name: 'keyword.control.component.stx',
          match: '@(component|endcomponent|slot|endslot|props|inject)\\b',
        },
        // Layout & Sections
        {
          name: 'keyword.control.layout.stx',
          match: '@(section|endsection|yield|extends|parent)\\b',
        },
        // Includes
        {
          name: 'support.function.include.stx',
          match: '@(include|includewhen|includeunless|includefirst)\\b',
        },
        // Stacks
        {
          name: 'keyword.control.stack.stx',
          match: '@(push|endpush|pushOnce|endpushOnce|pushif|endpushif|stack)\\b',
        },
        // Once directive
        {
          name: 'keyword.control.once.stx',
          match: '@(once|endonce)\\b',
        },
        // Security
        {
          name: 'support.function.security.stx',
          match: '@(csrf|method)\\b',
        },
        // Environment
        {
          name: 'keyword.control.environment.stx',
          match: '@(production|endproduction|development|enddevelopment|env|endenv)\\b',
        },
        // Translation
        {
          name: 'support.function.translation.stx',
          match: '@(translate|endtranslate|t)\\b',
        },
        // Web Components
        {
          name: 'support.function.webcomponent.stx',
          match: '@webcomponent\\b',
        },
        // Routes
        {
          name: 'support.function.route.stx',
          match: '@route\\b',
        },
        // Markdown
        {
          name: 'keyword.control.markdown.stx',
          begin: '@markdown\\b',
          beginCaptures: {
            '0': { name: 'keyword.control.markdown.stx' },
          },
          end: '@endmarkdown\\b',
          endCaptures: {
            '0': { name: 'keyword.control.markdown.stx' },
          },
          contentName: 'text.html.markdown.embedded.stx',
        },
        // Markdown file directive
        {
          name: 'support.function.markdown.stx',
          match: '@markdown-file\\b',
        },
        // Animation directives
        {
          name: 'keyword.control.animation.stx',
          match: '@(transition|endtransition|motion|endmotion)\\b',
        },
        // TypeScript block
        {
          name: 'meta.embedded.block.ts',
          begin: '@ts\\b',
          beginCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          end: '@endts\\b',
          endCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          contentName: 'source.ts',
        },
        // JavaScript block
        {
          name: 'meta.embedded.block.js',
          begin: '@js\\b',
          beginCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          end: '@endjs\\b',
          endCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          contentName: 'source.js',
        },
        // Raw content
        {
          name: 'meta.embedded.block.raw',
          begin: '@(raw|verbatim)\\b',
          beginCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          end: '@end(raw|verbatim)\\b',
          endCaptures: {
            '0': { name: 'keyword.control.stx' },
          },
          contentName: 'string.unquoted.raw',
        },
        // Generic directive (catch-all for custom directives)
        {
          name: 'entity.name.function.stx',
          match: '@[a-zA-Z_][a-zA-Z0-9_]*',
        },
      ],
    },
    html: {
      patterns: [
        {
          name: 'meta.tag.html',
          begin: '<([a-zA-Z0-9:-]+)',
          beginCaptures: {
            '0': { name: 'punctuation.definition.tag.begin.html' },
            '1': { name: 'entity.name.tag.html' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            '1': { name: 'punctuation.definition.tag.end.html' },
            '2': { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            {
              name: 'entity.other.attribute-name.html',
              match: '[a-zA-Z-:@]+',
            },
            {
              name: 'string.quoted.double.html',
              begin: '"',
              end: '"',
              patterns: [
                { include: '#stx-echo' },
              ],
            },
            {
              name: 'string.quoted.single.html',
              begin: '\'',
              end: '\'',
              patterns: [
                { include: '#stx-echo' },
              ],
            },
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
        {
          name: 'comment.block.html',
          begin: '<!--',
          end: '-->',
        },
      ],
    },
  },
}
