import type { RenderedCode, RenderOptions, Theme, TokenLine } from './types'
import { Renderer } from './renderer'

export interface DualThemeOptions extends RenderOptions {
  lightTheme: Theme
  darkTheme: Theme
  selector?: string
}

/**
 * Render code with dual theme support (light and dark)
 *
 * The two themes render the same markup - same tokens, same scopes, same
 * classes - so the light pass's `html` describes both. What differs is which
 * stylesheet is active: both renders run in `colorViaClass` mode so neither
 * bakes a color into `style="..."` (which no later selector could override),
 * then the dark stylesheet is rescoped under `selector` and left to override
 * the light one, which stays the page's unscoped default.
 */
export function renderDualTheme(
  tokens: TokenLine[],
  options: DualThemeOptions,
): RenderedCode {
  const { lightTheme, darkTheme, selector = 'html', ...renderOptions } = options
  const colorViaClassOptions = { ...renderOptions, colorViaClass: true }

  const lightRenderer = new Renderer(lightTheme)
  const darkRenderer = new Renderer(darkTheme)

  const lightResult = lightRenderer.render(tokens, colorViaClassOptions)
  const darkResult = darkRenderer.render(tokens, colorViaClassOptions)

  const darkPrefixes = [`${selector}.dark`, `${selector}[data-theme="dark"]`]
  const scopedDarkRules = darkResult.css ? scopeCssRules(darkResult.css, darkPrefixes) : ''

  const combinedCSS = `
/* Light theme (default) */
${lightResult.css}

/* Dark theme */
${scopedDarkRules}
`.trim()

  return {
    html: lightResult.html,
    css: combinedCSS,
    tokens,
    ansi: lightResult.ansi,
  }
}

/**
 * Prepend each of `prefixes` to every selector in a flat stylesheet (no
 * nested at-rules - `generateCSS`'s output never has any, so a rule is just
 * whatever sits between one `{...}` pair, comma-separated selectors and all).
 */
function scopeCssRules(css: string, prefixes: string[]): string {
  return css
    .split('}')
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0)
    .map((chunk) => {
      const braceIndex = chunk.indexOf('{')
      if (braceIndex === -1) {
        return null
      }
      const selectors = chunk.slice(0, braceIndex).trim().split(',').map(s => s.trim())
      const body = chunk.slice(braceIndex)
      const scopedSelector = prefixes
        .flatMap(prefix => selectors.map(sel => `${prefix} ${sel}`))
        .join(',\n')
      return `${scopedSelector} ${body}\n}`
    })
    .filter((rule): rule is string => rule !== null)
    .join('\n\n')
}

/**
 * Create a dual theme renderer
 */
export class DualThemeRenderer {
  private lightRenderer: Renderer
  private darkRenderer: Renderer
  private lightTheme: Theme
  private darkTheme: Theme
  private selector: string

  constructor(lightTheme: Theme, darkTheme: Theme, selector = 'html') {
    this.lightRenderer = new Renderer(lightTheme)
    this.darkRenderer = new Renderer(darkTheme)
    this.lightTheme = lightTheme
    this.darkTheme = darkTheme
    this.selector = selector
  }

  render(tokens: TokenLine[], options: RenderOptions = {}): RenderedCode {
    return renderDualTheme(tokens, {
      ...options,
      lightTheme: this.lightTheme,
      darkTheme: this.darkTheme,
      selector: this.selector,
    })
  }
}
