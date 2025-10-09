import type { RenderedCode, RenderOptions, Theme, TokenLine, TokenSettings } from './types'

export class Renderer {
  private theme: Theme

  constructor(theme: Theme) {
    this.theme = theme
  }

  /**
   * Render tokens to HTML
   */
  render(tokens: TokenLine[], options: RenderOptions = {}): RenderedCode {
    const {
      lineNumbers = false,
      highlightLines = [],
      inline = false,
      focusLines = [],
      dimLines = [],
      addedLines = [],
      removedLines = [],
      annotations = [],
      showCopyButton = false,
    } = options

    const lines = tokens.map((tokenLine, index) => {
      const lineNumber = index + 1
      const lineClasses = this.getLineClasses(lineNumber, {
        highlightLines,
        focusLines,
        dimLines,
        addedLines,
        removedLines,
      })

      const lineContent = this.renderLine(tokenLine, inline)

      if (inline) {
        return lineContent
      }

      const lineNumberHtml = lineNumbers
        ? `<span class="line-number">${lineNumber}</span>`
        : ''

      // Add diff indicators
      let diffIndicator = ''
      if (addedLines.includes(lineNumber)) {
        diffIndicator = '<span class="diff-indicator add">+</span>'
      }
      else if (removedLines.includes(lineNumber)) {
        diffIndicator = '<span class="diff-indicator remove">-</span>'
      }

      // Find annotations for this line
      const lineAnnotations = annotations.filter(a => a.line === lineNumber)
      const annotationHtml = lineAnnotations
        .map(a => this.renderAnnotation(a))
        .join('')

      return `<span class="${lineClasses}">${diffIndicator}${lineNumberHtml}${lineContent}${annotationHtml}</span>`
    })

    const copyButton = showCopyButton
      ? '<button class="copy-button" data-copy>Copy</button>'
      : ''

    const html = inline
      ? `<code class="syntax-inline">${lines.join('')}</code>`
      : `<div class="syntax-wrapper">${copyButton}<pre class="syntax"><code>${lines.join('\n')}</code></pre></div>`

    const css = this.generateCSS(options)
    const ansi = this.renderAnsi(tokens)

    return {
      html,
      css,
      tokens,
      ansi,
    }
  }

  /**
   * Get CSS classes for a line
   */
  private getLineClasses(
    lineNumber: number,
    options: {
      highlightLines: number[]
      focusLines: number[]
      dimLines: number[]
      addedLines: number[]
      removedLines: number[]
    },
  ): string {
    const classes = ['line']

    if (options.highlightLines.includes(lineNumber)) {
      classes.push('highlighted')
    }
    if (options.focusLines.includes(lineNumber)) {
      classes.push('focus')
    }
    if (options.dimLines.includes(lineNumber)) {
      classes.push('dim')
    }
    if (options.addedLines.includes(lineNumber)) {
      classes.push('added')
    }
    if (options.removedLines.includes(lineNumber)) {
      classes.push('removed')
    }

    return classes.join(' ')
  }

  /**
   * Render an annotation
   */
  private renderAnnotation(annotation: { text: string, type?: string }): string {
    const type = annotation.type || 'info'
    return `<span class="annotation annotation-${type}">${this.escapeHtml(annotation.text)}</span>`
  }

  /**
   * Render a single line of tokens
   */
  private renderLine(tokenLine: TokenLine, inline: boolean): string {
    return tokenLine.tokens
      .map(token => this.renderToken(token))
      .join('')
  }

  /**
   * Render a single token
   */
  private renderToken(token: Token): string {
    const color = this.getColorForScopes(token.scopes)
    const escapedContent = this.escapeHtml(token.content)
    const classes = [this.getScopeClass(token.scopes)]
    const styles: string[] = []

    // Apply base color
    if (color.foreground || color.fontStyle) {
      styles.push(this.buildStyle(color))
    }

    // Apply transformations
    if (token.dimmed) {
      classes.push('dimmed')
    }
    if (token.blurred) {
      classes.push('blurred')
    }
    if (token.highlighted) {
      classes.push('highlighted-token')
      if (token.highlightColor) {
        styles.push(`background-color: ${token.highlightColor}`)
      }
    }
    if (token.emphasized) {
      classes.push('emphasized')
    }

    const className = classes.join(' ')
    const style = styles.join('; ')

    // Handle links
    if (token.link) {
      return `<a href="${token.link}" class="${className}" style="${style}" target="_blank" rel="noopener noreferrer">${escapedContent}</a>`
    }

    if (!style && className === 'token') {
      return escapedContent
    }

    return `<span class="${className}" style="${style}">${escapedContent}</span>`
  }

  /**
   * Get color settings for token scopes
   */
  private getColorForScopes(scopes: string[]): TokenSettings {
    let bestMatch: TokenSettings = {}
    let bestMatchScore = 0

    for (const tokenColor of this.theme.tokenColors) {
      const tokenScopes = Array.isArray(tokenColor.scope)
        ? tokenColor.scope
        : [tokenColor.scope]

      for (const scope of tokenScopes) {
        for (const tokenScope of scopes) {
          if (this.scopeMatches(tokenScope, scope)) {
            const score = scope.split('.').length
            if (score > bestMatchScore) {
              bestMatch = tokenColor.settings
              bestMatchScore = score
            }
          }
        }
      }
    }

    return bestMatch
  }

  /**
   * Check if a token scope matches a theme scope
   */
  private scopeMatches(tokenScope: string, themeScope: string): boolean {
    const tokenParts = tokenScope.split('.')
    const themeParts = themeScope.split('.')

    // Check if themeScope is a prefix of tokenScope
    for (let i = 0; i < themeParts.length; i++) {
      if (tokenParts[i] !== themeParts[i]) {
        return false
      }
    }

    return true
  }

  /**
   * Build inline style string
   */
  private buildStyle(settings: TokenSettings): string {
    const styles: string[] = []

    if (settings.foreground) {
      styles.push(`color: ${settings.foreground}`)
    }

    if (settings.background) {
      styles.push(`background-color: ${settings.background}`)
    }

    if (settings.fontStyle) {
      if (settings.fontStyle.includes('italic')) {
        styles.push('font-style: italic')
      }
      if (settings.fontStyle.includes('bold')) {
        styles.push('font-weight: bold')
      }
      if (settings.fontStyle.includes('underline')) {
        styles.push('text-decoration: underline')
      }
    }

    return styles.join('; ')
  }

  /**
   * Get CSS class name from scopes
   */
  private getScopeClass(scopes: string[]): string {
    if (scopes.length === 0)
      return 'token'

    const lastScope = scopes[scopes.length - 1]
    const className = lastScope.replace(/\./g, '-')
    return `token ${className}`
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Generate CSS for the theme
   */
  private generateCSS(options: RenderOptions = {}): string {
    const { colors } = this.theme

    return `
.syntax-wrapper {
  position: relative;
}

.syntax {
  background-color: ${colors['editor.background']};
  color: ${colors['editor.foreground']};
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.syntax code {
  display: block;
  font-family: inherit;
}

.syntax .line {
  display: inline-block;
  width: 100%;
}

.syntax .line.highlighted {
  background-color: ${colors['editor.lineHighlightBackground'] || 'rgba(255, 255, 255, 0.1)'};
}

.syntax .line.focus {
  opacity: 1;
}

.syntax .line.dim {
  opacity: 0.4;
  filter: blur(0.5px);
  transition: opacity 0.2s, filter 0.2s;
}

.syntax .line.dim:hover {
  opacity: 0.8;
  filter: blur(0px);
}

.syntax .line.added {
  background-color: ${this.theme.type === 'dark' ? 'rgba(46, 160, 67, 0.15)' : 'rgba(34, 134, 58, 0.1)'};
}

.syntax .line.removed {
  background-color: ${this.theme.type === 'dark' ? 'rgba(248, 81, 73, 0.15)' : 'rgba(203, 36, 49, 0.1)'};
}

.syntax .diff-indicator {
  display: inline-block;
  width: 1.5rem;
  text-align: center;
  user-select: none;
  font-weight: bold;
}

.syntax .diff-indicator.add {
  color: ${this.theme.type === 'dark' ? '#3fb950' : '#1a7f37'};
}

.syntax .diff-indicator.remove {
  color: ${this.theme.type === 'dark' ? '#f85149' : '#cf222e'};
}

.syntax .line-number {
  display: inline-block;
  width: 3rem;
  margin-right: 1rem;
  text-align: right;
  color: ${colors['editor.foreground']}80;
  user-select: none;
}

.syntax .annotation {
  display: inline-block;
  margin-left: 1rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.syntax .annotation-info {
  background-color: rgba(56, 139, 253, 0.15);
  color: ${this.theme.type === 'dark' ? '#58a6ff' : '#0969da'};
}

.syntax .annotation-warning {
  background-color: rgba(187, 128, 9, 0.15);
  color: ${this.theme.type === 'dark' ? '#d29922' : '#9a6700'};
}

.syntax .annotation-error {
  background-color: rgba(248, 81, 73, 0.15);
  color: ${this.theme.type === 'dark' ? '#f85149' : '#cf222e'};
}

.syntax .annotation-success {
  background-color: rgba(46, 160, 67, 0.15);
  color: ${this.theme.type === 'dark' ? '#3fb950' : '#1a7f37'};
}

.syntax-inline {
  background-color: ${colors['editor.background']};
  color: ${colors['editor.foreground']};
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875em;
}

.token {
  /* Base token styles */
}

.token.dimmed {
  opacity: 0.5;
}

.token.blurred {
  filter: blur(4px);
  transition: filter 0.2s;
}

.token.blurred:hover {
  filter: blur(0px);
}

.token.highlighted-token {
  background-color: rgba(255, 235, 59, 0.3);
  border-radius: 2px;
  padding: 0 2px;
}

.token.emphasized {
  font-weight: bold;
  text-decoration: underline;
  text-decoration-style: wavy;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: ${this.theme.type === 'dark' ? 'rgba(110, 118, 129, 0.4)' : 'rgba(27, 31, 36, 0.15)'};
  color: ${colors['editor.foreground']};
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: ${this.theme.type === 'dark' ? 'rgba(110, 118, 129, 0.6)' : 'rgba(27, 31, 36, 0.25)'};
}

.copy-button:active {
  background-color: ${this.theme.type === 'dark' ? 'rgba(110, 118, 129, 0.8)' : 'rgba(27, 31, 36, 0.35)'};
}
`.trim()
  }

  /**
   * Render tokens to ANSI terminal output
   */
  private renderAnsi(tokens: TokenLine[]): string {
    const ansiColors: Record<string, string> = {
      keyword: '\x1b[35m', // Magenta
      string: '\x1b[32m', // Green
      comment: '\x1b[90m', // Gray
      number: '\x1b[36m', // Cyan
      function: '\x1b[33m', // Yellow
      reset: '\x1b[0m',
    }

    return tokens
      .map(line =>
        line.tokens
          .map(token => {
            const type = token.type.toLowerCase()
            const color = ansiColors[type] || ansiColors.reset
            return `${color}${token.content}${ansiColors.reset}`
          })
          .join(''),
      )
      .join('\n')
  }

  /**
   * Update the theme
   */
  setTheme(theme: Theme): void {
    this.theme = theme
  }
}
