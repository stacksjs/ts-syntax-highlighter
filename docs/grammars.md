# Grammars

ts-syntax-highlighter uses TextMate-style grammars to tokenize source code. This guide explains how grammars work and what features are supported for each language.

## How Grammars Work

A grammar defines the syntax rules for a programming language using:

1. **Keywords**: Reserved words with semantic meaning
2. **Patterns**: Regular expressions to match syntax elements
3. **Repository**: Reusable pattern definitions for complex structures
4. **Scopes**: Semantic names for tokens (e.g., `keyword.control.js`, `string.quoted.double.ts`)

### Tokenization Process

When you tokenize code, the highlighter:

1. Reads the source code character by character
2. Matches patterns against the current position
3. Produces tokens with type (scope) and content
4. Continues until the entire code is processed

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'

const tokenizer = new Tokenizer('javascript')
const tokens = tokenizer.tokenize('const x = 42')

// Result:
// [
//   {
//     line: 0,
//     tokens: [
//       { type: 'storage.type.js', content: 'const', line: 0, startIndex: 0 },
//       { type: 'punctuation.js', content: ' ', line: 0, startIndex: 5 },
//       { type: 'punctuation.js', content: 'x', line: 0, startIndex: 6 },
//       { type: 'punctuation.js', content: ' ', line: 0, startIndex: 7 },
//       { type: 'keyword.operator.js', content: '=', line: 0, startIndex: 8 },
//       { type: 'punctuation.js', content: ' ', line: 0, startIndex: 9 },
//       { type: 'constant.numeric.js', content: '42', line: 0, startIndex: 10 }
//     ]
//   }
// ]
```

## Supported Languages

### JavaScript/JSX

**Language ID**: `javascript`, `js`, `jsx`
**File Extensions**: `.js`, `.jsx`, `.mjs`, `.cjs`

#### Supported Features

**ES2024+ Features**:
- BigInt literals: `123n`, `0xFFn`
- Numeric separators: `1_000_000`, `0xFF_AA_BB`
- Optional chaining: `obj?.prop?.method?.()`
- Nullish coalescing: `value ?? default`
- Private class fields: `#privateField`

**JSX**:
```javascript
// JSX elements
const element = <div className="container">Hello</div>

// JSX with expressions
const greeting = (
  <h1>
    Hello,
    {name}
    !
  </h1>
)

// JSX components
const app = <MyComponent prop={value} />

// Nested JSX
const layout = (
  <Layout>
    <Header />
    <Content>{children}</Content>
    <Footer />
  </Layout>
)
```

**Template Literals**:
```javascript
const simple = `Hello World`
const withExpression = `Hello, ${name}!`
const multiline = `
  Line 1
  Line 2
`
```

**Regular Expressions**:
```javascript
const pattern = /[a-z]+/gi
const withFlags = /pattern/gimsuvy
```

**Modern Operators**:
```javascript
// Logical assignment
x ||= default
x &&= value
x ??= fallback

// Spread/rest
const arr = [...items]
const obj = { ...props }
const fn = (...args) => {}
```

#### Scopes

- `keyword.control.js`: if, else, for, while, return, etc.
- `storage.type.js`: const, let, var, function, class
- `keyword.operator.new.js`: new, typeof, instanceof, void, in, of
- `constant.language.js`: true, false, null, undefined, NaN, Infinity
- `string.quoted.double.js`, `string.quoted.single.js`: String literals
- `string.template.js`: Template literals
- `string.regexp.js`: Regular expressions
- `constant.numeric.js`: Numbers
- `entity.name.function.js`: Function names
- `meta.tag.jsx`: JSX elements
- `entity.name.tag.jsx`: JSX tag names
- `comment.line.double-slash.js`, `comment.block.js`: Comments

---

### TypeScript/TSX

**Language ID**: `typescript`, `ts`, `tsx`
**File Extensions**: `.ts`, `.tsx`, `.mts`, `.cts`

#### Supported Features

**All JavaScript features plus**:

**Type Annotations**:
```typescript
const name: string = 'John'
function add(a: number, b: number): number {
  return a + b
}
```

**Interfaces and Types**:
```typescript
interface User {
  id: number
  name: string
  email?: string
}

type Status = 'pending' | 'active' | 'inactive'
type Callback = (data: string) => void
```

**Generics**:
```typescript
function identity<T>(arg: T): T {
  return arg
}

class Container<T> {
  private value: T
  constructor(value: T) {
    this.value = value
  }
}
```

**Type Operators**:
```typescript
type Keys = keyof MyType
type Check = T extends string ? true : false
type Inferred = T extends Promise<infer U> ? U : never
```

**TSX**:
```typescript
const Component = <Button<string> onClick={handler} />

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>
}
```

**Utility Types**:
```typescript
type Partial<T> = { [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
```

#### Additional Scopes

- `storage.type.ts`: Built-in types (string, number, boolean, any, void, never, unknown)
- `keyword.operator.new.ts`: as, is, keyof, infer
- `entity.name.type.ts`: Custom type names
- `meta.type.annotation.ts`: Type annotations
- `meta.tag.tsx`: TSX elements

---

### HTML

**Language ID**: `html`, `htm`
**File Extensions**: `.html`, `.htm`

#### Supported Features

**HTML5 Elements**:
```html
<header>
  <nav></nav>
</header>
<main>
  <article></article>
  <section></section>
</main>
<footer></footer>
```

**Data Attributes**:
```html
<div
  data-user-id="123"
  data-role="admin"
  data-custom-value="test">
</div>
```

**ARIA Attributes**:
```html
<button
  aria-label="Close dialog"
  aria-hidden="false"
  aria-expanded="true">
  Close
</button>
```

**Event Handlers**:
```html
<button
  onclick="handleClick()"
  onmouseover="highlight()"
  onload="init()">
  Click me
</button>
```

**HTML Entities**:
```html
&lt; &gt; &amp; &quot; &nbsp; &copy;
```

**DOCTYPE**:
```html
<!DOCTYPE html>
<html lang="en">
```

#### Scopes

- `meta.tag.sgml.doctype.html`: DOCTYPE declaration
- `entity.name.tag.html`: Tag names
- `entity.other.attribute-name.html`: Attribute names
- `string.quoted.double.html`: Attribute values
- `comment.block.html`: Comments

---

### CSS

**Language ID**: `css`
**File Extensions**: `.css`

#### Supported Features

**Modern Color Functions**:
```css
.element {
  /* HWB (Hue, Whiteness, Blackness) */
  color: hwb(0 50% 50%);

  /* LAB and LCH */
  background: lab(50% 40 30);
  border-color: lch(60% 50 180);

  /* OKLAB and OKLCH */
  fill: oklab(0.5 0.1 0.1);
  stroke: oklch(60% 0.15 180);

  /* Color spaces */
  color: color(display-p3 0.5 0.7 0.2);
}
```

**Math Functions**:
```css
.element {
  /* Basic math */
  width: calc(100% - 20px);
  padding: min(2rem, 5%);
  margin: max(1rem, 2vw);
  font-size: clamp(1rem, 2.5vw, 2rem);

  /* Rounding */
  width: round(up, 101px, 10px);

  /* Sign and absolute value */
  margin-top: abs(-10px);
  transform: scale(sign(-5));

  /* Modulo and remainder */
  width: mod(18px, 5px);
  height: rem(18px, 5px);
}
```

**Trigonometric Functions**:
```css
.element {
  rotate: sin(45deg);
  transform: rotate(cos(1rad));
  --angle: tan(0.5turn);
  --value: asin(0.5);
  --value2: acos(0.5);
  --value3: atan(1);
  --value4: atan2(1, 1);
}
```

**Gradients**:
```css
.element {
  background: linear-gradient(to right, red, blue);
  background: radial-gradient(circle, red, blue);
  background: conic-gradient(from 0deg, red, blue);
  background: repeating-linear-gradient(red, blue 20px);
}
```

**At-Rules**:
```css
/* Media queries */
@media (min-width: 768px) {
  .element { display: flex; }
}

/* Keyframes */
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* Feature queries */
@supports (display: grid) {
  .element { display: grid; }
}

/* Container queries */
@container (min-width: 700px) {
  .card { font-size: 2em; }
}

/* Layers */
@layer base, components, utilities;
@layer components {
  .btn { padding: 1em; }
}

/* Property registration */
@property --my-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #c0ffee;
}
```

**CSS Custom Properties**:
```css
:root {
  --primary-color: #007bff;
  --spacing: 1rem;
  --font-size: clamp(1rem, 2.5vw, 2rem);
}

.element {
  color: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size, 16px);
}
```

#### Scopes

- `keyword.control.at-rule.css`: At-rules (@media, @keyframes, etc.)
- `support.function.color.css`: Color functions
- `support.function.css`: Other functions (calc, var, etc.)
- `variable.other.custom-property.css`: CSS variables
- `entity.name.tag.css`: Selectors
- `support.type.property-name.css`: Property names
- `constant.numeric.css`: Numbers and units

---

### JSON

**Language ID**: `json`
**File Extensions**: `.json`, `.jsonc`

#### Supported Features

**Objects and Arrays**:
```json
{
  "name": "John Doe",
  "age": 30,
  "tags": ["admin", "user"]
}
```

**All Value Types**:
```json
{
  "string": "Hello",
  "number": 42,
  "float": 3.14,
  "scientific": 1.5e10,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": { "key": "value" }
}
```

**Escape Sequences**:
```json
{
  "escaped": "Line 1\nLine 2\tTabbed",
  "unicode": "\u0048\u0065\u006C\u006C\u006F"
}
```

**Invalid Escape Detection**:
```json
{
  "invalid": "\x"  // Detected as invalid
}
```

#### Scopes

- `constant.language.json`: true, false, null
- `constant.numeric.json`: Numbers
- `string.quoted.double.json`: Strings
- `constant.character.escape.json`: Valid escapes
- `invalid.illegal.unrecognized-string-escape.json`: Invalid escapes
- `meta.structure.dictionary.json`: Objects
- `meta.structure.array.json`: Arrays

---

### STX

**Language ID**: `stx`
**File Extensions**: `.stx`

STX is a Blade-like templating language with 50+ directives.

#### Supported Features

**Echo Syntax**:
```stx
{{ variable }}
{{{ unescaped }}}
{!! rawHtml !!}
```

**Control Flow**:
```stx
@if (condition)
  Content
@elseif (otherCondition)
  Other content
@else
  Default content
@endif

@unless (condition)
  Content when false
@endunless
```

**Loops**:
```stx
@foreach (users as user)
  {{ user.name }}
@endforeach

@for (i = 0; i < 10; i++)
  {{ i }}
@endfor

@while (condition)
  Content
@endwhile
```

**Components**:
```stx
@component('alert', { type: 'warning' })
  Warning message
@endcomponent

@slot('title')
  Alert Title
@endslot
```

**Authentication**:
```stx
@auth
  Welcome, {{ user.name }}
@endauth

@guest
  Please log in
@endguest

@can('edit', post)
  Edit button
@endcan
```

**And much more**: layouts, includes, stacks, sections, translations, etc.

## Custom Grammars

You can examine the grammar definitions in the source code:

```typescript
import { javascriptGrammar, typescriptGrammar } from 'ts-syntax-highlighter'

console.log(javascriptGrammar.keywords)
console.log(javascriptGrammar.patterns)
console.log(javascriptGrammar.repository)
```

Each grammar exports:
- `keywords`: Keyword-to-scope mappings
- `patterns`: Ordered list of patterns to match
- `repository`: Named pattern collections

## Scope Naming Convention

Scopes follow the TextMate convention:

```
<category>.<sub-category>.<language>
```

Examples:
- `keyword.control.js`: Control keywords in JavaScript
- `string.quoted.double.ts`: Double-quoted strings in TypeScript
- `entity.name.function.js`: Function names in JavaScript
- `support.function.css`: CSS functions
- `meta.tag.jsx`: JSX tags

These scopes can be styled using CSS or theme definitions.

## Performance Considerations

Grammars are optimized for performance:

1. **Pattern Order**: Common patterns are checked first
2. **Fast Paths**: Simple tokens (punctuation) use optimized matching
3. **Regex Optimization**: Patterns are pre-compiled and cached
4. **Minimal Backtracking**: Patterns designed to minimize regex backtracking

This results in **12-77x faster** tokenization compared to alternatives.

## Next Steps

- See [Usage](/usage) for practical examples
- Check [Configuration](/config) for advanced options
- Explore the source code for grammar definitions
