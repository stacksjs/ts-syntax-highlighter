import { createHighlighter, highlight } from '../src'

async function basicExample() {
  console.log('=== Basic Example ===\n')

  // Quick highlight
  const result1 = await highlight(
    'const greeting = "Hello, World!";',
    'javascript',
  )

  console.log('Quick highlight:')
  console.log(result1.html.substring(0, 200), '...\n')

  // Create highlighter with options
  const highlighter = await createHighlighter({
    theme: 'github-dark',
    cache: true,
  })

  const tsCode = `
interface User {
  id: number
  name: string
  email: string
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}
`

  const result2 = await highlighter.highlight(tsCode, 'typescript', {
    lineNumbers: true,
    highlightLines: [7],
  })

  console.log('TypeScript with line numbers:')
  console.log(result2.html.substring(0, 300), '...\n')

  // Show cache stats
  console.log('Cache size:', highlighter.getCacheSize())

  // List languages
  console.log('\nSupported languages:', highlighter.getSupportedLanguages())

  // List themes
  console.log('Available themes:', highlighter.getSupportedThemes())
}

async function themeExample() {
  console.log('\n=== Theme Example ===\n')

  const code = 'const x = 42;'

  // Try different themes
  const themes = ['github-dark', 'github-light', 'nord']

  for (const themeName of themes) {
    const highlighter = await createHighlighter({ theme: themeName })
    const result = await highlighter.highlight(code, 'javascript')
    console.log(`${themeName}:`, result.css?.substring(0, 100), '...')
  }
}

async function stxExample() {
  console.log('\n=== STX Template Example ===\n')

  const stxCode = `
@extends('layouts.app')

@section('content')
  <div class="container">
    @if (user.isAuthenticated)
      <h1>Welcome, {{ user.name }}!</h1>
    @else
      <a href="/login">Please log in</a>
    @endif
  </div>
@endsection
`

  const highlighter = await createHighlighter()
  const result = await highlighter.highlight(stxCode, 'stx', {
    lineNumbers: true,
  })

  console.log('STX highlighted (first 200 chars):')
  console.log(result.html.substring(0, 200), '...\n')
}

// Run examples
async function main() {
  await basicExample()
  await themeExample()
  await stxExample()

  console.log('\n✓ Examples completed!')
}

main().catch(console.error)
