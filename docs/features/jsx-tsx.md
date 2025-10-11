# JSX/TSX Support

ts-syntax-highlighter provides complete support for JSX and TSX, making it ideal for React and other JSX-based frameworks.

## What is JSX/TSX?

**JSX (JavaScript XML)** is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files. It's commonly used with React.

**TSX (TypeScript XML)** is JSX with TypeScript type annotations, combining the benefits of both technologies.

## Basic JSX

### Simple Elements

```jsx
// Basic element
const element = <div>Hello World</div>

// With attributes
const button = <button className="primary">Click me</button>

// Self-closing
const image = <img src="photo.jpg" alt="Photo" />

// Multiple attributes
const input = (
  <input
    type="text"
    placeholder="Enter name"
    value={value}
    onChange={handleChange}
  />
)
```

### JSX Expressions

Embed JavaScript expressions using curly braces:

```jsx
// Variables
const greeting = (
  <h1>
    Hello,
    {name}
    !
  </h1>
)

// Function calls
const result = <div>{calculate(x, y)}</div>

// Expressions
const math = <span>{a + b}</span>

// Ternary operators
const message = (
  <div>
    {isLoggedIn ? <WelcomeMessage /> : <LoginPrompt />}
  </div>
)

// Logical AND
const alert = (
  <div>
    {hasError && <ErrorMessage />}
  </div>
)
```

### Nested JSX

```jsx
const card = (
  <div className="card">
    <header className="card-header">
      <h2>{title}</h2>
      <button onClick={onClose}>×</button>
    </header>
    <main className="card-body">
      {children}
    </main>
    <footer className="card-footer">
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </footer>
  </div>
)
```

## JSX Components

### Function Components

```jsx
function Welcome({ name }) {
  return (
    <h1>
      Hello,
      {name}
      !
    </h1>
  )
}

function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  )
}
```

### Component Composition

```jsx
function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}
```

### Props Spreading

```jsx
const button = <Button {...props} />

const input = (
  <Input
    {...commonProps}
    type="text"
    placeholder="Override"
  />
)
```

## TypeScript JSX (TSX)

### Typed Components

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary'
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage
const users = <List<User> items={users} renderItem={user => user.name} />
```

### Type Assertions in TSX

```typescript
const component = <Button<string> onClick={handler} />

const element = (
  <Component
    {...(props as ComponentProps)}
  />
)
```

### Typed Event Handlers

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log(event.currentTarget)
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value)
}

const form = (
  <form>
    <button onClick={handleClick}>Click</button>
    <input onChange={handleChange} />
  </form>
)
```

## Advanced JSX Patterns

### Fragments

```jsx
// Long form
const list = (
  <React.Fragment>
    <li>Item 1</li>
    <li>Item 2</li>
  </React.Fragment>
)

// Short form
const list = (
  <>
    <li>Item 1</li>
    <li>Item 2</li>
  </>
)

// With key
const list = items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </React.Fragment>
))
```

### Conditional Rendering

```jsx
// Ternary
const message = isLoggedIn ? <Welcome /> : <Login />

// Logical AND
const alert = hasError && <ErrorAlert />

// Nullish coalescing
const value = data ?? <Loading />

// Switch-like with object
const views = {
  home: <Home />,
  about: <About />,
  contact: <Contact />
}
const view = views[currentView]
```

### Lists and Keys

```jsx
const users = userList.map(user => (
  <UserCard
    key={user.id}
    name={user.name}
    email={user.email}
  />
))

const items = data.map((item, index) => (
  <li key={`${item.id}-${index}`}>
    {item.name}
  </li>
))
```

### Children Patterns

```jsx
// Render props
const DataProvider = ({ children }) => {
  const [data, setData] = useState(null)
  return children(data, setData)
}

<DataProvider>
  {(data, setData) => (
    <div>{data}</div>
  )}
</DataProvider>

// Children as function
const List = ({ items, children }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>{children(item)}</li>
    ))}
  </ul>
)

<List items={users}>
  {user => <UserCard user={user} />}
</List>
```

## JSX with Frameworks

### React

```jsx
import React from 'react'

function App() {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <p>
        Count:
        {count}
      </p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### Preact

```jsx
import { h } from 'preact'
import { useState } from 'preact/hooks'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>
        Count:
        {count}
      </p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### Solid

```jsx
import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <p>
        Count:
        {count()}
      </p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## Highlighting Features

### Accurate Tag Detection

```jsx
// Opening tags
<div>
<Component>
<custom-element>

// Self-closing tags
<img />
<Component />
<input />

// Closing tags
</div>
</Component>
</custom-element>
```

### Attribute Highlighting

```jsx
<Component
  // Standard attributes
  className="container"
  id="main"

  // Data attributes
  data-testid="component"

  // Aria attributes
  aria-label="Description"

  // Custom attributes
  customProp="value"

  // Boolean attributes
  disabled
  required

  // Event handlers
  onClick={handler}
  onChange={handleChange}
/>
```

### Expression Detection

```jsx
// Simple expressions
<div>{value}</div>

// Complex expressions
<div>{calculate(a, b, c)}</div>

// Nested JSX in expressions
<div>
  {items.map(item => (
    <Item key={item.id} {...item} />
  ))}
</div>

// Spread in JSX
<Component {...props} />
```

### Component vs. HTML Element

```jsx
// HTML elements (lowercase)
<div></div>
<span></span>
<button></button>

// Components (PascalCase)
<MyComponent />
<UserCard />
<Button />

// Custom elements (kebab-case)
<my-element></my-element>
<custom-button></custom-button>
```

## Common Patterns

### Conditional Classes

```jsx
const button = (
  <button
    className={`btn ${isPrimary ? 'btn-primary' : 'btn-secondary'} ${
      isDisabled ? 'disabled' : ''
    }`}
  >
    Click me
  </button>
)

// With classnames library
import classNames from 'classnames'

const button = (
  <button
    className={classNames('btn', {
      'btn-primary': isPrimary,
      'btn-secondary': !isPrimary,
      'disabled': isDisabled
    })}
  >
    Click me
  </button>
)
```

### Inline Styles

```jsx
const element = (
  <div
    style={{
      color: 'red',
      fontSize: '16px',
      backgroundColor: isActive ? 'blue' : 'gray'
    }}
  >
    Styled content
  </div>
)
```

### Refs

```jsx
const inputRef = React.useRef < HTMLInputElement > (null)

const form = (
  <form>
    <input ref={inputRef} type="text" />
    <button onClick={() => inputRef.current?.focus()}>
      Focus Input
    </button>
  </form>
)
```

## Performance

JSX/TSX tokenization is optimized for real-time highlighting:

```typescript
const tokenizer = new Tokenizer('javascript') // or 'typescript'

// Fast JSX tokenization
const code = `
const App = () => (
  <div className="app">
    <Header />
    <Main>{children}</Main>
    <Footer />
  </div>
)
`

const tokens = await tokenizer.tokenizeAsync(code)
// ~0.05ms - Fast enough for real-time highlighting
```

## Next Steps

- Explore [Modern Syntax Support](/features/modern-syntax)
- Learn about [Performance](/features/performance)
- Check out [Usage Examples](/usage#language-specific-features)
