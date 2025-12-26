import type { Grammar } from '../types'

export const stxGrammar: Grammar = {
  name: 'STX',
  scopeName: 'text.html.stx',
  patterns: [
    { include: '#stx-comments' },
    { include: '#stx-escaped' },
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
    'stx-escaped': {
      patterns: [
        // Escaped directive @@
        {
          name: 'string.quoted.other.stx.escaped',
          match: '@@[a-zA-Z_][a-zA-Z0-9_]*',
        },
        // Escaped echo @{{ }}
        {
          name: 'string.quoted.other.stx.escaped',
          begin: '@\\{\\{',
          end: '\\}\\}',
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
            0: { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '\\}\\}\\}',
          endCaptures: {
            0: { name: 'punctuation.section.embedded.end.stx' },
          },
          patterns: [
            { include: '#stx-expression' },
          ],
        },
        // Escaped double braces {{ }} with filter support
        {
          name: 'meta.embedded.block.stx.escaped',
          begin: '(?<![@{])\\{\\{',
          beginCaptures: {
            0: { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '\\}\\}',
          endCaptures: {
            0: { name: 'punctuation.section.embedded.end.stx' },
          },
          patterns: [
            { include: '#stx-expression' },
          ],
        },
        // Raw HTML {!! !!}
        {
          name: 'meta.embedded.block.stx.raw',
          begin: '(?<!@)\\{!!',
          beginCaptures: {
            0: { name: 'punctuation.section.embedded.begin.stx' },
          },
          end: '!!\\}',
          endCaptures: {
            0: { name: 'punctuation.section.embedded.end.stx' },
          },
          patterns: [
            { include: '#stx-expression' },
          ],
        },
      ],
    },
    'stx-expression': {
      patterns: [
        // Filter pipe operator (but not ||)
        {
          name: 'keyword.operator.filter.stx',
          match: '(?<!\\|)\\|(?!\\|)',
        },
        // Filter name after pipe
        {
          name: 'support.function.filter.stx',
          match: '(?<=\\|)\\s*([a-zA-Z_][a-zA-Z0-9_]*)',
          captures: {
            1: { name: 'support.function.filter.stx' },
          },
        },
        // Special variables
        {
          name: 'variable.language.stx',
          match: '\\$(event|el|refs|data|root|store|watch|nextTick|dispatch|id)\\b',
        },
        // Everything else is embedded TypeScript
        {
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
        // Additional conditionals
        {
          name: 'keyword.control.conditional.stx',
          match: '@(isset|endisset|empty|endempty|when|elsewhen|endwhen)\\b',
        },
        // Loops
        {
          name: 'keyword.control.loop.stx',
          match: '@(for|endfor|foreach|endforeach|while|endwhile|continue|forelse|each|endeach)\\b',
        },
        // Authentication & Authorization
        {
          name: 'keyword.control.auth.stx',
          match: '@(auth|guest|can|cannot|canany|endauth|endguest|endcan|endcannot|endcanany)\\b',
        },
        // Components
        {
          name: 'keyword.control.component.stx',
          match: '@(component|endcomponent|slot|endslot|props|inject|aware)\\b',
        },
        // Layout & Sections
        {
          name: 'keyword.control.layout.stx',
          match: '@(section|endsection|yield|extends|parent|show|hasSection|sectionMissing)\\b',
        },
        // Includes
        {
          name: 'support.function.include.stx',
          match: '@(include|includeIf|includeWhen|includeUnless|includeFirst|partial)\\b',
        },
        // Stacks
        {
          name: 'keyword.control.stack.stx',
          match: '@(push|endpush|pushOnce|endpushOnce|pushIf|endpushIf|prepend|endprepend|prependOnce|endprependOnce|stack)\\b',
        },
        // Once directive
        {
          name: 'keyword.control.once.stx',
          match: '@(once|endonce)\\b',
        },
        // Forms & Security
        {
          name: 'support.function.security.stx',
          match: '@(csrf|method|error|enderror|old)\\b',
        },
        // Environment
        {
          name: 'keyword.control.environment.stx',
          match: '@(production|endproduction|development|enddevelopment|env|endenv)\\b',
        },
        // Translation / Internationalization
        {
          name: 'support.function.translation.stx',
          match: '@(translate|endtranslate|t|lang|endlang|choice)\\b',
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
        // JSON output
        {
          name: 'support.function.json.stx',
          match: '@json\\b',
        },
        // Markdown
        {
          name: 'keyword.control.markdown.stx',
          begin: '@markdown\\b',
          beginCaptures: {
            0: { name: 'keyword.control.markdown.stx' },
          },
          end: '@endmarkdown\\b',
          endCaptures: {
            0: { name: 'keyword.control.markdown.stx' },
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
            0: { name: 'keyword.control.stx' },
          },
          end: '@endts\\b',
          endCaptures: {
            0: { name: 'keyword.control.stx' },
          },
          contentName: 'source.ts',
        },
        // JavaScript block
        {
          name: 'meta.embedded.block.js',
          begin: '@js\\b',
          beginCaptures: {
            0: { name: 'keyword.control.stx' },
          },
          end: '@endjs\\b',
          endCaptures: {
            0: { name: 'keyword.control.stx' },
          },
          contentName: 'source.js',
        },
        // Raw content
        {
          name: 'meta.embedded.block.raw',
          begin: '@(raw|verbatim)\\b',
          beginCaptures: {
            0: { name: 'keyword.control.stx' },
          },
          end: '@end(raw|verbatim)\\b',
          endCaptures: {
            0: { name: 'keyword.control.stx' },
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
    'html': {
      patterns: [
        // Client-side script block
        {
          name: 'meta.embedded.block.script.client.stx',
          begin: '(<)(script)(\\s+client)(\\s*>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'entity.other.attribute-name.special.stx' },
            4: { name: 'punctuation.definition.tag.end.html' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'punctuation.definition.tag.end.html' },
          },
          contentName: 'source.ts.embedded.stx',
        },
        // Regular script block
        {
          name: 'meta.embedded.block.script.stx',
          begin: '(<)(script)(\\s*>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'punctuation.definition.tag.end.html' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'punctuation.definition.tag.end.html' },
          },
          contentName: 'source.ts.embedded.stx',
        },
        // Style block
        {
          name: 'meta.embedded.block.style.stx',
          begin: '(<)(style)(\\s*>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'punctuation.definition.tag.end.html' },
          },
          end: '(</)(style)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
            3: { name: 'punctuation.definition.tag.end.html' },
          },
          contentName: 'source.css.embedded.stx',
        },
        // Icon components (PascalCase ending with Icon)
        {
          name: 'meta.tag.component.icon.stx',
          begin: '(<)([A-Z][a-zA-Z0-9]*Icon)\\b',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'support.class.component.icon.stx' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
            2: { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            { include: '#tag-attributes' },
          ],
        },
        // PascalCase components (React/Vue-style)
        {
          name: 'meta.tag.component.stx',
          begin: '(<)([A-Z][a-zA-Z0-9]*)\\b',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'support.class.component.stx' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
            2: { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            { include: '#tag-attributes' },
          ],
        },
        // Component closing tag
        {
          name: 'meta.tag.component.stx',
          begin: '(</)([A-Z][a-zA-Z0-9]*)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'support.class.component.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
          },
        },
        // Regular HTML opening tag
        {
          name: 'meta.tag.html',
          begin: '<([a-z][a-zA-Z0-9:-]*)',
          beginCaptures: {
            0: { name: 'punctuation.definition.tag.begin.html' },
            1: { name: 'entity.name.tag.html' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
            2: { name: 'punctuation.definition.tag.end.html' },
          },
          patterns: [
            { include: '#tag-attributes' },
          ],
        },
        // Regular HTML closing tag
        {
          name: 'meta.tag.html',
          begin: '(</)([a-z][a-zA-Z0-9:-]*)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
          },
        },
        // HTML comment
        {
          name: 'comment.block.html',
          begin: '<!--',
          end: '-->',
        },
      ],
    },
    'tag-attributes': {
      patterns: [
        // Alpine x-* directives
        {
          name: 'entity.other.attribute-name.directive.alpine.stx',
          match: 'x-(data|text|html|model|show|hide|if|bind|on|ref|init|cloak|effect|ignore|id|teleport|modelable|transition)\\b',
        },
        // Alpine x-transition with modifiers
        {
          name: 'entity.other.attribute-name.directive.alpine.stx',
          match: 'x-transition(:(enter|enter-start|enter-end|leave|leave-start|leave-end))?',
        },
        // Event handlers with @ prefix and modifiers
        {
          name: 'entity.other.attribute-name.event.stx',
          match: '@([a-zA-Z]+)(\\.([a-zA-Z]+|\\d+))*',
        },
        // Vue-style v-bind shorthand with : prefix
        {
          name: 'entity.other.attribute-name.binding.stx',
          match: ':([a-zA-Z][a-zA-Z0-9-]*)',
          captures: {
            1: { name: 'entity.other.attribute-name.binding.stx' },
          },
        },
        // Vue-style v-bind, v-on, v-model, v-if, v-for, v-show
        {
          name: 'entity.other.attribute-name.directive.vue.stx',
          match: 'v-(bind|on|model|if|else|else-if|for|show|html|text|pre|cloak|once|memo|slot)\\b',
        },
        // v-bind:attr and v-on:event syntax
        {
          name: 'entity.other.attribute-name.directive.vue.stx',
          match: 'v-(bind|on):([a-zA-Z][a-zA-Z0-9-]*)',
        },
        // Regular HTML/custom attributes
        {
          name: 'entity.other.attribute-name.html',
          match: '[a-zA-Z_][a-zA-Z0-9_-]*',
        },
        // Attribute value with double quotes
        {
          name: 'string.quoted.double.html',
          begin: '"',
          end: '"',
          patterns: [
            { include: '#stx-echo' },
            { include: '#attribute-expression' },
          ],
        },
        // Attribute value with single quotes
        {
          name: 'string.quoted.single.html',
          begin: '\'',
          end: '\'',
          patterns: [
            { include: '#stx-echo' },
            { include: '#attribute-expression' },
          ],
        },
        // Equals sign
        {
          name: 'punctuation.separator.key-value.html',
          match: '=',
        },
      ],
    },
    'attribute-expression': {
      patterns: [
        // Special variables in expressions
        {
          name: 'variable.language.stx',
          match: '\\$(event|el|refs|data|root|store|watch|nextTick|dispatch|id)\\b',
        },
      ],
    },
  },
}
