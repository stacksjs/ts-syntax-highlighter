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
        // Script with client attribute
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
        // Regular script
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
        // Block directives with @end
        {
          name: 'keyword.control.directive.stx',
          match: '@(if|elseif|else|endif|foreach|endforeach|for|endfor|while|endwhile|switch|case|default|endswitch|auth|endauth|guest|endguest|section|endsection|push|endpush|once|endonce|unless|endunless|isset|endisset|empty|endempty|can|cannot|endcan|endcannot|canany|endcanany|error|enderror|production|endproduction|env|endenv|verbatim|endverbatim)\\b',
        },
        // Inline directives
        {
          name: 'keyword.control.directive.stx',
          match: '@(include|layout|extends|yield|component|stack|csrf|method|json|translate|t|slot|props|inject|parent|show|hasSection|sectionMissing|includeIf|includeWhen|includeUnless|includeFirst|each|break|continue|php|endphp|class|style|checked|selected|disabled|readonly|required|aware|vite|entrypoint)\\b',
        },
        // Generic directive (catch-all)
        {
          name: 'keyword.control.directive.stx',
          match: '@[a-zA-Z_][a-zA-Z0-9_]*',
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
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.component.stx' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
            2: { name: 'punctuation.definition.tag.end.stx' },
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
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.component.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
          },
        },
        // kebab-case component opening tag (must contain hyphen)
        {
          name: 'meta.tag.component.stx',
          begin: '(<)([a-z][a-z0-9]*-[a-z0-9-]*)\\b',
          beginCaptures: {
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.component.stx' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
            2: { name: 'punctuation.definition.tag.end.stx' },
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
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.component.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
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
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.slot.stx' },
          },
          end: '(/>)|(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
            2: { name: 'punctuation.definition.tag.end.stx' },
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
            1: { name: 'punctuation.definition.tag.begin.stx' },
            2: { name: 'entity.name.tag.slot.stx' },
          },
          end: '(>)',
          endCaptures: {
            1: { name: 'punctuation.definition.tag.end.stx' },
          },
        },
      ],
    },

    // Tag Attributes
    'tag-attributes': {
      patterns: [
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
        // Alpine x-* directives
        {
          name: 'meta.attribute.directive.stx',
          begin: '(x-(?:data|text|html|model|show|hide|if|bind|on|ref|init|effect|cloak|ignore|transition(?::[a-z-]+)?))\\s*(=)\\s*(")',
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
        // Alpine x-* without value
        {
          name: 'entity.other.attribute-name.directive.stx',
          match: 'x-(cloak|ignore|id|teleport|modelable)\\b',
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

    // Script Content
    'script-content': {
      patterns: [
        { name: 'comment.line.double-slash.js', match: '//.*$' },
        { name: 'comment.block.js', begin: '/\\*', end: '\\*/' },
        {
          name: 'meta.import.js',
          begin: '\\b(import)\\b',
          beginCaptures: { 1: { name: 'keyword.control.import.js' } },
          end: '(?=;|$)',
          patterns: [
            { name: 'keyword.control.from.js', match: '\\bfrom\\b' },
            { name: 'keyword.control.as.js', match: '\\bas\\b' },
            { include: '#js-string' },
            { include: '#js-identifier' },
          ],
        },
        {
          name: 'meta.export.js',
          match: '\\b(export)\\s+(default)?\\b',
          captures: {
            1: { name: 'keyword.control.export.js' },
            2: { name: 'keyword.control.default.js' },
          },
        },
        { include: '#js-expression' },
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
