import type { Grammar, GrammarPattern, Token, TokenLine } from './types'

interface ScopeStack {
  scopes: string[]
  rule: GrammarPattern | null
  endPattern?: RegExp
}

interface CompiledPattern extends GrammarPattern {
  _compiledMatch?: RegExp
  _compiledBegin?: RegExp
  _compiledEnd?: RegExp
}

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
        if (result.token) {
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
  ): { token: Token | null, offset: number } | null {
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

    // Ultra-fast character dispatch with pre-computed scopes - only at root level
    if (currentScope.rule === null) {
      const code = line.charCodeAt(offset)
      const charType = CHAR_TYPE[code]

      // Fast path: Skip whitespace entirely (don't create tokens for it)
      if (charType & WHITESPACE) {
        let wsEnd = offset + 1
        while (wsEnd < line.length && (CHAR_TYPE[line.charCodeAt(wsEnd)] & WHITESPACE)) {
          wsEnd++
        }
        // Return null token to indicate we consumed whitespace but don't want to create a token
        return {
          token: null,
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
          // Multi-line block comment - fall through to patterns for proper multiline handling
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
      if (charType & LETTER) {
        // Extract full word using lookup table
        let wordEnd = offset + 1
        while (wordEnd < line.length) {
          const c = line.charCodeAt(wordEnd)
          if (!(CHAR_TYPE[c] & (LETTER | DIGIT))) {
            break
          }
          wordEnd++
        }

        // Check if it's a function call first (word followed by '(') - no need to extract word
        const nextChar = line.charCodeAt(wordEnd)
        if (this.isJsOrTs && nextChar === 40) { // 40 = '('
          const word = line.slice(offset, wordEnd)
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

        const word = line.slice(offset, wordEnd)

        // Check if it's a keyword (O(1) Map lookup with pre-computed scopes)
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
  ): { token: Token | null, offset: number } | null {
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
   * Handle include references in patterns
   */
  private handleInclude(
    include: string,
    line: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number } | null {
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
}
