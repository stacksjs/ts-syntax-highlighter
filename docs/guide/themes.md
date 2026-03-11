# Theme Configuration

ts-syntax-highlighter supports TextMate-style themes for customizing the visual appearance of highlighted code.

## Built-in Themes

The library includes several popular themes:

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  languages: ['javascript', 'typescript']
})

// Use a theme
const html = highlighter.codeToHtml(code, {
  language: 'typescript',
  theme: 'github-dark'
})
```

### Available Themes

- `github-dark` - GitHub's dark theme
- `github-light` - GitHub's light theme
- `one-dark` - Atom One Dark
- `dracula` - Dracula theme
- `nord` - Nord theme
- `monokai` - Monokai theme

## Theme Structure

Themes follow the TextMate/VS Code theme format:

```typescript
interface Theme {
  name: string
  type: 'dark' | 'light'
  colors: {
    'editor.background': string
    'editor.foreground': string
    // ... other editor colors
  }
  tokenColors: TokenColor[]
}

interface TokenColor {
  name?: string
  scope: string | string[]
  settings: {
    foreground?: string
    background?: string
    fontStyle?: 'italic' | 'bold' | 'underline' | 'strikethrough'
  }
}
```

## Creating Custom Themes

Define your own theme:

```typescript
const myTheme: Theme = {
  name: 'my-custom-theme',
  type: 'dark',
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
  },
  tokenColors: [
    {
      name: 'Comments',
      scope: ['comment', 'comment.line', 'comment.block'],
      settings: {
        foreground: '#6a9955',
        fontStyle: 'italic'
      }
    },
    {
      name: 'Keywords',
      scope: ['keyword', 'keyword.control', 'keyword.operator'],
      settings: {
        foreground: '#569cd6'
      }
    },
    {
      name: 'Strings',
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: '#ce9178'
      }
    },
    {
      name: 'Functions',
      scope: ['entity.name.function', 'support.function'],
      settings: {
        foreground: '#dcdcaa'
      }
    },
    {
      name: 'Variables',
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: '#9cdcfe'
      }
    },
    {
      name: 'Types',
      scope: ['entity.name.type', 'support.type'],
      settings: {
        foreground: '#4ec9b0'
      }
    },
    {
      name: 'Numbers',
      scope: ['constant.numeric'],
      settings: {
        foreground: '#b5cea8'
      }
    },
    {
      name: 'Operators',
      scope: ['keyword.operator'],
      settings: {
        foreground: '#d4d4d4'
      }
    }
  ]
}
```

## Using Custom Themes

Register and use your theme:

```typescript
import { createHighlighter, registerTheme } from 'ts-syntax-highlighter'

// Register the theme
registerTheme(myTheme)

const highlighter = await createHighlighter({
  themes: ['my-custom-theme'],
  languages: ['javascript']
})

const html = highlighter.codeToHtml(code, {
  language: 'javascript',
  theme: 'my-custom-theme'
})
```

## Dual Themes

Support light and dark modes with dual themes:

```typescript
import { createDualTheme } from 'ts-syntax-highlighter'

const dualTheme = createDualTheme({
  light: 'github-light',
  dark: 'github-dark'
})

// The output includes CSS variables for both themes
const html = highlighter.codeToHtml(code, {
  language: 'typescript',
  theme: dualTheme
})
```

The generated HTML includes CSS variables that respond to system preferences:

```css
/* Generated CSS */
.code-block {
  --code-bg: #ffffff;
  --code-fg: #24292e;
}

@media (prefers-color-scheme: dark) {
  .code-block {
    --code-bg: #0d1117;
    --code-fg: #c9d1d9;
  }
}
```

## Token Scopes

Common scopes used in themes:

### Comments
- `comment`
- `comment.line`
- `comment.block`
- `comment.documentation`

### Keywords
- `keyword`
- `keyword.control` (if, else, for, while)
- `keyword.operator` (+, -, *, /)
- `keyword.declaration` (const, let, var, function)

### Strings
- `string`
- `string.quoted.single`
- `string.quoted.double`
- `string.template`
- `string.regexp`

### Numbers
- `constant.numeric`
- `constant.numeric.integer`
- `constant.numeric.float`

### Variables
- `variable`
- `variable.other`
- `variable.parameter`
- `variable.language` (this, self)

### Functions
- `entity.name.function`
- `support.function`
- `meta.function-call`

### Types
- `entity.name.type`
- `entity.name.class`
- `entity.name.interface`
- `support.type`

### Punctuation
- `punctuation.definition`
- `punctuation.separator`
- `punctuation.bracket`

## Exporting Themes

Export themes in VS Code format:

```typescript
import { exportToVSCode } from 'ts-syntax-highlighter'

const vscodeTheme = exportToVSCode(myTheme)
// Returns VS Code compatible theme JSON
```

## Theme Customization

Override specific colors from an existing theme:

```typescript
import { extendTheme } from 'ts-syntax-highlighter'

const customTheme = extendTheme('github-dark', {
  tokenColors: [
    {
      scope: 'keyword',
      settings: {
        foreground: '#ff6b6b' // Override keyword color
      }
    }
  ]
})
```

## CSS Output Options

Control how styles are generated:

```typescript
const html = highlighter.codeToHtml(code, {
  language: 'typescript',
  theme: 'github-dark',
  css: {
    inline: true,    // Inline styles (default)
    classes: false,  // Use CSS classes
    variables: false // Use CSS custom properties
  }
})
```

### Inline Styles (Default)

```html
<span style="color: #ff6b6b">const</span>
```

### CSS Classes

```html
<span class="token keyword">const</span>
```

### CSS Variables

```html
<span style="color: var(--token-keyword)">const</span>
```
