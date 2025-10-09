import type { Grammar, GrammarPattern, Token, TokenLine } from './types'

interface ScopeStack {
  scopes: string[]
  rule: GrammarPattern | null
  endPattern?: RegExp
}

export class Tokenizer {
  private grammar: Grammar
  private scopeStack: ScopeStack[] = []

  constructor(grammar: Grammar) {
    this.grammar = grammar
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
   * Match the next token at the current offset
   */
  private matchNextToken(
    line: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number } | null {
    const remaining = line.slice(offset)

    // Check if we need to close the current scope
    const currentScope = this.scopeStack[this.scopeStack.length - 1]
    if (currentScope.endPattern) {
      const endMatch = remaining.match(currentScope.endPattern)
      if (endMatch && endMatch.index === 0) {
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

    // Try to match patterns
    const patterns = this.getActivePatterns()

    for (const pattern of patterns) {
      const result = this.matchPattern(pattern, remaining, offset, lineNumber)
      if (result) {
        return result
      }
    }

    return null
  }

  /**
   * Cache for compiled regex patterns (performance optimization)
   */
  private regexCache: Map<string, RegExp> = new Map()

  /**
   * Get or create cached regex
   */
  private getRegex(pattern: string): RegExp {
    let regex = this.regexCache.get(pattern)
    if (!regex) {
      regex = new RegExp(pattern)
      this.regexCache.set(pattern, regex)
    }
    return regex
  }

  /**
   * Match a single pattern (optimized)
   */
  private matchPattern(
    pattern: GrammarPattern,
    text: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number } | null {
    // Handle include references
    if (pattern.include) {
      return this.handleInclude(pattern.include, text, offset, lineNumber)
    }

    // Handle begin/end patterns
    if (pattern.begin) {
      const beginRegex = this.getRegex(pattern.begin)
      const match = text.match(beginRegex)

      if (match && match.index === 0) {
        const content = match[0]
        const scopes = [...this.getCurrentScopes()]

        if (pattern.name) {
          scopes.push(pattern.name)
        }

        // Push new scope onto stack
        const endPattern = pattern.end ? this.getRegex(pattern.end) : undefined
        this.scopeStack.push({
          scopes,
          rule: pattern,
          endPattern,
        })

        return {
          token: {
            type: this.getTokenType(pattern.name),
            content,
            scopes,
            line: lineNumber,
            offset,
          },
          offset: offset + content.length,
        }
      }
    }

    // Handle simple match patterns
    if (pattern.match) {
      const regex = this.getRegex(pattern.match)
      const match = text.match(regex)

      if (match && match.index === 0) {
        const content = match[0]
        const scopes = [...this.getCurrentScopes()]

        if (pattern.name) {
          scopes.push(pattern.name)
        }

        return {
          token: {
            type: this.getTokenType(pattern.name),
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
    text: string,
    offset: number,
    lineNumber: number,
  ): { token: Token | null, offset: number } | null {
    // Handle $self reference
    if (include === '$self') {
      for (const pattern of this.grammar.patterns) {
        const result = this.matchPattern(pattern, text, offset, lineNumber)
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
          const result = this.matchPattern(pattern, text, offset, lineNumber)
          if (result)
            return result
        }
      }
    }

    return null
  }

  /**
   * Get the currently active patterns based on scope stack
   */
  private getActivePatterns(): GrammarPattern[] {
    const currentScope = this.scopeStack[this.scopeStack.length - 1]

    if (currentScope.rule?.patterns) {
      return currentScope.rule.patterns
    }

    return this.grammar.patterns
  }

  /**
   * Get current scopes from the scope stack
   */
  private getCurrentScopes(): string[] {
    const currentScope = this.scopeStack[this.scopeStack.length - 1]
    return [...currentScope.scopes]
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
