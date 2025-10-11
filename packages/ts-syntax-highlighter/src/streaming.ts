import type { Language, RenderOptions, TokenLine } from './types'
import { Tokenizer } from './tokenizer'

export interface StreamChunk {
  html: string
  lineNumber: number
  isComplete: boolean
}

/**
 * Highlight code in chunks for better performance on large files
 */
export async function* highlightStream(
  code: string,
  language: Language,
  options: RenderOptions = {},
  chunkSize = 100,
): AsyncGenerator<StreamChunk> {
  const lines = code.split('\n')
  const tokenizer = new Tokenizer(language.grammar)
  const _theme = options.theme || 'github-dark'

  // We need a theme object, so this is simplified
  // In real usage, you'd pass a proper theme
  let prevStack: any

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, Math.min(i + chunkSize, lines.length))
    const tokenLines: TokenLine[] = []

    for (let j = 0; j < chunk.length; j++) {
      const tokenLine = tokenizer.tokenizeLine(chunk[j], i + j + 1, prevStack)
      tokenLines.push(tokenLine)
      prevStack = tokenizer.scopeStack
    }

    // For streaming, we'd render each chunk
    // This is a simplified version
    yield {
      html: tokenLines.map(tl =>
        tl.tokens.map(t => t.content).join(''),
      ).join('\n'),
      lineNumber: i + chunk.length,
      isComplete: i + chunk.length >= lines.length,
    }
  }
}

/**
 * Process large files in batches
 */
export class BatchHighlighter {
  private batchSize: number

  constructor(batchSize = 1000) {
    this.batchSize = batchSize
  }

  async* processBatches(
    lines: string[],
    language: Language,
    _options: RenderOptions = {},
  ): AsyncGenerator<TokenLine[]> {
    const tokenizer = new Tokenizer(language.grammar)
    let prevStack: any

    for (let i = 0; i < lines.length; i += this.batchSize) {
      const batch = lines.slice(i, Math.min(i + this.batchSize, lines.length))
      const tokenLines: TokenLine[] = []

      for (let j = 0; j < batch.length; j++) {
        const tokenLine = tokenizer.tokenizeLine(batch[j], i + j + 1, prevStack)
        tokenLines.push(tokenLine)
        prevStack = tokenizer.scopeStack
      }

      yield tokenLines
    }
  }
}
