## Advanced Features

This syntax highlighter includes powerful features that make it competitive with Shiki and Torchlight.

### Diff Highlighting

Highlight added and removed lines with visual indicators:

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter()

const result = await highlighter.highlight(code, 'javascript', {
  lineNumbers: true,
  addedLines: [2, 5, 6],      // Green background with + indicator
  removedLines: [3],            // Red background with - indicator
})
```

### Focus Mode (Torchlight-style)

Draw attention to specific lines while dimming others:

```typescript
const result = await highlighter.highlight(code, 'javascript', {
  focusLines: [3, 4, 5],        // These lines stay clear
  dimLines: [1, 2, 6, 7],       // These lines are dimmed
})
```

Features:
- Dimmed lines have reduced opacity and slight blur
- Hover over dimmed lines to temporarily clear them
- Perfect for tutorials and documentation

### Code Annotations

Add contextual notes to specific lines:

```typescript
const result = await highlighter.highlight(code, 'typescript', {
  lineNumbers: true,
  annotations: [
    { line: 1, text: 'API endpoint', type: 'info' },
    { line: 5, text: 'Potential performance issue', type: 'warning' },
    { line: 10, text: 'Fixed bug #123', type: 'success' },
    { line: 15, text: 'This will throw!', type: 'error' },
  ],
})
```

Annotation types:
- `info` - Blue badge (informational)
- `warning` - Yellow badge (caution)
- `error` - Red badge (problems)
- `success` - Green badge (positive changes)

### Dual Theme Support

Support both light and dark modes automatically:

```typescript
import { renderDualTheme } from 'ts-syntax-highlighter'
import { githubLight, githubDark } from 'ts-syntax-highlighter'

const highlighter = await createHighlighter()
const tokens = (await highlighter.highlight(code, 'javascript')).tokens

const result = renderDualTheme(tokens, {
  lightTheme: githubLight,
  darkTheme: githubDark,
  lineNumbers: true,
})

// The CSS automatically switches based on:
// - .dark class on html element
// - data-theme="dark" attribute
// - prefers-color-scheme: dark media query
```

### ANSI Terminal Output

Get colored output for terminal display:

```typescript
const result = await highlighter.highlight(code, 'javascript')

// Use the ANSI output in terminal
console.log(result.ansi)
```

Perfect for:
- CLI tools
- Terminal applications
- Build output
- Log files

### Advanced Transformers

#### Blur Sensitive Data

Blur tokens containing sensitive information:

```typescript
import { createBlurTransformer } from 'ts-syntax-highlighter'

const blurTransformer = createBlurTransformer(
  token => token.content.includes('sk-') || token.content.includes('password')
)

// Apply via plugin system or directly
```

Features:
- Blurred tokens have CSS filter applied
- Hover to temporarily reveal
- Perfect for screenshots and demos

#### Highlight Specific Tokens

Emphasize specific code patterns:

```typescript
import { createTokenHighlighter } from 'ts-syntax-highlighter'

const highlighter = createTokenHighlighter(
  token => token.content === 'TODO' || token.content === 'FIXME',
  '#ffeb3b' // Custom highlight color
)
```

#### Link Detection

Automatically convert URLs to clickable links:

```typescript
import { createLinkTransformer } from 'ts-syntax-highlighter'

const linkTransformer = createLinkTransformer()

// URLs in comments become clickable
```

#### Custom Token Transformers

Create your own transformers:

```typescript
import type { TokenTransformer } from 'ts-syntax-highlighter'

const customTransformer: TokenTransformer = {
  name: 'my-transformer',
  shouldTransform: (token) => {
    return token.content.startsWith('@')
  },
  transform: (token) => {
    return {
      ...token,
      emphasized: true,
      highlightColor: '#e0f2fe',
    }
  },
}
```

### Copy Button

Add a copy-to-clipboard button:

```typescript
const result = await highlighter.highlight(code, 'javascript', {
  showCopyButton: true,
})

// Add JavaScript to handle copying:
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const code = button.nextElementSibling.textContent
    await navigator.clipboard.writeText(code)
    button.textContent = 'Copied!'
    setTimeout(() => button.textContent = 'Copy', 2000)
  })
})
```

### Line Transformers

Transform individual lines:

```typescript
import type { LineTransformer } from 'ts-syntax-highlighter'

const customLineTransformer: LineTransformer = {
  name: 'add-markers',
  transform: (line: string, lineNumber: number) => {
    if (lineNumber % 2 === 0) {
      return line.replace('class="line"', 'class="line even"')
    }
    return line
  },
}

const result = await highlighter.highlight(code, 'javascript', {
  lineTransformers: [customLineTransformer],
})
```

### Complete Example

Combine multiple features:

```typescript
import { createHighlighter } from 'ts-syntax-highlighter'

const code = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`

const highlighter = await createHighlighter({ theme: 'github-dark' })

const result = await highlighter.highlight(code, 'javascript', {
  // Line numbers
  lineNumbers: true,

  // Highlight important lines
  highlightLines: [4, 9],

  // Show what changed
  addedLines: [9, 10, 11],
  removedLines: [],

  // Focus attention
  focusLines: [9],
  dimLines: [1, 2, 13],

  // Add explanations
  annotations: [
    { line: 4, text: 'React Hook for state', type: 'info' },
    { line: 9, text: 'New increment handler', type: 'success' },
  ],

  // Add copy button
  showCopyButton: true,
})

// Get all outputs
console.log(result.html)  // HTML markup
console.log(result.css)   // Themed CSS
console.log(result.ansi)  // Terminal output
```

### Performance Tips

1. **Use Caching**: Enable caching for repeated highlighting
   ```typescript
   const highlighter = await createHighlighter({ cache: true })
   ```

2. **Reuse Instances**: Create one highlighter and reuse it
   ```typescript
   // Good
   const highlighter = await createHighlighter()
   await highlighter.highlight(code1, 'js')
   await highlighter.highlight(code2, 'ts')

   // Avoid
   await (await createHighlighter()).highlight(code1, 'js')
   await (await createHighlighter()).highlight(code2, 'ts')
   ```

3. **Limit Transformers**: Only use transformers you need
4. **Batch Operations**: Process multiple files in parallel

### Feature Comparison

| Feature | Shiki | Torchlight | ts-syntax-highlighter |
|---------|-------|------------|----------------------|
| Syntax Highlighting | ✓ | ✓ | ✓ |
| Custom Themes | ✓ | ✓ | ✓ |
| Line Numbers | ✓ | ✓ | ✓ |
| Line Highlighting | ✓ | ✓ | ✓ |
| Diff Indicators | ✓ | ✓ | ✓ |
| Focus Mode | ✗ | ✓ | ✓ |
| Annotations | ✗ | ✓ | ✓ |
| Dual Themes | ✓ | ✗ | ✓ |
| ANSI Output | ✗ | ✗ | ✓ |
| Token Transformers | ✓ | ✗ | ✓ |
| Blur/Privacy | ✗ | ✗ | ✓ |
| Copy Button | ✗ | ✓ | ✓ |
| Plugin System | ✓ | ✗ | ✓ |
| TypeScript First | ✓ | ✗ | ✓ |
| Zero Runtime Deps | ✗ | ✗ | ✓ |

### Next Steps

- Check out [EXAMPLES.md](./EXAMPLES.md) for more usage patterns
- Read [README.md](./README.md) for basic usage
- Explore the examples folder for working code
