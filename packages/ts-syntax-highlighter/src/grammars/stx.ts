import type { Grammar } from '../types'

export const stxGrammar: Grammar = {
  name: 'STX',
  scopeName: 'text.html.stx',
  patterns: [
    { include: '#stx-directives' },
    { include: '#stx-comments' },
    { include: '#stx-echo' },
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
        {
          name: 'meta.embedded.block.stx',
          begin: '(?<!@)\\{\\{\\{',
          beginCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          end: '\\}\\}\\}',
          endCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          contentName: 'source.ts',
        },
        {
          name: 'meta.embedded.block.stx',
          begin: '(?<![@{])\\{\\{',
          beginCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          end: '\\}\\}',
          endCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          contentName: 'source.ts',
        },
        {
          name: 'meta.embedded.block.stx',
          begin: '(?<!@)\\{!!',
          beginCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          end: '!!\\}',
          endCaptures: {
            '0': { name: 'punctuation.definition.stx' },
          },
          contentName: 'source.ts',
        },
      ],
    },
    'stx-directives': {
      patterns: [
        {
          name: 'keyword.control.stx',
          match: '@(if|else|elseif|endif|for|foreach|endfor|endforeach|while|endwhile|switch|case|default|endswitch|break|continue)\\b',
        },
        {
          name: 'keyword.control.stx',
          match: '@(auth|guest|can|cannot|endauth|endguest|endcan|endcannot)\\b',
        },
        {
          name: 'keyword.control.stx',
          match: '@(component|endcomponent|slot|endslot|props|inject)\\b',
        },
        {
          name: 'keyword.control.stx',
          match: '@(section|endsection|yield|extends|include|push|endpush|stack|endstack)\\b',
        },
        {
          name: 'keyword.control.stx',
          match: '@(once|endonce|pushOnce|endpushOnce)\\b',
        },
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
              match: '[a-zA-Z-:]+',
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
