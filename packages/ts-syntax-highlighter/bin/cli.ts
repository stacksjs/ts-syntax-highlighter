#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'node:fs'
import { CAC } from 'cac'
import { createHighlighter } from '../src/highlighter'
import { getLanguage } from '../src/grammars'
import { getTheme } from '../src/themes'
import { version } from '../package.json'

const cli = new CAC('syntax')

interface HighlightOptions {
  theme?: string
  output?: string
  lineNumbers?: boolean
  inline?: boolean
  verbose?: boolean
}

cli
  .command('highlight <file> <lang>', 'Highlight a code file')
  .option('--theme <theme>', 'Theme to use (github-dark, github-light, nord)', { default: 'github-dark' })
  .option('--output <output>', 'Output file path (default: stdout)')
  .option('--line-numbers', 'Show line numbers', { default: false })
  .option('--inline', 'Generate inline code snippet', { default: false })
  .option('--verbose', 'Enable verbose logging', { default: false })
  .example('syntax highlight code.ts typescript --theme github-dark')
  .example('syntax highlight app.js javascript --output highlighted.html --line-numbers')
  .action(async (file: string, lang: string, options: HighlightOptions) => {
    try {
      // Read the file
      const code = readFileSync(file, 'utf-8')

      // Create highlighter
      const highlighter = await createHighlighter({
        theme: options.theme || 'github-dark',
        verbose: options.verbose || false,
        cache: true,
      })

      // Highlight code
      const result = await highlighter.highlight(code, lang, {
        lineNumbers: options.lineNumbers,
        inline: options.inline,
        theme: options.theme,
      })

      // Generate full HTML
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Highlighted Code</title>
  <style>
    ${result.css}
    body {
      margin: 0;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
  </style>
</head>
<body>
  ${result.html}
</body>
</html>`

      // Output
      if (options.output) {
        writeFileSync(options.output, html)
        console.log(`✓ Highlighted code written to ${options.output}`)
      }
      else {
        console.log(html)
      }
    }
    catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error))
      process.exit(1)
    }
  })

cli
  .command('languages', 'List supported languages')
  .action(async () => {
    const highlighter = await createHighlighter()
    const languages = highlighter.getSupportedLanguages()
    console.log('Supported languages:')
    console.log(languages.join(', '))
  })

cli
  .command('themes', 'List available themes')
  .action(async () => {
    const highlighter = await createHighlighter()
    const themes = highlighter.getSupportedThemes()
    console.log('Available themes:')
    console.log(themes.join(', '))
  })

cli
  .command('info <lang>', 'Show information about a language')
  .action((lang: string) => {
    const language = getLanguage(lang)
    if (language) {
      console.log(`Language: ${language.name}`)
      console.log(`ID: ${language.id}`)
      console.log(`Aliases: ${language.aliases?.join(', ') || 'none'}`)
      console.log(`Extensions: ${language.extensions?.join(', ') || 'none'}`)
    }
    else {
      console.error(`Language "${lang}" not found`)
      process.exit(1)
    }
  })

cli
  .command('theme-info <theme>', 'Show information about a theme')
  .action((themeName: string) => {
    const theme = getTheme(themeName)
    if (theme) {
      console.log(`Theme: ${theme.name}`)
      console.log(`Type: ${theme.type}`)
      console.log(`Background: ${theme.colors['editor.background']}`)
      console.log(`Foreground: ${theme.colors['editor.foreground']}`)
      console.log(`Token colors: ${theme.tokenColors.length} rules`)
    }
    else {
      console.error(`Theme "${themeName}" not found`)
      process.exit(1)
    }
  })

cli.version(version)
cli.help()
cli.parse()
