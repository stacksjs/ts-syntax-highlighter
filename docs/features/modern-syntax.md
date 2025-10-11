# Modern Syntax Support

ts-syntax-highlighter stays up-to-date with the latest language features, ensuring accurate highlighting for modern code.

## JavaScript ES2024+

### BigInt Literals

Full support for BigInt with the `n` suffix:

```javascript
const big = 123n
const hex = 0xFFn
const binary = 0b1010n
const octal = 0o777n

// With numeric separators
const trillion = 1_000_000_000_000n
```

### Numeric Separators

Makes large numbers more readable:

```javascript
const million = 1_000_000
const billion = 1_000_000_000
const hex = 0xFF_AA_BB
const binary = 0b1111_0000_1010_1100
```

### Optional Chaining

Safe property access:

```javascript
const value = obj?.prop?.nested?.value
const result = arr?.[0]?.method?.()
const fn = obj?.method?.(args)
```

### Nullish Coalescing

Default values that respect falsy values:

```javascript
const value = input ?? 'default'
const port = config.port ?? 3000
const enabled = settings.enabled ?? true
```

### Logical Assignment Operators

```javascript
// OR assignment
x ||= default

// AND assignment
x &&= value

// Nullish assignment
x ??= fallback
```

### Private Class Fields

```javascript
class User {
  #privateField = 'secret'

  #privateMethod() {
    return this.#privateField
  }

  getSecret() {
    return this.#privateMethod()
  }
}
```

### Template Literals

Complete support including nested expressions:

```javascript
const simple = `Hello World`
const withVar = `Hello, ${name}!`
const nested = `Result: ${calculate(x, y)}`
const multiline = `
  Line 1
  Line 2
  Line 3
`
```

### Regular Expressions

All regex flags supported:

```javascript
const pattern = /[a-z]+/gi
const unicode = /\p{Emoji}/u
const sticky = /pattern/y
const dotAll = /pattern/s
const named = /(?<year>\d{4})-(?<month>\d{2})/

// All flags: g, i, m, s, u, v, y
const allFlags = /pattern/gimsuvy
```

## TypeScript Features

### Type Annotations

```typescript
const name: string = 'John'
const age: number = 30
const active: boolean = true

function greet(name: string): void {
  console.log(`Hello, ${name}`)
}
```

### Interfaces and Types

```typescript
interface User {
  id: number
  name: string
  email?: string
  readonly createdAt: Date
}

type Status = 'pending' | 'active' | 'inactive'
type Callback = (data: string) => void
type Nullable<T> = T | null
```

### Generics

```typescript
function identity<T>(arg: T): T {
  return arg
}

class Container<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }
}

interface Repository<T> {
  find: (id: string) => Promise<T>
  save: (entity: T) => Promise<void>
}
```

### Type Operators

```typescript
// keyof
type UserKeys = keyof User

// typeof
const user = { name: 'John', age: 30 }
type UserType = typeof user

// in
type Flags = 'read' | 'write' | 'execute'
type Permissions = {
  [K in Flags]: boolean
}

// is (type predicate)
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// infer
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type ElementType<T> = T extends (infer U)[] ? U : never
```

### Utility Types

```typescript
type Partial<T> = { [P in keyof T]?: T[P] }
type Required<T> = { [P in keyof T]-?: T[P] }
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Record<K extends string | number | symbol, T> = { [P in K]: T }
```

### Decorators

```typescript
@sealed
class BugReport {
  @logged
  title: string

  @validate
  save() {
    // ...
  }
}
```

## JSX/TSX

### JSX Elements

```jsx
const element = <div className="container">Hello</div>

const withProps = (
  <Button
    variant="primary"
    onClick={handleClick}
    disabled={isLoading}
  >
    Click me
  </Button>
)
```

### JSX Expressions

```jsx
const greeting = (
  <h1>
    Hello,
    {name}
    !
  </h1>
)

const conditional = (
  <div>
    {isLoggedIn ? <UserMenu /> : <LoginButton />}
  </div>
)

const list = (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
)
```

### Nested JSX

```jsx
const layout = (
  <Layout>
    <Header>
      <Navigation />
      <UserMenu />
    </Header>
    <Main>
      <Sidebar />
      <Content>
        {children}
      </Content>
    </Main>
    <Footer />
  </Layout>
)
```

### TSX with Generics

```typescript
const Component = <T extends string>(props: Props<T>) => {
  return <div>{props.value}</div>
}

const button = <Button<string> onClick={handler} />
```

## HTML5

### Modern Elements

```html
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <section>
      <h1>Title</h1>
      <p>Content</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025</p>
</footer>
```

### Data Attributes

```html
<div
  data-user-id="123"
  data-role="admin"
  data-status="active"
  data-created-at="2025-01-01">
  User data
</div>
```

### ARIA Attributes

```html
<button
  aria-label="Close dialog"
  aria-expanded="false"
  aria-controls="modal"
  aria-describedby="help-text">
  Close
</button>

<nav aria-label="Main navigation">
  <ul role="list">
    <li role="listitem">
      <a href="/" aria-current="page">Home</a>
    </li>
  </ul>
</nav>
```

### Event Handlers

```html
<button
  onclick="handleClick()"
  onmouseover="highlight()"
  onmouseout="unhighlight()"
  onfocus="showTooltip()"
  onblur="hideTooltip()">
  Interactive button
</button>
```

## CSS4

### Modern Color Functions

```css
.element {
  /* HWB (Hue, Whiteness, Blackness) */
  color: hwb(0 50% 50%);

  /* LAB color space */
  background: lab(50% 40 30);

  /* LCH (Lightness, Chroma, Hue) */
  border-color: lch(60% 50 180);

  /* OKLAB - perceptually uniform */
  fill: oklab(0.5 0.1 0.1);

  /* OKLCH - polar OKLAB */
  stroke: oklch(60% 0.15 180);

  /* Color spaces */
  color: color(display-p3 0.5 0.7 0.2);
}
```

### Math Functions

```css
.element {
  /* Basic math */
  width: calc(100% - 20px);
  padding: min(2rem, 5%);
  margin: max(1rem, 2vw);
  font-size: clamp(1rem, 2.5vw, 2rem);

  /* Rounding */
  width: round(up, 101px, 10px);
  height: round(down, 99px, 10px);

  /* Sign and absolute */
  margin-top: abs(-10px);
  transform: scale(sign(-5));

  /* Modulo and remainder */
  width: mod(18px, 5px);
  height: rem(18px, 5px);

  /* Trigonometry */
  rotate: sin(45deg);
  transform: rotate(cos(1rad));
  --angle: tan(0.5turn);
  --value: asin(0.5);
}
```

### Container Queries

```css
@container (min-width: 700px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}

@container card (inline-size > 400px) {
  .card-content {
    font-size: 1.2em;
  }
}
```

### CSS Layers

```css
@layer reset, base, components, utilities;

@layer base {
  h1 {
    font-size: 2em;
  }
}

@layer components {
  .btn {
    padding: 1em;
    border-radius: 0.5em;
  }
}

@layer utilities {
  .text-center {
    text-align: center;
  }
}
```

### Custom Properties

```css
:root {
  --primary-color: #007bff;
  --spacing: 1rem;
  --font-size: clamp(1rem, 2.5vw, 2rem);
  --gradient: linear-gradient(to right, red, blue);
}

.element {
  color: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size, 16px);
  background: var(--gradient);
}
```

### Property Registration

```css
@property --my-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #c0ffee;
}

@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

## Why Modern Syntax Matters

### 1. Accurate Highlighting

Modern features are highlighted correctly:

```typescript
// ✅ Correctly highlighted
const big = 123n
const value = obj?.prop

// ❌ Other highlighters may treat these as errors
```

### 2. Better Developer Experience

Proper highlighting helps developers:
- Spot syntax errors quickly
- Understand code structure
- Learn new language features
- Write better code

### 3. Future-Proof

New features are added regularly:
- ES2024, ES2025, and beyond
- TypeScript 5.x features
- CSS specifications as they're finalized
- HTML living standard updates

## Staying Current

ts-syntax-highlighter is actively maintained to support the latest language features:

- **Monthly updates** for new language features
- **Comprehensive testing** for all syntax
- **Community feedback** to prioritize features
- **Backward compatibility** maintained

## Next Steps

- Explore [JSX/TSX Support](/features/jsx-tsx)
- Learn about [Performance](/features/performance)
- Check out [Language Grammars](/grammars)
