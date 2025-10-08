import type { RenderedCode, RenderOptions } from './types'
import { config } from './config'
import { createHighlighter } from './highlighter'

/**
 * Quick highlight function for simple use cases
 */
export async function highlight(
  code: string,
  lang: string,
  options: RenderOptions = {},
): Promise<RenderedCode> {
  const highlighter = await createHighlighter({
    theme: options.theme || config.theme,
    cache: config.cache,
    verbose: config.verbose,
  })

  return highlighter.highlight(code, lang, options)
}
