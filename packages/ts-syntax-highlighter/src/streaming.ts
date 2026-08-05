/**
 * Highlighting a large file without holding the main thread.
 *
 * A one megabyte file tokenized in one call blocks for as long as it takes,
 * which on a slow machine is long enough to drop a second of frames. Chunking
 * lets the caller yield between batches, and lets a consumer render the top of
 * the file while the bottom is still being tokenized.
 *
 * The tokenizer state is carried between chunks, so a string opened on line 90
 * is still open on line 110. Losing that is the difference between a
 * highlighted file and a file where half of it is one long string.
 */

import type { Language, RenderedCode, RenderOptions, Theme, TokenizerState, TokenLine } from './types'
import { Renderer } from './renderer'
import { githubDark } from './themes'
import { Tokenizer } from './tokenizer'

export interface StreamChunk {
  /**
   * The rendered lines for this chunk, with no wrapper.
   *
   * Concatenating every chunk's `html` gives the body of one code block. The
   * wrapper belongs to the caller, because a caller streaming into a page
   * already has one and a second `<pre>` per chunk would be wrong.
   */
  html: string
  /** The tokens behind that HTML, for a caller rendering its own markup. */
  tokens: TokenLine[]
  /** 1-based number of the first line in this chunk. */
  firstLine: number
  /** 1-based number of the last line in this chunk. */
  lineNumber: number
  /** Where the tokenizer finished, for resuming or checkpointing. */
  endState: TokenizerState
  isComplete: boolean
}

export interface StreamOptions extends RenderOptions {
  /** Lines per chunk. Smaller yields sooner and costs more per line. */
  chunkSize?: number
}

/** The stylesheet for a stream. The same for every chunk, so it is asked for once. */
export function streamCSS(options: StreamOptions = {}): string {
  return new Renderer(resolveTheme(options.theme)).render([], options).css ?? ''
}

/**
 * Highlight code in chunks.
 *
 * Yields rendered HTML, not the source text. That should not need saying, and
 * does: the previous implementation assigned the theme to an unused variable
 * and yielded `tokens.map(t => t.content).join('')`, which is the input
 * unchanged. Anyone who reached for the obvious function for large files got no
 * highlighting, and no error telling them so.
 */
export async function* highlightStream(
  code: string,
  language: Language,
  options: StreamOptions = {},
): AsyncGenerator<StreamChunk> {
  const { chunkSize = 100, ...renderOptions } = options
  const tokenizer = new Tokenizer(language.grammar)
  const renderer = new Renderer(resolveTheme(options.theme))

  if (code.length === 0) {
    // An empty input still produces one chunk, so a consumer that stops on
    // `isComplete` is not left waiting for a chunk that never comes.
    yield {
      html: '',
      tokens: [],
      firstLine: 1,
      lineNumber: 0,
      endState: tokenizer.initialState(),
      isComplete: true,
    }
    return
  }

  const lines = code.split('\n')
  let state: TokenizerState | undefined

  for (let start = 0; start < lines.length; start += chunkSize) {
    const slice = lines.slice(start, Math.min(start + chunkSize, lines.length))
    const { lines: tokenLines, endState } = tokenizer.tokenizeLinesFrom(slice, state, start + 1)
    state = endState

    yield {
      html: renderer.renderFragment(tokenLines, renderOptions),
      tokens: tokenLines,
      firstLine: start + 1,
      lineNumber: start + slice.length,
      endState,
      isComplete: start + slice.length >= lines.length,
    }
  }
}

/**
 * Highlight a range of a file, given where the range starts.
 *
 * The primitive a diff needs. A hunk begins at line four hundred, and whether
 * line four hundred sits inside a block comment cannot be worked out from the
 * hunk alone. Hand over the state recorded at the line before it, from
 * `Tokenizer.checkpoints`, and the range highlights exactly as it would inside
 * the whole file.
 *
 * Without a start state the range is tokenized from a clean slate, which is
 * correct for a range starting at line one and a documented approximation
 * anywhere else. That approximation is the honest answer when the surrounding
 * file is not available, which is the case for a patch with no blob behind it.
 */
export function highlightRange(
  lines: readonly string[],
  language: Language,
  firstLine: number,
  startState?: TokenizerState,
  options: RenderOptions = {},
): { html: string, tokens: TokenLine[], endState: TokenizerState } {
  const tokenizer = new Tokenizer(language.grammar)
  const { lines: tokenLines, endState } = tokenizer.tokenizeLinesFrom(lines, startState, firstLine)
  const renderer = new Renderer(resolveTheme(options.theme))

  return { html: renderer.renderFragment(tokenLines, options), tokens: tokenLines, endState }
}

/**
 * Process a large file in batches of token lines.
 *
 * The rendering-free half of `highlightStream`, for a caller that produces its
 * own markup, which is what a diff viewer with its own row layout does.
 */
export class BatchHighlighter {
  private batchSize: number

  constructor(batchSize = 1000) {
    this.batchSize = batchSize
  }

  async* processBatches(
    lines: readonly string[],
    language: Language,
    _options: RenderOptions = {},
  ): AsyncGenerator<TokenLine[]> {
    const tokenizer = new Tokenizer(language.grammar)
    let state: TokenizerState | undefined

    for (let start = 0; start < lines.length; start += this.batchSize) {
      const slice = lines.slice(start, Math.min(start + this.batchSize, lines.length))
      const result = tokenizer.tokenizeLinesFrom(slice, state, start + 1)
      state = result.endState
      yield result.lines
    }
  }
}

/** Render one already-tokenized chunk, so a worker can split the two halves. */
export function renderChunk(tokens: TokenLine[], options: StreamOptions = {}): RenderedCode {
  return new Renderer(resolveTheme(options.theme)).render(tokens, options)
}

/**
 * The theme to render with.
 *
 * A theme named as a string cannot be resolved from here without pulling the
 * theme registry in, so it falls back rather than failing. Pass a resolved
 * theme object when the name matters.
 */
function resolveTheme(theme?: string | Theme): Theme {
  return typeof theme === 'object' && theme !== null ? theme : githubDark
}
