import type { FastToken, FastTokenLine, Grammar } from './types'

// Character type lookup tables (reused from main tokenizer)
const CHAR_TYPE = new Uint8Array(256)
const LETTER = 1
const DIGIT = 2
const OPERATOR = 4
const PUNCTUATION = 8
const QUOTE = 16
const WHITESPACE = 32

// Initialize lookup table (done once at module load)
for (let i = 65; i <= 90; i++) CHAR_TYPE[i] = LETTER // A-Z
for (let i = 97; i <= 122; i++) CHAR_TYPE[i] = LETTER // a-z
CHAR_TYPE[95] = LETTER // _
CHAR_TYPE[36] = LETTER // $
for (let i = 48; i <= 57; i++) CHAR_TYPE[i] = DIGIT // 0-9
CHAR_TYPE[43] = OPERATOR // +
CHAR_TYPE[45] = OPERATOR // -
CHAR_TYPE[42] = OPERATOR // *
CHAR_TYPE[47] = OPERATOR // /
CHAR_TYPE[61] = OPERATOR // =
CHAR_TYPE[33] = OPERATOR // !
CHAR_TYPE[60] = OPERATOR // <
CHAR_TYPE[62] = OPERATOR // >
CHAR_TYPE[38] = OPERATOR // &
CHAR_TYPE[124] = OPERATOR // |
CHAR_TYPE[37] = OPERATOR // %
CHAR_TYPE[63] = OPERATOR // ?
CHAR_TYPE[58] = OPERATOR // :
CHAR_TYPE[46] = OPERATOR // .
CHAR_TYPE[123] = PUNCTUATION // {
CHAR_TYPE[125] = PUNCTUATION // }
CHAR_TYPE[40] = PUNCTUATION // (
CHAR_TYPE[41] = PUNCTUATION // )
CHAR_TYPE[91] = PUNCTUATION // [
CHAR_TYPE[93] = PUNCTUATION // ]
CHAR_TYPE[59] = PUNCTUATION // ;
CHAR_TYPE[44] = PUNCTUATION // ,
CHAR_TYPE[34] = QUOTE // "
CHAR_TYPE[39] = QUOTE // '
CHAR_TYPE[96] = QUOTE // `
CHAR_TYPE[32] = WHITESPACE // space
CHAR_TYPE[9] = WHITESPACE // tab
CHAR_TYPE[10] = WHITESPACE // newline
CHAR_TYPE[13] = WHITESPACE // carriage return

/**
 * Ultra-fast tokenizer - no scope tracking, minimal allocations
 * Targets highlight.js-level performance on small files
 */
export class FastTokenizer {
  private keywordSet: Set<string> | null = null
  private isJsOrTs: boolean
  private isHtml: boolean
  private isCss: boolean

  constructor(grammar: Grammar) {
    this.isJsOrTs = grammar.scopeName === 'source.js' || grammar.scopeName === 'source.ts'
    this.isHtml = grammar.scopeName === 'text.html.basic'
    this.isCss = grammar.scopeName === 'source.css'

    // Pre-build keyword set for O(1) lookups
    if (grammar.keywords) {
      this.keywordSet = new Set(Object.keys(grammar.keywords))
    }
  }

  /**
   * Tokenize entire code block (ultra-fast, no scopes)
   */
  tokenize(code: string): FastTokenLine[] {
    const lines = code.split('\n')
    const result: FastTokenLine[] = []

    for (let i = 0; i < lines.length; i++) {
      result.push(this.tokenizeLine(lines[i]))
    }

    return result
  }

  /**
   * Tokenize a single line (ultra-fast, character dispatch only)
   */
  private tokenizeLine(line: string): FastTokenLine {
    const tokens: FastToken[] = []
    let offset = 0

    while (offset < line.length) {
      const code = line.charCodeAt(offset)
      const charType = CHAR_TYPE[code]

      // Skip whitespace entirely
      if (charType & WHITESPACE) {
        offset++
        continue
      }

      // Numbers
      if (charType & DIGIT) {
        const start = offset
        offset = this.scanNumber(line, offset)
        tokens.push({ type: 'numeric', content: line.slice(start, offset) })
        continue
      }

      // HTML tags
      if (this.isHtml && code === 60) { // <
        const start = offset
        // Scan tag
        offset++
        const isClosing = line.charCodeAt(offset) === 47 // /
        if (isClosing)
          offset++

        // Scan tag name
        while (offset < line.length && CHAR_TYPE[line.charCodeAt(offset)] & LETTER) {
          offset++
        }

        // Scan until >
        while (offset < line.length && line.charCodeAt(offset) !== 62) {
          offset++
        }

        if (line.charCodeAt(offset) === 62)
          offset++ // >

        tokens.push({ type: 'tag', content: line.slice(start, offset) })
        continue
      }

      // CSS selectors and properties
      if (this.isCss) {
        // Selector or property
        if (code === 46 || code === 35 || (charType & LETTER)) { // . # or letter
          const start = offset
          // Scan until { : or ;
          while (offset < line.length) {
            const c = line.charCodeAt(offset)
            if (c === 123 || c === 58 || c === 59)
              break // { : ;
            offset++
          }
          const content = line.slice(start, offset)
          const type = content.includes(':') ? 'property' : 'selector'
          tokens.push({ type, content })
          continue
        }
      }

      // Comments (JS/TS/CSS)
      if (!this.isHtml && code === 47) { // /
        const nextChar = line.charCodeAt(offset + 1)
        if (nextChar === 47) { // //
          tokens.push({ type: 'comment', content: line.slice(offset) })
          break
        }
        else if (nextChar === 42) { // /* block comment */
          const endIndex = line.indexOf('*/', offset + 2)
          if (endIndex !== -1) {
            tokens.push({ type: 'comment', content: line.slice(offset, endIndex + 2) })
            offset = endIndex + 2
            continue
          }
        }
      }

      // HTML/XML comments
      if (this.isHtml && code === 60 && line.charCodeAt(offset + 1) === 33) { // <!--
        const endIndex = line.indexOf('-->', offset + 4)
        if (endIndex !== -1) {
          tokens.push({ type: 'comment', content: line.slice(offset, endIndex + 3) })
          offset = endIndex + 3
          continue
        }
      }

      // Strings
      if (charType & QUOTE) {
        const start = offset
        offset = this.scanString(line, offset, code)
        if (offset > start) {
          tokens.push({ type: 'string', content: line.slice(start, offset) })
          continue
        }
      }

      // Identifiers/Keywords
      if (charType & LETTER) {
        const start = offset
        offset = this.scanWord(line, offset)
        const word = line.slice(start, offset)

        // Check if next char is '(' for function calls
        if (this.isJsOrTs && line.charCodeAt(offset) === 40) {
          tokens.push({ type: 'function', content: word })
          continue
        }

        // Check keyword
        const type = (this.keywordSet && this.keywordSet.has(word)) ? 'keyword' : 'text'
        tokens.push({ type, content: word })
        continue
      }

      // Operators
      if (this.isJsOrTs && (charType & OPERATOR)) {
        const start = offset
        offset = this.scanOperator(line, offset, code)
        tokens.push({ type: 'operator', content: line.slice(start, offset) })
        continue
      }

      // Punctuation
      if (charType & PUNCTUATION) {
        tokens.push({ type: 'punctuation', content: line[offset] })
        offset++
        continue
      }

      // Unknown - consume as text
      tokens.push({ type: 'text', content: line[offset] })
      offset++
    }

    return { tokens }
  }

  /**
   * Scan a number token
   */
  private scanNumber(line: string, offset: number): number {
    let end = offset
    let hasDecimal = false
    let hasExponent = false

    // Handle special number formats (hex, binary, octal)
    if (line[offset] === '0' && offset + 1 < line.length) {
      const next = line.charCodeAt(offset + 1)
      if (next === 120 || next === 88) { // x or X (hex)
        end = offset + 2
        while (end < line.length) {
          const c = line.charCodeAt(end)
          if (!((c >= 48 && c <= 57) || (c >= 65 && c <= 70) || (c >= 97 && c <= 102)))
            break
          end++
        }
        return end
      }
      else if (next === 98 || next === 66) { // b or B (binary)
        end = offset + 2
        while (end < line.length && (line[end] === '0' || line[end] === '1')) end++
        return end
      }
      else if (next === 111 || next === 79) { // o or O (octal)
        end = offset + 2
        while (end < line.length) {
          const c = line.charCodeAt(end)
          if (!(c >= 48 && c <= 55))
            break
          end++
        }
        return end
      }
    }

    // Parse decimal number
    while (end < line.length) {
      const c = line.charCodeAt(end)
      if (c >= 48 && c <= 57) {
        end++
      }
      else if (c === 46 && !hasDecimal && !hasExponent) { // decimal point
        hasDecimal = true
        end++
      }
      else if ((c === 101 || c === 69) && !hasExponent) { // e or E (exponent)
        hasExponent = true
        end++
        if (end < line.length && (line[end] === '+' || line[end] === '-'))
          end++
      }
      else {
        break
      }
    }

    return end
  }

  /**
   * Scan a string token
   */
  private scanString(line: string, offset: number, quoteCode: number): number {
    let end = offset + 1
    let escaped = false

    while (end < line.length) {
      const c = line.charCodeAt(end)
      if (escaped) {
        escaped = false
      }
      else if (c === 92) { // Backslash
        escaped = true
      }
      else if (c === quoteCode) {
        return end + 1
      }
      end++
    }

    return end
  }

  /**
   * Scan a word token (identifier/keyword)
   */
  private scanWord(line: string, offset: number): number {
    let end = offset + 1
    while (end < line.length) {
      const c = line.charCodeAt(end)
      if (!(CHAR_TYPE[c] & (LETTER | DIGIT))) {
        break
      }
      end++
    }
    return end
  }

  /**
   * Scan an operator token
   */
  private scanOperator(line: string, offset: number, char1: number): number {
    if (offset + 1 >= line.length)
      return offset + 1

    const char2 = line.charCodeAt(offset + 1)

    // Check 3-char operators
    if (offset + 2 < line.length) {
      const char3 = line.charCodeAt(offset + 2)
      if ((char1 === 61 && char2 === 61 && char3 === 61) // ===
        || (char1 === 33 && char2 === 61 && char3 === 61) // !==
        || (char1 === 62 && char2 === 62 && char3 === 62) // >>>
        || (char1 === 46 && char2 === 46 && char3 === 46)) { // ...
        return offset + 3
      }
    }

    // Check 2-char operators
    if ((char1 === 43 && char2 === 43) // ++
      || (char1 === 45 && char2 === 45) // --
      || (char1 === 61 && char2 === 61) // ==
      || (char1 === 33 && char2 === 61) // !=
      || (char1 === 60 && char2 === 61) // <=
      || (char1 === 62 && char2 === 61) // >=
      || (char1 === 38 && char2 === 38) // &&
      || (char1 === 124 && char2 === 124) // ||
      || (char1 === 61 && char2 === 62) // =>
      || (char1 === 60 && char2 === 60) // <<
      || (char1 === 62 && char2 === 62)) { // >>
      return offset + 2
    }

    return offset + 1
  }
}
