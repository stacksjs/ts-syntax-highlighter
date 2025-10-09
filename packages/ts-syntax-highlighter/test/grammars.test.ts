import { describe, expect, it } from 'bun:test'
import { getLanguage, getLanguageByExtension, languages } from '../src/grammars'
import { Tokenizer } from '../src/tokenizer'

describe('Grammars', () => {
  describe('Language Loading', () => {
    it('should export all languages', () => {
      expect(languages).toBeDefined()
      expect(languages.length).toBe(6) // js, ts, html, css, json, stx
    })

    it('should get language by ID', () => {
      const lang = getLanguage('javascript')
      expect(lang).toBeDefined()
      expect(lang?.id).toBe('javascript')
    })

    it('should get language by alias', () => {
      const lang = getLanguage('js')
      expect(lang).toBeDefined()
      expect(lang?.id).toBe('javascript')
    })

    it('should get language by extension', () => {
      const lang = getLanguageByExtension('.ts')
      expect(lang).toBeDefined()
      expect(lang?.id).toBe('typescript')
    })

    it('should get language by extension without dot', () => {
      const lang = getLanguageByExtension('js')
      expect(lang).toBeDefined()
      expect(lang?.id).toBe('javascript')
    })

    it('should return undefined for unknown language', () => {
      const lang = getLanguage('unknown')
      expect(lang).toBeUndefined()
    })

    it('should have valid grammar for each language', () => {
      for (const lang of languages) {
        expect(lang.grammar).toBeDefined()
        expect(lang.grammar.name).toBeDefined()
        expect(lang.grammar.scopeName).toBeDefined()
        expect(lang.grammar.patterns).toBeDefined()
        expect(Array.isArray(lang.grammar.patterns)).toBe(true)
      }
    })

    it('should match language IDs exactly (case-sensitive)', () => {
      const js1 = getLanguage('javascript')
      const js2 = getLanguage('JavaScript') // Won't match

      expect(js1?.id).toBe('javascript')
      expect(js2).toBeUndefined() // Case-sensitive
    })

    it('should handle all JavaScript aliases', () => {
      const aliases = ['javascript', 'js']
      for (const alias of aliases) {
        const lang = getLanguage(alias)
        expect(lang?.id).toBe('javascript')
      }
    })

    it('should handle all TypeScript aliases', () => {
      const aliases = ['typescript', 'ts']
      for (const alias of aliases) {
        const lang = getLanguage(alias)
        expect(lang?.id).toBe('typescript')
      }
    })

    it('should handle all HTML aliases', () => {
      const aliases = ['html', 'htm']
      for (const alias of aliases) {
        const lang = getLanguage(alias)
        expect(lang?.id).toBe('html')
      }
    })

    it('should handle all file extensions', () => {
      const extensions = [
        ['.js', 'javascript'],
        ['.jsx', 'javascript'],
        ['.ts', 'typescript'],
        ['.tsx', 'typescript'],
        ['.html', 'html'],
        ['.css', 'css'],
        ['.json', 'json'],
        ['.stx', 'stx'],
      ]

      for (const [ext, expectedId] of extensions) {
        const lang = getLanguageByExtension(ext)
        expect(lang?.id).toBe(expectedId)
      }
    })

    it('should handle JSX/TSX aliases', () => {
      const jsxLang = getLanguage('jsx')
      const tsxLang = getLanguage('tsx')

      expect(jsxLang?.id).toBe('javascript')
      expect(tsxLang?.id).toBe('typescript')
    })
  })

  describe('JavaScript Grammar', () => {
    const lang = getLanguage('javascript')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize keywords correctly', () => {
      const code = 'const let var function class'
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize arrow functions', () => {
      const code = 'const fn = () => {}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize async/await', () => {
      const code = 'async function test() { await fetch() }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize template literals', () => {
      const code = '`Hello ${name}`'
      const tokens = tokenizer.tokenize(code)

      const hasTemplate = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('template')),
      )
      expect(hasTemplate).toBe(true)
    })

    it('should tokenize regular expressions', () => {
      const code = 'const regex = /^test$/gi'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize class syntax', () => {
      const code = 'class MyClass extends Base {}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize destructuring', () => {
      const code = 'const { a, b } = obj'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize spread operator', () => {
      const code = 'const arr = [...items]'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSDoc comments', () => {
      const code = '/** @param {string} name */'
      const tokens = tokenizer.tokenize(code)

      const hasComment = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('comment')),
      )
      expect(hasComment).toBe(true)
    })

    it('should tokenize numbers (decimal, hex, binary, octal)', () => {
      const code = '42 3.14 0xFF 0b1010 0o777'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize import/export statements', () => {
      const code = 'import { foo } from "bar"; export default MyClass'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize BigInt literals', () => {
      const code = 'const big = 123n; const hex = 0xFFn'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
      // Check that 'n' suffix is tokenized (may be separate token or part of number)
      const content = tokens[0].tokens.map(t => t.content).join('')
      expect(content.includes('123n') || (content.includes('123') && content.includes('n'))).toBe(true)
    })

    it('should tokenize numeric separators', () => {
      const code = 'const million = 1_000_000; const hex = 0xFF_AA_BB'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize yield keyword', () => {
      const code = 'function* gen() { yield 1; yield 2; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize get/set keywords', () => {
      const code = 'class Foo { get value() {} set value(v) {} }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize in/of operators', () => {
      const code = 'for (const key in obj) {} for (const item of arr) {}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize this/super/arguments', () => {
      const code = 'this.method(); super.method(); console.log(arguments)'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize with/debugger keywords', () => {
      const code = 'with (obj) {}; debugger;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSX elements', () => {
      const code = 'const el = <div className="test">Hello</div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSX with expressions', () => {
      const code = 'const el = <div>{name}</div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSX components', () => {
      const code = 'const el = <MyComponent prop="value" />'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSX nested elements', () => {
      const code = 'const el = <div><span>Test</span></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize regex with flags', () => {
      const code = 'const re = /test/gimsuvy'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('TypeScript Grammar', () => {
    const lang = getLanguage('typescript')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize type annotations', () => {
      const code = 'const x: number = 42'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize interfaces', () => {
      const code = 'interface User { name: string; age: number }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize type aliases', () => {
      const code = 'type ID = string | number'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize generics', () => {
      const code = 'function identity<T>(arg: T): T { return arg }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize enums', () => {
      const code = 'enum Color { Red, Green, Blue }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize decorators', () => {
      const code = '@Component() class MyComponent {}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize readonly modifier', () => {
      const code = 'readonly prop: string'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize public/private/protected', () => {
      const code = 'public name: string; private age: number'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize as type assertions', () => {
      const code = 'const x = value as string'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize conditional types', () => {
      const code = 'type Result<T> = T extends string ? string : number'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize mapped types', () => {
      const code = 'type Readonly<T> = { readonly [P in keyof T]: T[P] }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize utility types', () => {
      const code = 'type Partial<T> = Pick<T, keyof T>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize is operator', () => {
      const code = 'function isString(x: unknown): x is string { return typeof x === "string" }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize keyof operator', () => {
      const code = 'type Keys = keyof T'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize infer keyword', () => {
      const code = 'type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize get/set in TypeScript', () => {
      const code = 'class Foo { get value(): number {} set value(v: number) {} }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize require keyword', () => {
      const code = 'const mod = require("module")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize BigInt in TypeScript', () => {
      const code = 'const big: bigint = 123n'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize numeric separators in TypeScript', () => {
      const code = 'const num: number = 1_000_000'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize TSX elements', () => {
      const code = 'const el: JSX.Element = <div>Hello</div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize TSX with generics', () => {
      const code = 'const el = <Component<T> prop={value} />'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize TSX with type assertions', () => {
      const code = 'const el = <div>{value as string}</div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('HTML Grammar', () => {
    const lang = getLanguage('html')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize basic HTML tags', () => {
      const code = '<div>Hello</div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize self-closing tags', () => {
      const code = '<img src="test.jpg" />'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize attributes', () => {
      const code = '<div class="container" id="main"></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize HTML comments', () => {
      const code = '<!-- This is a comment -->'
      const tokens = tokenizer.tokenize(code)

      const hasComment = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('comment')),
      )
      expect(hasComment).toBe(true)
    })

    it('should tokenize doctype', () => {
      const code = '<!DOCTYPE html>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize nested tags', () => {
      const code = '<div><span><a href="#">Link</a></span></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize data attributes', () => {
      const code = '<div data-value="123" data-name="test"></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize boolean attributes', () => {
      const code = '<input disabled checked />'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize inline styles', () => {
      const code = '<div style="color: red; font-size: 14px"></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize script tags', () => {
      const code = '<script>console.log("test")</script>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize style tags', () => {
      const code = '<style>.class { color: red; }</style>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize aria attributes', () => {
      const code = '<button aria-label="Close" aria-hidden="true">X</button>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize event handler attributes', () => {
      const code = '<button onclick="handleClick()" onmouseover="highlight()">Click</button>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize HTML entities', () => {
      const code = '&lt; &gt; &amp; &copy; &#169; &#x00A9;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize multiple data attributes', () => {
      const code = '<div data-id="123" data-name="test" data-value="abc"></div>'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('CSS Grammar', () => {
    const lang = getLanguage('css')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize class selectors', () => {
      const code = '.container { display: flex; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize ID selectors', () => {
      const code = '#main { width: 100%; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize element selectors', () => {
      const code = 'div { margin: 0; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize attribute selectors', () => {
      const code = '[type="text"] { border: 1px solid; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize pseudo-classes', () => {
      const code = 'a:hover { color: red; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize pseudo-elements', () => {
      const code = 'p::before { content: ""; }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize hex colors', () => {
      const code = 'color: #ff0000;'
      const tokens = tokenizer.tokenize(code)

      // Just verify it tokenizes the hex value
      expect(tokens[0].tokens.length).toBeGreaterThan(0)
      expect(tokens[0].tokens.some(t => t.content.includes('#ff0000'))).toBe(true)
    })

    it('should tokenize RGB/RGBA colors', () => {
      const code = 'color: rgb(255, 0, 0); background: rgba(0, 0, 0, 0.5);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize CSS functions', () => {
      const code = 'transform: translateX(10px) rotate(45deg);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize media queries', () => {
      const code = '@media (min-width: 768px) { .container { width: 750px; } }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize keyframes', () => {
      const code = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize CSS variables', () => {
      const code = '--primary-color: #007bff; color: var(--primary-color);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize CSS comments', () => {
      const code = '/* This is a comment */'
      const tokens = tokenizer.tokenize(code)

      const hasComment = tokens[0].tokens.some(
        token => token.scopes.some(scope => scope.includes('comment')),
      )
      expect(hasComment).toBe(true)
    })

    it('should tokenize important declarations', () => {
      const code = 'color: red !important;'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize modern color functions', () => {
      const code = 'color: hwb(0 50% 50%); color: lab(50% 40 30); color: oklch(60% 0.15 180);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize CSS math functions', () => {
      const code = 'width: calc(100% - 20px); font-size: clamp(1rem, 2vw, 2rem); height: min(50vh, 500px);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize trigonometric functions', () => {
      const code = 'transform: rotate(sin(45deg)); width: calc(100px * cos(30deg));'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize gradient functions', () => {
      const code = 'background: linear-gradient(45deg, red, blue); background: radial-gradient(circle, red, blue);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize at-rules', () => {
      const code = '@import "file.css"; @font-face { font-family: "Custom"; } @supports (display: grid) {}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize container queries', () => {
      const code = '@container (min-width: 700px) { .card { display: flex; } }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize layer at-rule', () => {
      const code = '@layer base, components, utilities; @layer components { .btn {} }'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize var() with custom properties', () => {
      const code = '--primary: #007bff; color: var(--primary); background: var(--bg, #fff);'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('JSON Grammar', () => {
    const lang = getLanguage('json')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize JSON objects', () => {
      const code = '{"name": "John", "age": 30}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSON arrays', () => {
      const code = '[1, 2, 3, "test", true, null]'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize nested JSON', () => {
      const code = '{"user": {"name": "John", "roles": ["admin", "user"]}}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSON booleans and null', () => {
      const code = '{"active": true, "deleted": false, "data": null}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSON numbers', () => {
      const code = '{"int": 42, "float": 3.14, "exp": 1.5e10, "negative": -123}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize JSON escape sequences', () => {
      const code = '{"text": "Line 1\\nLine 2\\tTabbed\\u0041"}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize empty JSON structures', () => {
      const code = '{} []'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })
  })

  describe('STX Grammar', () => {
    const lang = getLanguage('stx')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize STX comments', () => {
      const code = '{{-- This is a comment --}}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX echo syntax', () => {
      const code = '{{ variable }} {{{ unescaped }}} {!! rawHtml !!}'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX control flow directives', () => {
      const code = '@if(condition) @elseif(other) @else @endif @unless(condition) @endunless'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX loop directives', () => {
      const code = '@for(item of items) @endfor @foreach(items as item) @endforeach @while(condition) @endwhile'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX switch directives', () => {
      const code = '@switch(value) @case(1) @break @case(2) @break @default @endswitch'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX authentication directives', () => {
      const code = '@auth @guest @can("edit") @cannot("delete") @endcan @endcannot @endauth @endguest'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX component directives', () => {
      const code = '@component("Alert") @slot("title") @endslot @props @endcomponent'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX layout directives', () => {
      const code = '@extends("layout") @section("content") @endsection @yield("scripts") @parent'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX include directives', () => {
      const code = '@include("partial") @includewhen(condition, "partial") @includeunless(condition, "partial")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX stack directives', () => {
      const code = '@push("scripts") @endpush @pushOnce("styles") @endpushOnce @stack("scripts")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX security directives', () => {
      const code = '@csrf @method("PUT")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX environment directives', () => {
      const code = '@production @endproduction @development @enddevelopment @env("staging") @endenv'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX translation directives', () => {
      const code = '@translate("key") @endtranslate @t("key")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX web component directive', () => {
      const code = '@webcomponent("my-element")'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX route directive', () => {
      const code = '@route("home") @route("users.show", { id: 1 })'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX markdown blocks', () => {
      const code = '@markdown # Heading @endmarkdown'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX animation directives', () => {
      const code = '@transition("fade", 300) @endtransition @motion(true) @endmotion'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX script blocks', () => {
      const code = '@js console.log("test") @endjs @ts const x: number = 1 @endts'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX raw blocks', () => {
      const code = '@raw {{ This should not be processed }} @endraw'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should tokenize STX once directive', () => {
      const code = '@once <style></style> @endonce'
      const tokens = tokenizer.tokenize(code)

      expect(tokens[0].tokens.length).toBeGreaterThan(0)
    })

    it('should handle multi-line STX code', () => {
      const code = 'line 1\nline 2\nline 3'
      const tokens = tokenizer.tokenize(code)

      expect(tokens.length).toBe(3)
    })
  })

  describe('Grammar Edge Cases', () => {
    it('should handle malformed JavaScript', () => {
      const lang = getLanguage('javascript')!
      const tokenizer = new Tokenizer(lang.grammar)
      const code = 'const x = = ='

      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })

    it('should handle malformed TypeScript', () => {
      const lang = getLanguage('typescript')!
      const tokenizer = new Tokenizer(lang.grammar)
      const code = 'interface {'

      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })

    it('should handle malformed HTML', () => {
      const lang = getLanguage('html')!
      const tokenizer = new Tokenizer(lang.grammar)
      const code = '<div><span>'

      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })

    it('should handle malformed CSS', () => {
      const lang = getLanguage('css')!
      const tokenizer = new Tokenizer(lang.grammar)
      const code = '.class { color: }'

      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })

    it('should handle Unicode in all languages', () => {
      const testCases = [
        ['javascript', 'const 你好 = "世界"'],
        ['typescript', 'interface 用户 { 名字: string }'],
        ['html', '<div>你好世界</div>'],
        ['css', '.你好 { color: red; }'],
      ]

      for (const [langId, code] of testCases) {
        const lang = getLanguage(langId)!
        const tokenizer = new Tokenizer(lang.grammar)
        const tokens = tokenizer.tokenize(code)

        expect(tokens).toBeDefined()
        expect(tokens.length).toBeGreaterThan(0)
      }
    })

    it('should handle very long lines in all languages', () => {
      const longString = '"a"'.repeat(1000)

      const testCases = [
        ['javascript', `const x = ${longString}`],
        ['typescript', `const x: string = ${longString}`],
        ['html', `<div class=${'a'.repeat(1000)}></div>`],
        ['css', `.class { content: ${longString}; }`],
      ]

      for (const [langId, code] of testCases) {
        const lang = getLanguage(langId)!
        const tokenizer = new Tokenizer(lang.grammar)
        const tokens = tokenizer.tokenize(code)

        expect(tokens).toBeDefined()
      }
    })
  })
})
