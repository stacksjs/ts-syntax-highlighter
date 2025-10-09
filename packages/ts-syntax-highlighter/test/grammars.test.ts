import { describe, expect, it } from 'bun:test'
import { getLanguage, getLanguageByExtension, languages } from '../src/grammars'
import { Tokenizer } from '../src/tokenizer'

describe('Grammars', () => {
  describe('Language Loading', () => {
    it('should export all languages', () => {
      expect(languages).toBeDefined()
      expect(languages.length).toBe(5) // js, ts, html, css, stx
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
        ['.ts', 'typescript'],
        ['.html', 'html'],
        ['.css', 'css'],
        ['.stx', 'stx'],
      ]

      for (const [ext, expectedId] of extensions) {
        const lang = getLanguageByExtension(ext)
        expect(lang?.id).toBe(expectedId)
      }
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
  })

  describe('STX Grammar', () => {
    const lang = getLanguage('stx')!
    const tokenizer = new Tokenizer(lang.grammar)

    it('should tokenize STX code', () => {
      const code = 'stx example code'
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })

    it('should handle empty STX code', () => {
      const code = ''
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
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
