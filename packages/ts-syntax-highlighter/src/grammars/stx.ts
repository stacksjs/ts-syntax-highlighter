import type { Grammar } from '../types'

export const stxGrammar: Grammar = {
  name: 'STX',
  scopeName: 'text.html.stx',
  patterns: [
    { include: '#stx-comments' },
    { include: '#stx-escaped' },
    { include: '#sfc-blocks' },
    { include: '#stx-raw-expression' },
    { include: '#stx-expression' },
    { include: '#stx-directives' },
    { include: '#component-tags' },
    { include: '#slot-element' },
    { include: '#html' },
  ],
  repository: {
    // 1. STX Comments {{-- --}}
    'stx-comments': {
      patterns: [
        {
          name: 'comment.block.stx',
          begin: '\\{\\{--',
          end: '--\\}\\}',
        },
      ],
    },

    // Escaped directives and expressions
    'stx-escaped': {
      patterns: [
        {
          name: 'string.quoted.other.stx.escaped',
          match: '@@[a-zA-Z_][a-zA-Z0-9_]*',
        },
        {
          name: 'string.quoted.other.stx.escaped',
          begin: '@\\{\\{',
          end: '\\}\\}',
        },
      ],
    },

    // 2. SFC Block Tags
    'sfc-blocks': {
      patterns: [
        // Script with server attribute (SSR only, stripped from output)
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(script)(\\s+server)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'meta.tag.attributes.stx' },
            5: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#script-content' },
          ],
        },
        // Script with client attribute (client only, skips server evaluation)
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(script)(\\s+client)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'meta.tag.attributes.stx' },
            5: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#script-content' },
          ],
        },
        // Script with js attribute (opt out of TypeScript)
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(script)(\\s+js)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'meta.tag.attributes.stx' },
            5: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#script-content' },
          ],
        },
        // Regular script (runs on server, preserved for client)
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(script)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'meta.tag.attributes.stx' },
            4: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(script)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#script-content' },
          ],
        },
        // Template block
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(template)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'meta.tag.attributes.stx' },
            4: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(template)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#stx-comments' },
            { include: '#stx-raw-expression' },
            { include: '#stx-expression' },
            { include: '#stx-directives' },
            { include: '#component-tags' },
            { include: '#slot-element' },
            { include: '#html' },
          ],
        },
        // Style with scoped attribute
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(style)(\\s+scoped)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'meta.tag.attributes.stx' },
            5: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(style)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#css-content' },
          ],
        },
        // Regular style
        {
          name: 'meta.tag.block.stx',
          begin: '(<)(style)([^>]*)(>)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'meta.tag.attributes.stx' },
            4: { name: 'punctuation.definition.tag.end.stx' },
          },
          end: '(</)(style)(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'keyword.control.stx' },
            3: { name: 'punctuation.definition.tag.end.stx' },
          },
          patterns: [
            { include: '#css-content' },
          ],
        },
      ],
    },

    // 3. Raw Expression {!! !!}
    'stx-raw-expression': {
      patterns: [
        {
          name: 'meta.embedded.expression.raw.stx',
          begin: '\\{!!',
          beginCaptures: {
            0: { name: 'punctuation.definition.expression.raw.begin.stx' },
          },
          end: '!!\\}',
          endCaptures: {
            0: { name: 'punctuation.definition.expression.raw.end.stx' },
          },
          patterns: [
            { include: '#js-expression' },
          ],
        },
      ],
    },

    // 4. Escaped Expression {{ }}
    'stx-expression': {
      patterns: [
        {
          name: 'meta.embedded.expression.stx',
          begin: '\\{\\{(?!--)',
          beginCaptures: {
            0: { name: 'punctuation.definition.expression.begin.stx' },
          },
          end: '\\}\\}',
          endCaptures: {
            0: { name: 'punctuation.definition.expression.end.stx' },
          },
          patterns: [
            { include: '#js-expression' },
          ],
        },
      ],
    },

    // 5. Directives
    'stx-directives': {
      patterns: [
        // Block directives with parenthesized arguments (conditionals, loops, etc.)
        {
          name: 'meta.directive.stx',
          begin: '(@)(if|elseif|foreach|forelse|for|while|switch|case|when|elsewhen|auth|guest|section|push|pushOnce|prepend|unless|isset|empty|can|cannot|canany|error|production|development|env|import|include|layout|extends|yield|component|slot|props|inject|hasSection|sectionMissing|includeIf|includeWhen|includeUnless|includeFirst|each|class|style|checked|selected|disabled|readonly|required|aware|vite|entrypoint|json|translate|t|method|meta|seo|route|webcomponent|old|transition|defer|teleport|errorBoundary|async|suspense|keepAlive)\\s*(\\()',
          beginCaptures: {
            1: { name: 'punctuation.definition.directive.stx' },
            2: { name: 'keyword.control.directive.stx' },
            3: { name: 'punctuation.section.parens.begin.stx' },
          },
          end: '(\\))',
          endCaptures: {
            1: { name: 'punctuation.section.parens.end.stx' },
          },
          patterns: [
            { include: '#directive-arguments' },
          ],
        },
        // Block end directives and structural keywords (no arguments)
        {
          name: 'meta.directive.stx',
          match: '(@)(endif|endforeach|endforelse|endfor|endwhile|endswitch|endwhen|endauth|endguest|endsection|endpush|endpushOnce|endprepend|endonce|endunless|endisset|endempty|endcan|endcannot|endcanany|enderror|endproduction|enddevelopment|endenv|endverbatim|endtransition|enddefer|endteleport|enderrorBoundary|endasync|endsuspense|endkeepAlive|endmarkdown|endmotion|endraw|endjs|endts|endeach|endwrap|else|default|fallback|placeholder|loading)\\b',
          captures: {
            1: { name: 'punctuation.definition.directive.stx' },
            2: { name: 'keyword.control.directive.stx' },
          },
        },
        // Simple directives without arguments
        {
          name: 'meta.directive.stx',
          match: '(@)(csrf|parent|show|break|continue|once|verbatim|markdown|raw|js|ts|php)\\b',
          captures: {
            1: { name: 'punctuation.definition.directive.stx' },
            2: { name: 'keyword.control.directive.stx' },
          },
        },
        // Generic directive (catch-all for custom directives)
        {
          name: 'meta.directive.stx',
          match: '(@)([a-zA-Z_][a-zA-Z0-9_]*)',
          captures: {
            1: { name: 'punctuation.definition.directive.stx' },
            2: { name: 'keyword.control.directive.stx' },
          },
        },
      ],
    },

    // Directive Arguments
    'directive-arguments': {
      patterns: [
        // String in single quotes
        {
          name: 'string.quoted.single.stx',
          begin: '\'',
          end: '\'',
          patterns: [
            { name: 'constant.character.escape.stx', match: '\\\\.' },
          ],
        },
        // String in double quotes
        {
          name: 'string.quoted.double.stx',
          begin: '"',
          end: '"',
          patterns: [
            { name: 'constant.character.escape.stx', match: '\\\\.' },
          ],
        },
        // Named parameter (key: value) in directive options
        {
          name: 'meta.directive-param.stx',
          match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)\\s*(:)',
          captures: {
            1: { name: 'entity.other.attribute-name.stx' },
            2: { name: 'punctuation.separator.key-value.stx' },
          },
        },
        // Variable
        {
          name: 'variable.other.stx',
          match: '\\$[a-zA-Z_][a-zA-Z0-9_]*',
        },
        // Arrow for foreach: items as item
        {
          name: 'keyword.operator.as.stx',
          match: '\\b(as)\\b',
        },
        // Key => value
        {
          name: 'keyword.operator.arrow.stx',
          match: '=>',
        },
        // Arrow function
        {
          name: 'storage.type.function.arrow.js',
          match: '=>',
        },
        // Comparison operators
        {
          name: 'keyword.operator.comparison.stx',
          match: '===|!==|==|!=|<=|>=|<|>',
        },
        // Logical operators
        {
          name: 'keyword.operator.logical.stx',
          match: '&&|\\|\\||!(?!=)',
        },
        // Numbers
        {
          name: 'constant.numeric.stx',
          match: '\\b\\d+(\\.\\d+)?\\b',
        },
        // Boolean/null/undefined
        {
          name: 'constant.language.stx',
          match: '\\b(true|false|null|undefined)\\b',
        },
        // JS keywords in directive args (let, const, etc.)
        {
          name: 'storage.type.js',
          match: '\\b(let|const|var)\\b',
        },
        // Operators in directive args (in, of)
        {
          name: 'keyword.operator.js',
          match: '\\b(in|of)\\b',
        },
        // Identifiers
        {
          name: 'variable.other.stx',
          match: '\\b[a-zA-Z_][a-zA-Z0-9_]*\\b',
        },
      ],
    },

    // 6. Component Tags (PascalCase and kebab-case)
    'component-tags': {
      patterns: [
        // PascalCase opening tag
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
        // PascalCase closing tag
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
        // kebab-case component opening tag (must contain hyphen)
        {
          name: 'meta.tag.component.stx',
          begin: '(<)([a-z][a-z0-9]*-[a-z0-9-]*)\\b',
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
        // kebab-case component closing tag
        {
          name: 'meta.tag.component.stx',
          begin: '(</)([a-z][a-z0-9]*-[a-z0-9-]*)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'support.class.component.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
          },
        },
      ],
    },

    // 7. Slot Element
    'slot-element': {
      patterns: [
        // Self-closing slot
        {
          name: 'meta.tag.slot.stx',
          begin: '(<)(slot)\\b',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.slot.stx support.class.component.stx' },
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
        // Closing slot tag
        {
          name: 'meta.tag.slot.stx',
          begin: '(</)(slot)',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.slot.stx support.class.component.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.html' },
          },
        },
      ],
    },

    // Tag Attributes
    'tag-attributes': {
      patterns: [
        // Named slot shorthand: #slotName or #slotName="{ destructured }"
        {
          name: 'meta.attribute.slot-shorthand.stx',
          begin: '(#)([a-zA-Z][a-zA-Z0-9-]*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'punctuation.definition.slot.stx' },
            2: { name: 'entity.other.attribute-name.slot.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Named slot shorthand without value: #slotName
        {
          name: 'meta.attribute.slot-shorthand.stx',
          match: '(#)([a-zA-Z][a-zA-Z0-9-]*)',
          captures: {
            1: { name: 'punctuation.definition.slot.stx' },
            2: { name: 'entity.other.attribute-name.slot.stx' },
          },
        },
        // Vue-style v-slot:name="scope"
        {
          name: 'meta.attribute.directive.vue.stx',
          begin: '(v-slot)(:)([a-zA-Z][a-zA-Z0-9-]*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'punctuation.separator.directive.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'punctuation.separator.key-value.stx' },
            5: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Vue-style v-* directives with value: v-bind:prop="expr", v-on:event="handler", v-model="val", v-if="cond", v-for="item in items"
        {
          name: 'meta.attribute.directive.vue.stx',
          begin: '(v-(?:bind|on|model|if|else-if|else|for|show|html|text|cloak|once|pre|memo))(?:(:)([a-zA-Z][a-zA-Z0-9-]*))?\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'punctuation.separator.directive.stx' },
            3: { name: 'entity.other.attribute-name.stx' },
            4: { name: 'punctuation.separator.key-value.stx' },
            5: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Vue-style v-* without value
        {
          name: 'entity.other.attribute-name.directive.stx',
          match: 'v-(?:bind|on|model|if|else-if|else|for|show|html|text|cloak|once|pre|memo|slot)(?::[a-zA-Z][a-zA-Z0-9-]*)?',
        },
        // Binding attribute :prop="expression"
        {
          name: 'meta.attribute.binding.stx',
          begin: '(:)([a-zA-Z][a-zA-Z0-9-]*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'punctuation.definition.binding.stx' },
            2: { name: 'entity.other.attribute-name.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Binding attribute :prop='expression'
        {
          name: 'meta.attribute.binding.stx',
          begin: '(:)([a-zA-Z][a-zA-Z0-9-]*)\\s*(=)\\s*(\')',
          beginCaptures: {
            1: { name: 'punctuation.definition.binding.stx' },
            2: { name: 'entity.other.attribute-name.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '\'',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Event attribute @event.modifier="expression"
        {
          name: 'meta.attribute.event.stx',
          begin: '(@)([a-zA-Z][a-zA-Z0-9]*)((?:\\.[a-zA-Z0-9]+)*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'punctuation.definition.event.stx' },
            2: { name: 'entity.other.attribute-name.event.stx' },
            3: { name: 'keyword.modifier.event.stx' },
            4: { name: 'punctuation.separator.key-value.stx' },
            5: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Event attribute with single quotes
        {
          name: 'meta.attribute.event.stx',
          begin: '(@)([a-zA-Z][a-zA-Z0-9]*)((?:\\.[a-zA-Z0-9]+)*)\\s*(=)\\s*(\')',
          beginCaptures: {
            1: { name: 'punctuation.definition.event.stx' },
            2: { name: 'entity.other.attribute-name.event.stx' },
            3: { name: 'keyword.modifier.event.stx' },
            4: { name: 'punctuation.separator.key-value.stx' },
            5: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '\'',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // @transition attribute with modifiers: @transition.fade="isVisible"
        {
          name: 'meta.attribute.transition.stx',
          begin: '(@transition)((?:\\.[a-zA-Z0-9-]+)*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'keyword.modifier.event.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Reactive attributes (x-data, x-model, x-text, x-html)
        {
          name: 'meta.attribute.reactive.stx',
          begin: '(x-)(data|model|text|html)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'punctuation.definition.reactive.stx' },
            2: { name: 'entity.other.attribute-name.reactive.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Reactive attributes with single quotes
        {
          name: 'meta.attribute.reactive.stx',
          begin: '(x-)(data|model|text|html)\\s*(=)\\s*(\')',
          beginCaptures: {
            1: { name: 'punctuation.definition.reactive.stx' },
            2: { name: 'entity.other.attribute-name.reactive.stx' },
            3: { name: 'punctuation.separator.key-value.stx' },
            4: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '\'',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // Other x-* directives with value (show, hide, if, bind, on, ref, init, effect, transition)
        {
          name: 'meta.attribute.directive.stx',
          begin: '(x-(?:show|hide|if|bind|on|ref|init|effect|transition(?::[a-z-]+)?))\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'punctuation.separator.key-value.stx' },
            3: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // x-* directives with single quotes
        {
          name: 'meta.attribute.directive.stx',
          begin: '(x-(?:show|hide|if|bind|on|ref|init|effect|transition(?::[a-z-]+)?))\\s*(=)\\s*(\')',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'punctuation.separator.key-value.stx' },
            3: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '\'',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'meta.embedded.expression.stx',
          patterns: [
            { include: '#js-expression' },
          ],
        },
        // x-* without value
        {
          name: 'entity.other.attribute-name.directive.stx',
          match: 'x-(cloak|ignore|id|teleport|modelable|transition)\\b',
        },
        // ref attribute (DOM reference binding)
        {
          name: 'meta.attribute.ref.stx',
          begin: '(ref|@ref)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.directive.stx' },
            2: { name: 'punctuation.separator.key-value.stx' },
            3: { name: 'punctuation.definition.string.begin.stx' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.stx' },
          },
          contentName: 'string.quoted.double.html',
        },
        // Regular attribute with mustache in value
        {
          name: 'meta.attribute.stx',
          begin: '([a-zA-Z_][a-zA-Z0-9_:-]*)\\s*(=)\\s*(")',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.html' },
            2: { name: 'punctuation.separator.key-value.html' },
            3: { name: 'punctuation.definition.string.begin.html' },
          },
          end: '"',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.html' },
          },
          contentName: 'string.quoted.double.html',
          patterns: [
            { include: '#stx-expression' },
          ],
        },
        // Regular attribute with single quotes
        {
          name: 'meta.attribute.stx',
          begin: '([a-zA-Z_][a-zA-Z0-9_:-]*)\\s*(=)\\s*(\')',
          beginCaptures: {
            1: { name: 'entity.other.attribute-name.html' },
            2: { name: 'punctuation.separator.key-value.html' },
            3: { name: 'punctuation.definition.string.begin.html' },
          },
          end: '\'',
          endCaptures: {
            0: { name: 'punctuation.definition.string.end.html' },
          },
          contentName: 'string.quoted.single.html',
          patterns: [
            { include: '#stx-expression' },
          ],
        },
        // Boolean attribute (no value)
        {
          name: 'entity.other.attribute-name.html',
          match: '[a-zA-Z_][a-zA-Z0-9_:-]*',
        },
      ],
    },

    // HTML Tags
    'html': {
      patterns: [
        // HTML comment
        {
          name: 'comment.block.html',
          begin: '<!--',
          end: '-->',
        },
        // HTML opening tag
        {
          name: 'meta.tag.html',
          begin: '(<)([a-z][a-zA-Z0-9:-]*)\\b',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.html' },
            2: { name: 'entity.name.tag.html' },
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
        // HTML closing tag
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
      ],
    },

    // JavaScript Expression Patterns
    'js-expression': {
      patterns: [
        { include: '#js-string' },
        { include: '#js-number' },
        { include: '#js-keywords' },
        { include: '#js-constants' },
        { include: '#js-operators' },
        { include: '#js-function-call' },
        { include: '#js-property' },
        { include: '#js-identifier' },
      ],
    },
    'js-string': {
      patterns: [
        {
          name: 'string.template.js',
          begin: '`',
          end: '`',
          patterns: [
            {
              name: 'meta.template.expression.js',
              begin: '\\$\\{',
              beginCaptures: {
                0: { name: 'punctuation.definition.template-expression.begin.js' },
              },
              end: '\\}',
              endCaptures: {
                0: { name: 'punctuation.definition.template-expression.end.js' },
              },
              patterns: [
                { include: '#js-expression' },
              ],
            },
          ],
        },
        {
          name: 'string.quoted.double.js',
          begin: '"',
          end: '"',
          patterns: [
            { name: 'constant.character.escape.js', match: '\\\\.' },
          ],
        },
        {
          name: 'string.quoted.single.js',
          begin: '\'',
          end: '\'',
          patterns: [
            { name: 'constant.character.escape.js', match: '\\\\.' },
          ],
        },
      ],
    },
    'js-number': {
      patterns: [
        { name: 'constant.numeric.hex.js', match: '\\b0[xX][0-9a-fA-F]+\\b' },
        { name: 'constant.numeric.binary.js', match: '\\b0[bB][01]+\\b' },
        { name: 'constant.numeric.octal.js', match: '\\b0[oO][0-7]+\\b' },
        { name: 'constant.numeric.decimal.js', match: '\\b\\d+(\\.\\d+)?([eE][+-]?\\d+)?\\b' },
      ],
    },
    'js-keywords': {
      patterns: [
        { name: 'keyword.control.js', match: '\\b(if|else|for|while|do|switch|case|default|break|continue|return|throw|try|catch|finally|yield|await)\\b' },
        { name: 'storage.type.js', match: '\\b(var|let|const|function|class|interface|type|enum|async|export|import|from|as|extends|implements)\\b' },
        { name: 'keyword.operator.js', match: '\\b(new|delete|typeof|instanceof|in|of|void)\\b' },
      ],
    },
    'js-constants': {
      patterns: [
        { name: 'constant.language.boolean.js', match: '\\b(true|false)\\b' },
        { name: 'constant.language.js', match: '\\b(null|undefined|NaN|Infinity)\\b' },
        { name: 'variable.language.js', match: '\\b(this|super)\\b' },
      ],
    },
    'js-operators': {
      patterns: [
        { name: 'keyword.operator.comparison.js', match: '===|!==|==|!=|<=|>=|<|>' },
        { name: 'keyword.operator.logical.js', match: '&&|\\|\\||!(?!=)' },
        { name: 'keyword.operator.js', match: '\\?\\?|\\?\\.(?!\\d)' },
        { name: 'keyword.operator.assignment.js', match: '\\+=|-=|\\*=|/=|%=|=(?![=>])' },
        { name: 'keyword.operator.arithmetic.js', match: '\\+\\+|--|\\*\\*|\\+|-|\\*|/|%' },
        { name: 'keyword.operator.ternary.js', match: '\\?|:' },
        { name: 'keyword.operator.spread.js', match: '\\.\\.\\.' },
        { name: 'storage.type.function.arrow.js', match: '=>' },
      ],
    },
    'js-function-call': {
      patterns: [
        {
          name: 'meta.function-call.js',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
          captures: { 1: { name: 'entity.name.function.js' } },
        },
      ],
    },
    'js-property': {
      patterns: [
        {
          name: 'meta.property.js',
          match: '(?<=\\.)\\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\\b(?!\\s*\\()',
          captures: { 1: { name: 'variable.other.property.js' } },
        },
        {
          name: 'meta.method-call.js',
          match: '(?<=\\.)\\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
          captures: { 1: { name: 'entity.name.function.js' } },
        },
      ],
    },
    'js-identifier': {
      patterns: [
        { name: 'variable.other.stx', match: '\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\b' },
      ],
    },

    // Script Content - comprehensive JS/TS highlighting
    'script-content': {
      patterns: [
        // Comments
        { name: 'comment.line.double-slash.js', match: '//.*$' },
        { name: 'comment.block.js', begin: '/\\*', end: '\\*/' },

        // Import statements
        {
          name: 'meta.import.js',
          begin: '\\b(import)\\b',
          beginCaptures: { 1: { name: 'keyword.control.import.js' } },
          end: '(?=;|$)',
          patterns: [
            { name: 'keyword.control.from.js', match: '\\bfrom\\b' },
            { name: 'keyword.control.as.js', match: '\\bas\\b' },
            { name: 'keyword.control.type.ts', match: '\\btype\\b' },
            { name: 'keyword.operator.js', match: '\\*' },
            { include: '#js-string' },
            { name: 'variable.other.readwrite.js', match: '\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\b' },
          ],
        },

        // Export statements
        {
          name: 'meta.export.js',
          match: '\\b(export)\\s+(default)?\\b',
          captures: {
            1: { name: 'keyword.control.export.js' },
            2: { name: 'keyword.control.default.js' },
          },
        },

        // TypeScript interface declaration
        {
          name: 'meta.interface.ts',
          match: '\\b(interface)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)',
          captures: {
            1: { name: 'storage.type.interface.ts' },
            2: { name: 'entity.name.type.interface.ts' },
          },
        },

        // TypeScript type alias
        {
          name: 'meta.type-alias.ts',
          match: '\\b(type)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(=)',
          captures: {
            1: { name: 'storage.type.type.ts' },
            2: { name: 'entity.name.type.alias.ts' },
            3: { name: 'keyword.operator.assignment.ts' },
          },
        },

        // TypeScript type annotations (: Type after parameter/variable)
        {
          name: 'meta.type-annotation.ts',
          match: '(?<=:\\s*)(string|number|boolean|void|never|any|unknown|null|undefined|object|symbol|bigint)\\b',
          captures: {
            1: { name: 'support.type.primitive.ts' },
          },
        },

        // TypeScript generic angle brackets with type
        {
          name: 'meta.type-parameters.ts',
          match: '<([A-Z][a-zA-Z0-9_$]*)>',
          captures: {
            1: { name: 'entity.name.type.ts' },
          },
        },

        // STX auto-imported composables and lifecycle hooks
        {
          name: 'support.function.stx',
          match: '\\b(state|derived|useRef|useRoute|useTitle|useEventListener|useWebSocket|useLocalStorage|useSessionStorage|useColorMode|useMouse|useWindowSize|useMediaQuery|useClipboard|useDebounce|useThrottle|useInterval|useTimeout|onMount|onMounted|onDestroy|onUnmounted|onUpdate|onUpdated|onActivated|onDeactivated|defineProps|defineEmits|withDefaults|provide|inject|createInjectionKey|watch|watchEffect|nextTick|navigate|defineStore|registerStoresClient|waitForStore|defineAsyncComponent|withErrorBoundary)\\b(?=\\s*[<(])',
        },

        // STX global objects
        {
          name: 'support.class.stx',
          match: '\\b(STX)\\b',
        },

        // Function declaration
        {
          name: 'meta.function.js',
          begin: '\\b(async\\s+)?(function)\\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(\\()',
          beginCaptures: {
            1: { name: 'storage.modifier.async.js' },
            2: { name: 'storage.type.function.js' },
            3: { name: 'entity.name.function.js' },
            4: { name: 'punctuation.definition.parameters.begin.js' },
          },
          end: '(\\))',
          endCaptures: {
            1: { name: 'punctuation.definition.parameters.end.js' },
          },
          patterns: [
            { include: '#function-parameters' },
          ],
        },

        // Arrow function with parameters
        {
          name: 'meta.arrow-function.js',
          match: '(\\()([^)]*)(\\))\\s*(=>)',
          captures: {
            1: { name: 'punctuation.definition.parameters.begin.js' },
            2: { name: 'variable.parameter.js' },
            3: { name: 'punctuation.definition.parameters.end.js' },
            4: { name: 'storage.type.function.arrow.js' },
          },
        },

        // Simple arrow function
        {
          name: 'meta.arrow-function.js',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(=>)',
          captures: {
            1: { name: 'variable.parameter.js' },
            2: { name: 'storage.type.function.arrow.js' },
          },
        },

        // Variable declarations
        {
          name: 'meta.var.js',
          match: '\\b(const|let|var)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)',
          captures: {
            1: { name: 'storage.type.js' },
            2: { name: 'variable.other.readwrite.js' },
          },
        },

        // Class declaration
        {
          name: 'meta.class.js',
          match: '\\b(class)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\\s+(extends)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*))?',
          captures: {
            1: { name: 'storage.type.class.js' },
            2: { name: 'entity.name.type.class.js' },
            3: { name: 'storage.modifier.extends.js' },
            4: { name: 'entity.other.inherited-class.js' },
          },
        },

        // Built-in objects
        {
          name: 'support.class.builtin.js',
          match: '\\b(window|document|console|Array|Object|String|Number|Boolean|Function|Symbol|Map|Set|WeakMap|WeakSet|Promise|Proxy|Reflect|JSON|Math|Date|RegExp|Error|TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|AggregateError|localStorage|sessionStorage|navigator|location|history|fetch|Request|Response|Headers|URL|URLSearchParams|FormData|Blob|File|FileReader|Worker|WebSocket|EventSource|XMLHttpRequest|AbortController|MutationObserver|IntersectionObserver|ResizeObserver|performance|crypto|Intl|HTMLElement|Element|Event|CustomEvent)\\b',
        },

        // DOM methods
        {
          name: 'support.function.dom.js',
          match: '\\b(getElementById|getElementsByClassName|getElementsByTagName|querySelector|querySelectorAll|createElement|createTextNode|appendChild|removeChild|insertBefore|replaceChild|cloneNode|addEventListener|removeEventListener|dispatchEvent|getAttribute|setAttribute|removeAttribute|hasAttribute|classList|innerHTML|outerHTML|textContent|innerText|style|dataset|parentNode|parentElement|children|firstChild|lastChild|nextSibling|previousSibling|firstElementChild|lastElementChild|nextElementSibling|previousElementSibling)\\b(?=\\s*\\(|\\s*\\.)',
        },

        // Array/Object methods
        {
          name: 'support.function.js',
          match: '\\b(map|filter|reduce|forEach|find|findIndex|some|every|includes|indexOf|lastIndexOf|join|split|slice|splice|concat|push|pop|shift|unshift|sort|reverse|fill|copyWithin|flat|flatMap|from|isArray|of|keys|values|entries|assign|freeze|seal|preventExtensions|isFrozen|isSealed|isExtensible|getOwnPropertyNames|getOwnPropertySymbols|getOwnPropertyDescriptor|getOwnPropertyDescriptors|defineProperty|defineProperties|create|getPrototypeOf|setPrototypeOf|hasOwnProperty|isPrototypeOf|propertyIsEnumerable|toString|valueOf|toLocaleString|toJSON|parse|stringify)\\b(?=\\s*\\()',
        },

        // Console methods
        {
          name: 'support.function.console.js',
          match: '(?<=console\\.)(log|info|warn|error|debug|trace|dir|dirxml|table|count|countReset|group|groupCollapsed|groupEnd|time|timeLog|timeEnd|assert|clear|profile|profileEnd)\\b',
        },

        // Control flow keywords
        {
          name: 'keyword.control.js',
          match: '\\b(if|else|for|while|do|switch|case|default|break|continue|return|throw|try|catch|finally|with)\\b',
        },

        // Async/await
        {
          name: 'keyword.control.flow.js',
          match: '\\b(async|await|yield)\\b',
        },

        // Operators as keywords
        {
          name: 'keyword.operator.expression.js',
          match: '\\b(new|delete|typeof|instanceof|in|of|void)\\b',
        },

        // Boolean/null/undefined
        {
          name: 'constant.language.boolean.js',
          match: '\\b(true|false)\\b',
        },
        {
          name: 'constant.language.null.js',
          match: '\\b(null)\\b',
        },
        {
          name: 'constant.language.undefined.js',
          match: '\\b(undefined)\\b',
        },
        {
          name: 'constant.language.nan.js',
          match: '\\b(NaN|Infinity)\\b',
        },

        // this/super
        {
          name: 'variable.language.this.js',
          match: '\\b(this)\\b',
        },
        {
          name: 'variable.language.super.js',
          match: '\\b(super)\\b',
        },

        // Strings
        { include: '#js-string' },

        // Numbers
        { include: '#js-number' },

        // Regex
        {
          name: 'string.regexp.js',
          begin: '(?<=[=(:,\\[!&|?])\\s*(/)',
          beginCaptures: { 1: { name: 'punctuation.definition.string.begin.js' } },
          end: '(/)[gimsuvy]*',
          endCaptures: { 1: { name: 'punctuation.definition.string.end.js' } },
        },

        // Operators
        { name: 'keyword.operator.comparison.js', match: '===|!==|==|!=|<=|>=|<|>' },
        { name: 'keyword.operator.logical.js', match: '&&|\\|\\||!(?!=)|\\?\\?' },
        { name: 'keyword.operator.assignment.js', match: '\\+=|-=|\\*=|/=|%=|\\*\\*=|&&=|\\|\\|=|\\?\\?=|<<=|>>=|>>>=|&=|\\|=|\\^=|=(?![=>])' },
        { name: 'keyword.operator.arithmetic.js', match: '\\+\\+|--|\\*\\*|\\+|-|\\*|/|%' },
        { name: 'keyword.operator.bitwise.js', match: '<<|>>>|>>|&(?!&)|\\|(?!\\|)|\\^|~' },
        { name: 'keyword.operator.ternary.js', match: '\\?(?!\\?|\\.)|:' },
        { name: 'keyword.operator.spread.js', match: '\\.\\.\\.' },
        { name: 'keyword.operator.optional-chaining.js', match: '\\?\\.' },
        { name: 'storage.type.function.arrow.js', match: '=>' },

        // Property access with method call
        {
          name: 'meta.method-call.js',
          match: '(?<=\\.)\\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
          captures: { 1: { name: 'entity.name.function.js' } },
        },

        // Property access
        {
          name: 'meta.property.js',
          match: '(?<=\\.)\\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\\b(?!\\s*\\()',
          captures: { 1: { name: 'variable.other.property.js' } },
        },

        // Function call
        {
          name: 'meta.function-call.js',
          match: '\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()',
          captures: { 1: { name: 'entity.name.function.js' } },
        },

        // Identifiers
        {
          name: 'variable.other.readwrite.js',
          match: '\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\b',
        },
      ],
    },

    // Function parameters
    'function-parameters': {
      patterns: [
        // TypeScript type annotation in parameters
        {
          name: 'support.type.primitive.ts',
          match: '(?<=:\\s*)(string|number|boolean|void|never|any|unknown|null|undefined|object|symbol|bigint)\\b',
        },
        { name: 'variable.parameter.js', match: '\\b[a-zA-Z_$][a-zA-Z0-9_$]*\\b' },
        { name: 'keyword.operator.assignment.js', match: '=' },
        { name: 'keyword.operator.spread.js', match: '\\.\\.\\.' },
        { include: '#js-string' },
        { include: '#js-number' },
        { name: 'constant.language.js', match: '\\b(true|false|null|undefined)\\b' },
      ],
    },

    // CSS Content
    'css-content': {
      patterns: [
        { name: 'comment.block.css', begin: '/\\*', end: '\\*/' },
        { name: 'keyword.control.at-rule.css', match: '@[a-zA-Z-]+' },
        { name: 'entity.other.attribute-name.class.css', match: '\\.[a-zA-Z_-][a-zA-Z0-9_-]*' },
        { name: 'entity.other.attribute-name.id.css', match: '#[a-zA-Z_-][a-zA-Z0-9_-]*' },
        { name: 'entity.other.attribute-name.pseudo-class.css', match: ':[a-zA-Z-]+' },
        { name: 'support.type.property-name.css', match: '\\b[a-z-]+(?=\\s*:)' },
        { name: 'constant.other.color.css', match: '#[0-9a-fA-F]{3,8}\\b' },
        { name: 'constant.numeric.css', match: '-?\\d+(\\.\\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|deg|rad|s|ms)?' },
        { include: '#js-string' },
        { name: 'support.function.css', match: '\\b[a-zA-Z-]+(?=\\()' },
        { name: 'support.constant.css', match: '\\b(inherit|initial|unset|none|auto|block|inline|flex|grid|absolute|relative|fixed|sticky|hidden|visible|solid|dashed|dotted|center|left|right|top|bottom)\\b' },
      ],
    },
  },
}
