import type { Language } from './types'
import { languages } from './grammars'

/**
 * Detect language from code content
 */
export function detectLanguage(code: string): Language | undefined {
  const patterns: Record<string, RegExp[]> = {
    typescript: [
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /:\s*(?:string|number|boolean|any|void|never|unknown)/,
      /<[A-Z]\w*>/,
      /as\s+(?:const|any|unknown)/,
    ],
    javascript: [
      /(?:const|let|var)\s+\w+/,
      /function\s+\w+/,
      /=>\s*\{/,
      /import\s+(?:\S.*)?from/,
      /export\s+(?:default|const|function)/,
    ],
    html: [
      /<!DOCTYPE\s+html>/i,
      /<html[>\s]/i,
      /<head[>\s]/i,
      /<body[>\s]/i,
      /<div[>\s]/i,
    ],
    css: [
      /\.\w+\s*\{/,
      /#\w+\s*\{/,
      /[a-z-]+:[^;]+;/,
      /@media\s+/,
      /@keyframes\s+/,
    ],
    stx: [
      /@if\s*\(/,
      /@foreach\s*\(/,
      /@extends\s*\(/,
      /\{\{.*\}\}/,
      /@section\s*\(/,
    ],
  }

  const scores: Record<string, number> = {}

  // Calculate scores for each language
  for (const [langId, langPatterns] of Object.entries(patterns)) {
    let score = 0
    for (const pattern of langPatterns) {
      const matches = code.match(pattern)
      if (matches) {
        score += matches.length
      }
    }
    if (score > 0) {
      scores[langId] = score
    }
  }

  // Return language with highest score
  const bestMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]

  if (bestMatch) {
    return languages.find(lang => lang.id === bestMatch[0])
  }

  return undefined
}

/**
 * Detect language from file extension
 */
export function detectLanguageFromExtension(filename: string): Language | undefined {
  const ext = filename.includes('.') ? `.${filename.split('.').pop()}` : filename

  return languages.find(lang =>
    lang.extensions?.some(e =>
      e.toLowerCase() === ext.toLowerCase(),
    ),
  )
}

/**
 * Detect language from filename or content
 */
export function autoDetect(codeOrFilename: string, isFilename = false): Language | undefined {
  if (isFilename) {
    return detectLanguageFromExtension(codeOrFilename)
  }

  // Try content-based detection
  return detectLanguage(codeOrFilename)
}
