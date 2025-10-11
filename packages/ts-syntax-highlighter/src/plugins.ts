import type { Plugin, TokenLine, Transformer } from './types'

/**
 * Example plugin: Line highlighter transformer
 */
export const lineHighlighterPlugin: Plugin = {
  name: 'line-highlighter',
  transformers: [
    {
      name: 'highlight-lines',
      transform: (tokens: TokenLine[]) => {
        // This is handled by the renderer, but plugins can add custom logic
        return tokens
      },
    },
  ],
}

/**
 * Example plugin: Focus transformer
 * Dims lines that are not in focus
 */
export function createFocusPlugin(_focusLines: number[]): Plugin {
  return {
    name: 'focus',
    transformers: [
      {
        name: 'focus-lines',
        transform: (tokens: TokenLine[]) => {
          // Plugin logic could modify tokens here
          // For now, this is a placeholder for custom transformers
          return tokens
        },
      },
    ],
  }
}

/**
 * Example plugin: Diff highlighting
 */
export const diffPlugin: Plugin = {
  name: 'diff',
  transformers: [
    {
      name: 'diff-highlighter',
      transform: (tokens: TokenLine[]) => {
        // Could add + and - highlighting for diff view
        return tokens
      },
    },
  ],
}

/**
 * Create a custom transformer plugin
 */
export function createTransformerPlugin(
  name: string,
  transformer: Transformer,
): Plugin {
  return {
    name,
    transformers: [transformer],
  }
}
