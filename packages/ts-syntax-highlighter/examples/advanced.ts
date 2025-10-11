/* eslint-disable no-console */
import { createHighlighter } from '../src'
import { renderDualTheme } from '../src/dual-theme'
import { githubDark } from '../src/themes/github-dark'
import { githubLight } from '../src/themes/github-light'
import { createBlurTransformer } from '../src/transformers'

async function diffExample() {
  console.log('=== Diff Highlighting Example ===\n')

  const code = `function greet(name) {
  console.log("Hello, " + name);
  return "Welcome!";
}

const result = greet("World");`

  const highlighter = await createHighlighter({ theme: 'github-dark' })

  const result = await highlighter.highlight(code, 'javascript', {
    lineNumbers: true,
    addedLines: [2, 5],
    removedLines: [3],
    annotations: [
      { line: 2, text: 'Updated to use template literals', type: 'info' },
      { line: 5, text: 'Added variable assignment', type: 'success' },
    ],
  })

  console.log('Diff HTML (first 300 chars):')
  console.log(result.html.substring(0, 300), '...\n')
}

async function focusExample() {
  console.log('=== Focus Mode Example ===\n')

  const code = `const x = 1;
const y = 2;
const sum = x + y;
console.log(sum);`

  const highlighter = await createHighlighter()

  const _result = await highlighter.highlight(code, 'javascript', {
    lineNumbers: true,
    focusLines: [3], // Focus on the sum calculation
    dimLines: [1, 2, 4],
  })

  console.log('Focus mode applied - line 3 is in focus\n')
}

async function annotationsExample() {
  console.log('=== Annotations Example ===\n')

  const code = `async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return response.json();
}`

  const highlighter = await createHighlighter({ theme: 'nord' })

  const _result = await highlighter.highlight(code, 'javascript', {
    lineNumbers: true,
    annotations: [
      { line: 1, text: 'API call', type: 'info' },
      { line: 3, text: 'Error handling', type: 'warning' },
      { line: 4, text: 'Throws on failure', type: 'error' },
    ],
  })

  console.log('Annotations added to lines 1, 3, and 4\n')
}

async function dualThemeExample() {
  console.log('=== Dual Theme Example ===\n')

  const code = 'const message = "Hello, World!";'

  const highlighter = await createHighlighter()
  const tokens = (await highlighter.highlight(code, 'javascript')).tokens

  const result = renderDualTheme(tokens, {
    lightTheme: githubLight,
    darkTheme: githubDark,
    lineNumbers: true,
  })

  console.log('Dual theme CSS generated:')
  console.log(result.css?.substring(0, 200), '...\n')
}

async function copyButtonExample() {
  console.log('=== Copy Button Example ===\n')

  const code = `npm install ts-syntax-highlighter`

  const highlighter = await createHighlighter()

  const result = await highlighter.highlight(code, 'javascript', {
    showCopyButton: true,
  })

  console.log('Copy button added:')
  console.log(result.html.includes('copy-button') ? '✓ Copy button present' : '✗ No copy button')
  console.log()
}

async function ansiExample() {
  console.log('=== ANSI Terminal Output Example ===\n')

  const code = `const greeting = "Hello";
// This is a comment
function log(msg) {
  console.log(msg);
}`

  const highlighter = await createHighlighter()

  const result = await highlighter.highlight(code, 'javascript')

  console.log('ANSI output for terminal:')
  console.log(result.ansi)
  console.log()
}

async function blurExample() {
  console.log('=== Blur Sensitive Data Example ===\n')

  const code = `const apiKey = "sk-abc123xyz789";
const endpoint = "https://api.example.com";`

  const highlighter = await createHighlighter()

  // Blur API keys
  const _blurTransformer = createBlurTransformer(
    token => token.type === 'string' && token.content.includes('sk-'),
  )

  const _result = await highlighter.highlight(code, 'javascript', {
    lineNumbers: true,
  })

  console.log('Sensitive data can be blurred with transformers\n')
}

async function complexExample() {
  console.log('=== Complex Example: All Features ===\n')

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

  const _result = await highlighter.highlight(code, 'javascript', {
    lineNumbers: true,
    highlightLines: [4, 9],
    addedLines: [9, 10],
    annotations: [
      { line: 4, text: 'React Hook', type: 'info' },
      { line: 9, text: 'New increment button', type: 'success' },
    ],
    showCopyButton: true,
  })

  console.log('Complex highlighting with:')
  console.log('- Line numbers ✓')
  console.log('- Highlighted lines ✓')
  console.log('- Diff indicators ✓')
  console.log('- Annotations ✓')
  console.log('- Copy button ✓')
  console.log()
}

// Run all examples
async function main() {
  await diffExample()
  await focusExample()
  await annotationsExample()
  await dualThemeExample()
  await copyButtonExample()
  await ansiExample()
  await blurExample()
  await complexExample()

  console.log('✓ All advanced examples completed!')
}

main().catch(console.error)
