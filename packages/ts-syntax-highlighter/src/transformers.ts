import type { LineTransformer, Token, TokenLine, TokenTransformer } from './types'

/**
 * Focus transformer - dims all lines except focused ones
 */
export function createFocusTransformer(focusLines: number[]): {
  lineTransformer: LineTransformer
  tokenTransformer: TokenTransformer
} {
  return {
    lineTransformer: {
      name: 'focus',
      transform: (line: string, lineNumber: number) => {
        if (!focusLines.includes(lineNumber)) {
          return line.replace('<span class="line"', '<span class="line dim"')
        }
        return line.replace('<span class="line"', '<span class="line focus"')
      },
    },
    tokenTransformer: {
      name: 'focus-tokens',
      shouldTransform: (token: Token) => !focusLines.includes(token.line),
      transform: (token: Token) => ({
        ...token,
        dimmed: true,
      }),
    },
  }
}

/**
 * Diff transformer - adds +/- indicators for added/removed lines
 */
export function createDiffTransformer(
  addedLines: number[],
  removedLines: number[],
): LineTransformer {
  return {
    name: 'diff',
    transform: (line: string, lineNumber: number) => {
      if (addedLines.includes(lineNumber)) {
        return line
          .replace('<span class="line"', '<span class="line added"')
          .replace('>', '><span class="diff-indicator">+</span>')
      }
      if (removedLines.includes(lineNumber)) {
        return line
          .replace('<span class="line"', '<span class="line removed"')
          .replace('>', '><span class="diff-indicator">-</span>')
      }
      return line
    },
  }
}

/**
 * Blur transformer - blurs specific tokens (e.g., for privacy)
 */
export function createBlurTransformer(
  shouldBlur: (token: Token) => boolean,
): TokenTransformer {
  return {
    name: 'blur',
    shouldTransform: shouldBlur,
    transform: (token: Token) => ({
      ...token,
      blurred: true,
    }),
  }
}

/**
 * Link transformer - converts URLs to clickable links
 */
export function createLinkTransformer(): TokenTransformer {
  const urlRegex = /https?:\/\/[^\s]+/
  return {
    name: 'link',
    shouldTransform: (token: Token) => urlRegex.test(token.content),
    transform: (token: Token) => ({
      ...token,
      link: token.content.match(urlRegex)?.[0],
    }),
  }
}

/**
 * Highlight specific tokens based on content
 */
export function createTokenHighlighter(
  shouldHighlight: (token: Token) => boolean,
  highlightColor?: string,
): TokenTransformer {
  return {
    name: 'token-highlight',
    shouldTransform: shouldHighlight,
    transform: (token: Token) => ({
      ...token,
      highlighted: true,
      highlightColor,
    }),
  }
}

/**
 * Mark tokens as emphasized
 */
export function createEmphasisTransformer(
  shouldEmphasize: (token: Token) => boolean,
): TokenTransformer {
  return {
    name: 'emphasis',
    shouldTransform: shouldEmphasize,
    transform: (token: Token) => ({
      ...token,
      emphasized: true,
    }),
  }
}

/**
 * Apply multiple transformers to tokens
 */
export function applyTokenTransformers(
  tokens: TokenLine[],
  transformers: TokenTransformer[],
): TokenLine[] {
  return tokens.map(line => ({
    ...line,
    tokens: line.tokens.map(token => {
      let transformedToken = token
      for (const transformer of transformers) {
        if (transformer.shouldTransform(token)) {
          transformedToken = transformer.transform(transformedToken)
        }
      }
      return transformedToken
    }),
  }))
}

/**
 * Apply line transformers to HTML
 */
export function applyLineTransformers(
  html: string,
  transformers: LineTransformer[],
): string {
  const lines = html.split('\n')
  return lines
    .map((line, index) => {
      let transformedLine = line
      for (const transformer of transformers) {
        transformedLine = transformer.transform(transformedLine, index + 1)
      }
      return transformedLine
    })
    .join('\n')
}
