import type { RenderedCode, RenderOptions, Theme, TokenLine } from './types'
import { Renderer } from './renderer'

export interface DualThemeOptions extends RenderOptions {
  lightTheme: Theme
  darkTheme: Theme
  selector?: string
}

/**
 * Render code with dual theme support (light and dark)
 */
export function renderDualTheme(
  tokens: TokenLine[],
  options: DualThemeOptions,
): RenderedCode {
  const { lightTheme, darkTheme, selector = 'html', ...renderOptions } = options

  // Render with both themes
  const lightRenderer = new Renderer(lightTheme)
  const darkRenderer = new Renderer(darkTheme)

  const lightResult = lightRenderer.render(tokens, renderOptions)
  const darkResult = darkRenderer.render(tokens, renderOptions)

  // Combine CSS with media query
  const combinedCSS = `
/* Light theme (default) */
${lightResult.css}

/* Dark theme */
${selector}.dark .syntax,
${selector}[data-theme="dark"] .syntax,
@media (prefers-color-scheme: dark) {
  ${selector}:not(.light) .syntax {
    ${darkResult.css?.split('\n').filter(line => line.includes(':')).join('\n    ')}
  }
}
`.trim()

  return {
    html: lightResult.html,
    css: combinedCSS,
    tokens,
    ansi: lightResult.ansi,
  }
}

/**
 * Create a dual theme renderer
 */
export class DualThemeRenderer {
  private lightRenderer: Renderer
  private darkRenderer: Renderer
  private selector: string

  constructor(lightTheme: Theme, darkTheme: Theme, selector = 'html') {
    this.lightRenderer = new Renderer(lightTheme)
    this.darkRenderer = new Renderer(darkTheme)
    this.selector = selector
  }

  render(tokens: TokenLine[], options: RenderOptions = {}): RenderedCode {
    return renderDualTheme(tokens, {
      ...options,
      lightTheme: this.lightRenderer.theme,
      darkTheme: this.darkRenderer.theme,
      selector: this.selector,
    })
  }
}
