import type { Grammar, GrammarPattern, Token, TokenizerState, TokenLine } from './types'

interface ScopeStack {
  scopes: string[]
  rule: GrammarPattern | null
  endPattern?: RegExp
  /**
   * Everything up to `endPattern` is content, not code.
   *
   * Set for a block comment that runs past the end of its line. Without it the
   * pattern loop keeps matching inside the comment, so the body of a comment
   * highlights as keywords and numbers.
   */
  raw?: boolean
  /** The source of `endPattern`, so the frame can be written down and restored. */
  endSource?: string
}

interface CompiledPattern extends GrammarPattern {
  _compiledMatch?: RegExp
  _compiledBegin?: RegExp
  _compiledEnd?: RegExp
}

/** Closes a block comment. Held here so the state can name it and restore it. */
const BLOCK_COMMENT_END = '\\*/'

// Character type lookup tables for ultra-fast dispatch
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

export class Tokenizer {
  private grammar: Grammar
  private scopeStack: ScopeStack[] = []
  private regexCache: Map<string, RegExp> = new Map()
  private compiledPatterns: CompiledPattern[]
  /** Compiled pattern by its path in the grammar, e.g. `"3.1.0"`. */
  private patternsByPath: Map<string, CompiledPattern> = new Map()
  /** The same relation the other way, for writing a state out. */
  private pathsByPattern: Map<GrammarPattern, string> = new Map()
  private numberRegex: RegExp
  private isJsOrTs: boolean
  // Pre-computed scope arrays for common tokens (Option 3)
  private rootScopes: string[]
  private numericScopes: string[]
  private operatorScopes: string[]
  private commentScopes: string[]
  private blockCommentScopes: string[]
  private stringScopes: string[]
  private templateScopes: string[]
  private functionScopes: string[]
  // Interned strings for common types (faster than string operations)
  private static readonly TYPE_TEXT = 'text'
  private static readonly TYPE_PUNCTUATION = 'punctuation'
  private static readonly TYPE_NUMERIC = 'numeric'
  private static readonly TYPE_LINE = 'line'
  private static readonly TYPE_BLOCK = 'block'
  private static readonly TYPE_DOUBLE = 'double'
  private static readonly TYPE_SINGLE = 'single'
  private static readonly TYPE_TEMPLATE = 'template'
  private static readonly TYPE_FUNCTION = 'function'
  private static readonly TYPE_OPERATOR = 'operator'
  // Pre-computed keyword lookups for O(1) access
  private keywordSet: Set<string> | null = null
  private keywordMap: Map<string, { scopes: string[], type: string }> = new Map()

  constructor(grammar: Grammar) {
    this.grammar = grammar
    // Pre-compile all regexes during initialization for better performance
    this.compiledPatterns = this.precompilePatterns(grammar.patterns)
    // Index every compiled pattern by its position in the grammar, so a scope
    // stack can be written down as paths and read back. See getState().
    this.indexPatterns(this.compiledPatterns, '')
    // Pre-compile number regex for fast path
    this.numberRegex = /^(0x[0-9a-f]+|0b[01]+|0o[0-7]+|\d+(\.\d+)?(e[+-]?\d+)?)/i
    // Check if this is JS/TS for safe fast paths
    this.isJsOrTs = grammar.scopeName === 'source.js' || grammar.scopeName === 'source.ts'

    // Pre-compute scope arrays (Option 3)
    const langSuffix = this.grammar.scopeName.split('.')[1] || 'js'
    this.rootScopes = [this.grammar.scopeName]
    this.numericScopes = [this.grammar.scopeName, `constant.numeric.${langSuffix}`]
    this.operatorScopes = [this.grammar.scopeName, `keyword.operator.${langSuffix}`]
    this.commentScopes = [this.grammar.scopeName, `comment.line.double-slash.${langSuffix}`]
    this.blockCommentScopes = [this.grammar.scopeName, `comment.block.${langSuffix}`]
    this.stringScopes = [this.grammar.scopeName, `string.quoted.double.${langSuffix}`]
    this.templateScopes = [this.grammar.scopeName, `string.template.${langSuffix}`]
    this.functionScopes = [this.grammar.scopeName, `entity.name.function.${langSuffix}`]

    // Pre-compute keyword lookups with scopes and types
    if (this.grammar.keywords) {
      this.keywordSet = new Set(Object.keys(this.grammar.keywords))
      for (const [word, scopeName] of Object.entries(this.grammar.keywords)) {
        if (typeof scopeName === 'string') {
          const scopes = [this.grammar.scopeName, scopeName]
          const lastDot = scopeName.lastIndexOf('.')
          const type = lastDot === -1 ? scopeName : scopeName.slice(lastDot + 1)
          this.keywordMap.set(word, { scopes, type })
        }
      }
    }
  }

  /**
   * Tokenize a line of code
   */
  tokenizeLine(line: string, lineNumber: number, prevStack?: ScopeStack[]): TokenLine {
    this.scopeStack = prevStack ? [...prevStack] : [{ scopes: [this.grammar.scopeName], rule: null }]
    const tokens: Token[] = []
    let offset = 0

    while (offset < line.length) {
      const result = this.matchNextToken(line, offset, lineNumber)

      if (result) {
        // Handle multiple tokens from capture groups
        if (result.tokens) {
          tokens.push(...result.tokens)
        }
        else if (result.token) {
          tokens.push(result.token)
        }
        offset = result.offset
      }
      else {
        // No match found, consume one character as plain text
        const currentScope = this.scopeStack[this.scopeStack.length - 1]
        tokens.push({
          type: Tokenizer.TYPE_TEXT,
          content: line[offset],
          scopes: currentScope.scopes, // Reuse - no copy needed
          line: lineNumber,
          offset,
        })
        offset++
      }
    }

    return { tokens, line: lineNumber }
  }

  /**
   * Tokenize entire code block
   */
  tokenize(code: string): TokenLine[] {
    const lines = code.split('\n')
    const result: TokenLine[] = []
    let prevStack: ScopeStack[] | undefined

    for (let i = 0; i < lines.length; i++) {
      const tokenLine = this.tokenizeLine(lines[i], i + 1, prevStack)
      result.push(tokenLine)
      prevStack = this.scopeStack
    }

    return result
  }

  /**
   * Match the next token at the current offset (zero-copy - no string slicing)
   */
  private matchNextToken(
    line: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number, tokens?: Token[] } | null {
    // Cache frequently accessed values (inline to reduce lookups)
    const currentScope = this.scopeStack[this.scopeStack.length - 1]

    // Check if we need to close the current scope
    if (currentScope.endPattern) {
      currentScope.endPattern.lastIndex = offset
      const endMatch = currentScope.endPattern.exec(line)
      if (endMatch && endMatch.index === offset) {
        const content = endMatch[0]
        const scopes = currentScope.scopes // Reuse - no copy needed

        this.scopeStack.pop() // Close the scope

        return {
          token: {
            type: Tokenizer.TYPE_PUNCTUATION,
            content,
            scopes,
            line: lineNumber,
            offset,
          },
          offset: offset + content.length,
        }
      }
    }

    // Inside a raw frame (a block comment spanning lines), everything up to the
    // closing marker is content. Emitted as one token per line rather than
    // being handed to the pattern loop, which would find keywords in prose.
    if (currentScope.raw) {
      let end = line.length

      if (currentScope.endPattern) {
        currentScope.endPattern.lastIndex = offset
        const closing = currentScope.endPattern.exec(line)
        // A match at `offset` was already handled above, so this one is later.
        if (closing)
          end = closing.index
      }

      if (end > offset) {
        return {
          token: {
            type: Tokenizer.TYPE_BLOCK,
            content: line.slice(offset, end),
            scopes: currentScope.scopes,
            line: lineNumber,
            offset,
          },
          offset: end,
        }
      }
    }

    // Ultra-fast character dispatch with pre-computed scopes - only at root level
    if (currentScope.rule === null && !currentScope.raw) {
      const code = line.charCodeAt(offset)
      const charType = CHAR_TYPE[code]

      // Fast path: a whole run of whitespace as one token.
      //
      // This used to consume the run and emit nothing, on the reasoning that
      // whitespace needs no colour. It does need to exist: the renderer joins
      // token contents with no separator, so `const a = 1` came out of
      // `highlight()` as `consta=1`, and every indented line lost its
      // indentation. One token per run rather than per character, so the scan
      // is unchanged and the cost is an object per run.
      if (charType & WHITESPACE) {
        let wsEnd = offset + 1
        while (wsEnd < line.length && (CHAR_TYPE[line.charCodeAt(wsEnd)] & WHITESPACE)) {
          wsEnd++
        }

        return {
          token: {
            type: Tokenizer.TYPE_TEXT,
            content: line.slice(offset, wsEnd),
            scopes: this.rootScopes,
            line: lineNumber,
            offset,
          },
          offset: wsEnd,
        }
      }

      // Fast path: Punctuation
      if (charType & PUNCTUATION) {
        return {
          token: {
            type: Tokenizer.TYPE_PUNCTUATION,
            content: line[offset],
            scopes: this.rootScopes, // Pre-computed, no allocation
            line: lineNumber,
            offset,
          },
          offset: offset + 1,
        }
      }

      // Fast path: Numbers
      if (charType & DIGIT) {
        // Manually parse number without regex
        let end = offset
        let hasDecimal = false
        let hasExponent = false

        // Parse integer part or hex/binary/octal
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
          }
          else if (next === 98 || next === 66) { // b or B (binary)
            end = offset + 2
            while (end < line.length && (line[end] === '0' || line[end] === '1')) end++
          }
          else if (next === 111 || next === 79) { // o or O (octal)
            end = offset + 2
            while (end < line.length) {
              const c = line.charCodeAt(end)
              if (!(c >= 48 && c <= 55))
                break
              end++
            }
          }
        }

        if (end === offset) { // Not a special number, parse as decimal
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
        }

        if (end > offset) {
          const content = line.slice(offset, end)
          return {
            token: {
              type: Tokenizer.TYPE_NUMERIC,
              content,
              scopes: this.numericScopes, // Pre-computed, no allocation
              line: lineNumber,
              offset,
            },
            offset: end,
          }
        }
      }

      // Fast path: Comments (/ char)
      if (code === 47) { // /
        const nextChar = line.charCodeAt(offset + 1)
        // Single-line comment //
        if (nextChar === 47) {
          const content = line.slice(offset)
          return {
            token: {
              type: Tokenizer.TYPE_LINE,
              content,
              scopes: this.commentScopes, // Pre-computed
              line: lineNumber,
              offset,
            },
            offset: line.length,
          }
        }
        // Block comment /* - try fast path for single-line block comments
        else if (nextChar === 42) { // *
          const endIndex = line.indexOf('*/', offset + 2)
          if (endIndex !== -1) {
            // Single-line block comment
            const content = line.slice(offset, endIndex + 2)
            return {
              token: {
                type: Tokenizer.TYPE_BLOCK,
                content,
                scopes: this.blockCommentScopes, // Pre-computed
                line: lineNumber,
                offset,
              },
              offset: endIndex + 2,
            }
          }
          // A block comment that runs past the end of this line.
          //
          // This used to fall through "to patterns for proper multiline
          // handling", and the patterns never got a chance: the operator fast
          // path below matched `/` and `*` first, so `/*` became two operators
          // and the whole body of the comment tokenized as code. A diff full of
          // licence headers highlighted as though the licence were a program.
          //
          // Instead, open a frame that stays open until `*/` and consumes what
          // it spans as comment text.
          this.scopeStack.push({
            scopes: this.blockCommentScopes,
            rule: null,
            raw: true,
            endPattern: this.getRegex(BLOCK_COMMENT_END),
            endSource: BLOCK_COMMENT_END,
          })

          return {
            token: {
              type: Tokenizer.TYPE_BLOCK,
              content: line.slice(offset),
              scopes: this.blockCommentScopes,
              line: lineNumber,
              offset,
            },
            offset: line.length,
          }
        }
      }

      // Fast path: Strings (simple implementation - good enough for most cases)
      if (charType & QUOTE) {
        const quoteCode = code
        let endIndex = offset + 1
        let escaped = false
        // Find closing quote, handling escapes
        while (endIndex < line.length) {
          const c = line.charCodeAt(endIndex)
          if (escaped) {
            escaped = false
          }
          else if (c === 92) { // Backslash
            escaped = true
          }
          else if (c === quoteCode) {
            break
          }
          endIndex++
        }
        if (endIndex < line.length) {
          const content = line.slice(offset, endIndex + 1)
          const scopeType = quoteCode === 96 ? Tokenizer.TYPE_TEMPLATE : (quoteCode === 34 ? Tokenizer.TYPE_DOUBLE : Tokenizer.TYPE_SINGLE)
          const scopes = quoteCode === 96 ? this.templateScopes : this.stringScopes
          return {
            token: {
              type: scopeType,
              content,
              scopes, // Pre-computed based on quote type
              line: lineNumber,
              offset,
            },
            offset: endIndex + 1,
          }
        }
      }

      // Fast path: Identifiers/Keywords
      // Skip fast path for $ character in non-JS/TS languages (for variables in bash, php, etc.)
      if (charType & LETTER && (code !== 36 || this.isJsOrTs)) {
        // Extract full word using lookup table
        let wordEnd = offset + 1
        while (wordEnd < line.length) {
          const c = line.charCodeAt(wordEnd)
          if (!(CHAR_TYPE[c] & (LETTER | DIGIT))) {
            break
          }
          wordEnd++
        }

        const word = line.slice(offset, wordEnd)

        // Check if it's a keyword first (O(1) Map lookup with pre-computed scopes)
        if (this.keywordSet && this.keywordSet.has(word)) {
          const kwData = this.keywordMap.get(word)!
          return {
            token: {
              type: kwData.type,
              content: word,
              scopes: kwData.scopes, // Pre-computed, no allocation
              line: lineNumber,
              offset,
            },
            offset: wordEnd,
          }
        }

        // Check if it's a function call (word followed by '(' or whitespace then '(')
        let checkPos = wordEnd
        // Skip optional whitespace
        while (checkPos < line.length && (CHAR_TYPE[line.charCodeAt(checkPos)] & WHITESPACE)) {
          checkPos++
        }
        const nextChar = line.charCodeAt(checkPos)
        if (nextChar === 40) { // 40 = '('
          return {
            token: {
              type: Tokenizer.TYPE_FUNCTION,
              content: word,
              scopes: this.functionScopes, // Pre-computed
              line: lineNumber,
              offset,
            },
            offset: wordEnd,
          }
        }

        // Otherwise it's a plain identifier - use root scopes
        return {
          token: {
            type: Tokenizer.TYPE_TEXT,
            content: word,
            scopes: this.rootScopes, // Pre-computed, no allocation
            line: lineNumber,
            offset,
          },
          offset: wordEnd,
        }
      }

      // Fast path: Operators (only for JS/TS - CSS needs special handling for . and :)
      if (this.isJsOrTs && (charType & OPERATOR)) {
        // Check for 3-char operators by comparing char codes directly (zero slice)
        let opLength = 1
        const char1 = code
        const char2 = line.charCodeAt(offset + 1)
        const char3 = line.charCodeAt(offset + 2)

        // Check 3-char operators: === !== >>> ...
        if (offset + 2 < line.length) {
          if ((char1 === 61 && char2 === 61 && char3 === 61) // ===
            || (char1 === 33 && char2 === 61 && char3 === 61) // !==
            || (char1 === 62 && char2 === 62 && char3 === 62) // >>>
            || (char1 === 46 && char2 === 46 && char3 === 46)) { // ...
            opLength = 3
          }
        }

        // Check 2-char operators if not 3-char
        if (opLength === 1 && offset + 1 < line.length) {
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
            opLength = 2
          }
        }

        const content = line.slice(offset, offset + opLength)
        return {
          token: {
            type: Tokenizer.TYPE_OPERATOR,
            content,
            scopes: this.operatorScopes, // Pre-computed
            line: lineNumber,
            offset,
          },
          offset: offset + opLength,
        }
      }
    }

    // Try to match patterns - inline getActivePatterns() to reduce call overhead
    const patterns = currentScope.rule?.patterns || this.compiledPatterns

    for (const pattern of patterns) {
      const result = this.matchPattern(pattern, line, offset, lineNumber)
      if (result) {
        return result
      }
    }

    return null
  }

  /**
   * Pre-compile all regex patterns for maximum performance
   * Uses 'g' flag for lastIndex-based matching
   */
  private precompilePatterns(patterns: GrammarPattern[]): CompiledPattern[] {
    return patterns.map((pattern) => {
      const compiled: CompiledPattern = { ...pattern }

      if (pattern.match) {
        compiled._compiledMatch = new RegExp(pattern.match, 'g')
      }
      if (pattern.begin) {
        compiled._compiledBegin = new RegExp(pattern.begin, 'g')
      }
      if (pattern.end) {
        compiled._compiledEnd = new RegExp(pattern.end, 'g')
      }
      if (pattern.patterns) {
        compiled.patterns = this.precompilePatterns(pattern.patterns)
      }

      return compiled
    })
  }

  /**
   * Get or create cached regex (fallback for dynamic patterns)
   * Uses 'g' flag for lastIndex-based matching
   */
  private getRegex(pattern: string): RegExp {
    let regex = this.regexCache.get(pattern)
    if (!regex) {
      regex = new RegExp(pattern, 'g')
      this.regexCache.set(pattern, regex)
    }
    return regex
  }

  /**
   * Match a single pattern (zero-copy - no string slicing)
   */
  private matchPattern(
    pattern: GrammarPattern,
    line: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number, tokens?: Token[] } | null {
    // Handle include references
    if (pattern.include) {
      return this.handleInclude(pattern.include, line, offset, lineNumber)
    }

    const compiled = pattern as CompiledPattern

    // Handle begin/end patterns - use exec() with lastIndex
    if (pattern.begin) {
      const beginRegex = compiled._compiledBegin || this.getRegex(pattern.begin)
      beginRegex.lastIndex = offset
      const match = beginRegex.exec(line)

      if (match && match.index === offset) {
        const content = match[0]
        const currentScope = this.scopeStack[this.scopeStack.length - 1]

        // Only create new array if we're adding a scope
        const scopes = pattern.name
          ? [...currentScope.scopes, pattern.name]
          : currentScope.scopes

        // Push new scope onto stack
        const endPattern = compiled._compiledEnd || (pattern.end ? this.getRegex(pattern.end) : undefined)
        this.scopeStack.push({
          scopes,
          rule: pattern,
          endPattern,
        })

        // Handle beginCaptures if present
        if (pattern.beginCaptures) {
          const tokens = this.applyCaptureGroups(match, pattern.beginCaptures, currentScope.scopes, lineNumber, offset)
          if (tokens && tokens.length > 0) {
            return {
              token: null,
              tokens,
              offset: offset + content.length,
            }
          }
        }

        // Inline getTokenType to avoid function call and split()
        let type = Tokenizer.TYPE_TEXT
        if (pattern.name && typeof pattern.name === 'string') {
          const lastDot = pattern.name.lastIndexOf('.')
          type = lastDot === -1 ? pattern.name : pattern.name.slice(lastDot + 1)
        }

        return {
          token: {
            type,
            content,
            scopes,
            line: lineNumber,
            offset,
          },
          offset: offset + content.length,
        }
      }
    }

    // Handle simple match patterns - use exec() with lastIndex
    if (pattern.match) {
      const regex = compiled._compiledMatch || this.getRegex(pattern.match)
      regex.lastIndex = offset
      const match = regex.exec(line)

      if (match && match.index === offset) {
        const content = match[0]
        const currentScope = this.scopeStack[this.scopeStack.length - 1]

        // Handle captures if present (only if pattern doesn't have a name, or if we want fine-grained control)
        // For now, prefer pattern.name over captures for compatibility
        if (pattern.captures && !pattern.name) {
          const tokens = this.applyCaptureGroups(match, pattern.captures, currentScope.scopes, lineNumber, offset)
          if (tokens && tokens.length > 0) {
            return {
              token: null,
              tokens,
              offset: offset + content.length,
            }
          }
        }

        // Only create new array if we're adding a scope
        const scopes = pattern.name
          ? [...currentScope.scopes, pattern.name]
          : currentScope.scopes

        // Inline getTokenType to avoid function call and split()
        let type = Tokenizer.TYPE_TEXT
        if (pattern.name && typeof pattern.name === 'string') {
          const lastDot = pattern.name.lastIndexOf('.')
          type = lastDot === -1 ? pattern.name : pattern.name.slice(lastDot + 1)
        }

        return {
          token: {
            type,
            content,
            scopes,
            line: lineNumber,
            offset,
          },
          offset: offset + content.length,
        }
      }
    }

    return null
  }

  /**
   * Apply capture groups to create multiple tokens with specific scopes
   */
  private applyCaptureGroups(
    match: RegExpExecArray,
    captures: Record<string, { name: string }>,
    baseScopes: string[],
    lineNumber: number,
    baseOffset: number,
  ): Token[] | null {
    const tokens: Token[] = []
    let currentOffset = 0

    // Process each capture group
    for (let i = 0; i < match.length; i++) {
      const captured = match[i]
      if (captured === undefined)
        continue

      const captureKey = i.toString()
      const capture = captures[captureKey]

      if (i === 0) {
        // Group 0 is the full match - split it by capture groups
        continue
      }

      // Find where this capture starts in the full match
      const captureStart = match[0].indexOf(captured, currentOffset)
      if (captureStart === -1)
        continue

      // Add any text before this capture as a plain token
      if (captureStart > currentOffset) {
        const beforeText = match[0].substring(currentOffset, captureStart)
        tokens.push({
          type: Tokenizer.TYPE_TEXT,
          content: beforeText,
          scopes: baseScopes,
          line: lineNumber,
          offset: baseOffset + currentOffset,
        })
      }

      // Add the captured group with its specific scope
      const scopes = capture && capture.name
        ? [...baseScopes, capture.name]
        : baseScopes

      let type = Tokenizer.TYPE_TEXT
      if (capture && capture.name) {
        const lastDot = capture.name.lastIndexOf('.')
        type = lastDot === -1 ? capture.name : capture.name.slice(lastDot + 1)
      }

      tokens.push({
        type,
        content: captured,
        scopes,
        line: lineNumber,
        offset: baseOffset + captureStart,
      })

      currentOffset = captureStart + captured.length
    }

    // Add any remaining text after the last capture
    if (currentOffset < match[0].length) {
      const afterText = match[0].substring(currentOffset)
      tokens.push({
        type: Tokenizer.TYPE_TEXT,
        content: afterText,
        scopes: baseScopes,
        line: lineNumber,
        offset: baseOffset + currentOffset,
      })
    }

    return tokens.length > 0 ? tokens : null
  }

  /**
   * Handle include references in patterns
   */
  private handleInclude(
    include: string,
    line: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number, tokens?: Token[] } | null {
    // Handle $self reference
    if (include === '$self') {
      for (const pattern of this.grammar.patterns) {
        const result = this.matchPattern(pattern, line, offset, lineNumber)
        if (result)
          return result
      }
      return null
    }

    // Handle repository references
    if (include.startsWith('#')) {
      const ruleName = include.slice(1)
      const rule = this.grammar.repository?.[ruleName]

      if (rule && rule.patterns) {
        for (const pattern of rule.patterns) {
          const result = this.matchPattern(pattern, line, offset, lineNumber)
          if (result)
            return result
        }
      }
    }

    return null
  }

  /**
   * Get token type from scope name
   */
  private getTokenType(scopeName?: string): string {
    if (!scopeName || typeof scopeName !== 'string')
      return 'text'

    // Extract the last part of the scope for the type
    const parts = scopeName.split('.')
    return parts[parts.length - 1] || 'text'
  }

  /**
   * Get the current scope stack (for streaming/batching)
   *
   * Live objects: fine to hand straight back to `tokenizeLine` in the same
   * process, and useless across a worker boundary because the frames hold
   * compiled RegExps and references into the grammar. Use `getState()` when
   * the position has to be written down, sent somewhere, or stored.
   */
  getScopeStack(): ScopeStack[] {
    return this.scopeStack
  }

  /**
   * Record where the tokenizer is, in a form that survives being written down.
   *
   * This is what makes two things possible.
   *
   * Tokenizing in a worker: the state crosses a `postMessage` boundary, which
   * cannot carry a RegExp or a reference into a grammar object, so the frames
   * are reduced to scope names and a path into the pattern tree.
   *
   * Tokenizing part of a file: a diff hunk starts at line four hundred, and
   * whether line four hundred is inside a block comment is not knowable from
   * the hunk. Given the state saved at the line before it, it is exactly
   * knowable, and the hunk highlights the same as the whole file would.
   */
  getState(): TokenizerState {
    return {
      scopeName: this.grammar.scopeName,
      frames: this.scopeStack.map(frame => ({
        scopes: [...frame.scopes],
        pattern: frame.rule ? this.pathsByPattern.get(frame.rule) ?? null : null,
        // A frame the tokenizer opened itself, such as a block comment running
        // past the end of its line, has no pattern to point at. It carries its
        // own closing marker instead, so it survives the round trip: without
        // this, resuming inside a comment resumes as though it had closed.
        ...(frame.raw ? { raw: true, end: frame.endSource ?? BLOCK_COMMENT_END } : {}),
      })),
    }
  }

  /**
   * Restore a position recorded by `getState()`.
   *
   * A state from another grammar is refused. Silently accepting it would give
   * confidently wrong highlighting for the rest of the file, which is worse
   * than not highlighting at all and much harder to notice.
   */
  setState(state: TokenizerState): void {
    if (state.scopeName !== this.grammar.scopeName) {
      throw new Error(
        `Tokenizer state belongs to ${state.scopeName}, not ${this.grammar.scopeName}`,
      )
    }

    this.scopeStack = state.frames.map((frame) => {
      if (frame.raw) {
        const endSource = frame.end ?? BLOCK_COMMENT_END
        return {
          scopes: [...frame.scopes],
          rule: null,
          raw: true,
          endPattern: this.getRegex(endSource),
          endSource,
        }
      }

      const rule = frame.pattern === null ? null : this.patternsByPath.get(frame.pattern) ?? null
      const compiled = rule as CompiledPattern | null
      const endSource = compiled?.end

      return {
        scopes: [...frame.scopes],
        rule,
        // Recompiled rather than carried: a RegExp has a mutable lastIndex, and
        // sharing one between the saved state and the live tokenizer is how a
        // resumed line silently starts matching from the wrong offset.
        endPattern: endSource ? this.getRegex(endSource) : undefined,
        endSource,
      }
    })

    // An empty or unrecognisable state still has to leave the tokenizer usable.
    if (this.scopeStack.length === 0)
      this.scopeStack = [{ scopes: [this.grammar.scopeName], rule: null }]
  }

  /** The state a document starts in, before any line has been tokenized. */
  initialState(): TokenizerState {
    return {
      scopeName: this.grammar.scopeName,
      frames: [{ scopes: [this.grammar.scopeName], pattern: null }],
    }
  }

  /**
   * Tokenize a run of lines, starting from a recorded position.
   *
   * The unit a worker and a diff both want: hand it the lines and where the
   * previous run finished, get back the tokens and where this one finished.
   * Storing the end state every few hundred lines is what lets a reader seek
   * into the middle of a large file without re-tokenizing from line one.
   */
  tokenizeLinesFrom(
    lines: readonly string[],
    startState?: TokenizerState,
    firstLineNumber = 1,
  ): { lines: TokenLine[], endState: TokenizerState } {
    if (startState)
      this.setState(startState)
    else
      this.scopeStack = [{ scopes: [this.grammar.scopeName], rule: null }]

    const result: TokenLine[] = []
    let carried = this.scopeStack

    for (let index = 0; index < lines.length; index++) {
      result.push(this.tokenizeLine(lines[index]!, firstLineNumber + index, carried))
      carried = this.scopeStack
    }

    return { lines: result, endState: this.getState() }
  }

  /**
   * Walk a document, recording the state every `interval` lines.
   *
   * The checkpoints are what turn "highlight lines 400,000 to 400,050" from a
   * walk of the whole file into a walk of at most `interval` lines. Returned as
   * a map from line number to the state *before* that line.
   */
  checkpoints(code: string, interval = 500): Map<number, TokenizerState> {
    const lines = code.split('\n')
    const checkpoints = new Map<number, TokenizerState>()

    this.scopeStack = [{ scopes: [this.grammar.scopeName], rule: null }]
    let carried: ScopeStack[] | undefined

    for (let index = 0; index < lines.length; index++) {
      if (index % interval === 0)
        checkpoints.set(index + 1, this.getState())

      this.tokenizeLine(lines[index]!, index + 1, carried)
      carried = this.scopeStack
    }

    return checkpoints
  }

  /**
   * Give every compiled pattern a stable name: its position in the tree.
   *
   * Indices rather than anything derived from the pattern's contents, because
   * two patterns in one grammar can be identical and still be different frames.
   * The path is only meaningful against the grammar that produced it, which is
   * why a state carries its scope name.
   */
  private indexPatterns(patterns: CompiledPattern[], prefix: string): void {
    for (let index = 0; index < patterns.length; index++) {
      const pattern = patterns[index]!
      const path = prefix === '' ? String(index) : `${prefix}.${index}`

      this.patternsByPath.set(path, pattern)
      this.pathsByPattern.set(pattern, path)

      if (pattern.patterns)
        this.indexPatterns(pattern.patterns as CompiledPattern[], path)
    }
  }
}
