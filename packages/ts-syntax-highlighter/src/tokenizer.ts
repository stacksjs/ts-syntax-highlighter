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

export class Tokenizer {
  private grammar: Grammar
  private scopeStack: ScopeStack[] = []
  private regexCache: Map<string, RegExp> = new Map()
  private compiledPatterns: CompiledPattern[]

  constructor(grammar: Grammar) {
    this.grammar = grammar
    // Pre-compile all regexes during initialization for better performance
    this.compiledPatterns = this.precompilePatterns(grammar.patterns)
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
        const scopes = this.getCurrentScopes()
        tokens.push({
          type: 'text',
          content: line[offset],
          scopes,
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
    // Check if we need to close the current scope
    const currentScope = this.scopeStack[this.scopeStack.length - 1]
    if (currentScope.endPattern) {
      currentScope.endPattern.lastIndex = offset
      const endMatch = currentScope.endPattern.exec(line)
      if (endMatch && endMatch.index === offset) {
        const content = endMatch[0]
        const scopes = this.getCurrentScopes()

        this.scopeStack.pop() // Close the scope

        return {
          token: {
            type: 'punctuation',
            content,
            scopes,
            line: lineNumber,
            offset,
          },
          offset: offset + content.length,
        }
      }
    }

    // Try to match patterns (pass full line + offset, not substring)
    const patterns = this.getActivePatterns()

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
    return patterns.map(pattern => {
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
        const currentScopes = this.getCurrentScopes()

        if (pattern.name) {
          currentScopes.push(pattern.name)
        }

        // Push new scope onto stack
        const endPattern = compiled._compiledEnd || (pattern.end ? this.getRegex(pattern.end) : undefined)
        this.scopeStack.push({
          scopes: currentScopes,
          rule: pattern,
          endPattern,
        })

        return {
          token: {
            type: this.getTokenType(pattern.name),
            content,
            scopes: currentScopes,
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
        const currentScopes = this.getCurrentScopes()

        if (pattern.name) {
          currentScopes.push(pattern.name)
        }

        return {
          token: {
            type: this.getTokenType(pattern.name),
            content,
            scopes: currentScopes,
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
   * Get the currently active patterns based on scope stack (optimized)
   */
  private getActivePatterns(): GrammarPattern[] {
    const currentScope = this.scopeStack[this.scopeStack.length - 1]

    if (currentScope.rule?.patterns) {
      return currentScope.rule.patterns
    }

    // Return pre-compiled patterns for root level
    return this.compiledPatterns
  }

  /**
   * Get current scopes from the scope stack
   */
  private getCurrentScopes(): string[] {
    const currentScope = this.scopeStack[this.scopeStack.length - 1]
    return currentScope.scopes.slice()
  }

  /**
   * Get token type from scope name
   */
  private getTokenType(scopeName?: string): string {
    if (!scopeName)
      return 'text'

    // Extract the last part of the scope for the type
    const parts = scopeName.split('.')
    return parts[parts.length - 1] || 'text'
  }
}
