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
  /**
   * The words a `\b(one|two|three)\b` pattern accepts, when it is only that.
   *
   * Such a pattern is a set membership test written as a regular expression,
   * and the engine cannot know that: it walks the alternatives. CSS's selector
   * rule lists about sixty HTML tag names, and profiling the tokenizer over a
   * megabyte of CSS put 33ms of 45ms in the pattern loop inside that one rule -
   * 40,000 executions to produce 10,000 matches, the other 30,000 walking every
   * branch only to fail.
   *
   * With the words in a `Set`, the same question is a hash lookup over an
   * identifier the character table already knows how to read.
   */
  _words?: Set<string>
}

/**
 * The token class a TextMate scope names.
 *
 * Read from the front of the scope, not the back. This used to take the last
 * dot-separated part, which is where the convention puts the *language*: the
 * scope for `const` is `storage.type.ts`, so every keyword in TypeScript was
 * typed `ts`, every keyword in Rust `rust`, and `=` in Rust `rust` as well. A
 * consumer mapping types to colours got one bucket per language instead of one
 * per kind of token, and the sensible ones fell back to plain text.
 *
 * The classes are the ones a stylesheet can reasonably have a colour for, which
 * is also the set `FastTokenizer` emits, so the two tokenizers agree about what
 * a keyword is.
 */
export function classifyScope(scopeName: string): string {
  // Longest prefixes first: `keyword.operator` is an operator, not a keyword,
  // and `constant.numeric` is a number rather than a constant in general.
  if (scopeName.startsWith('keyword.operator'))
    return 'operator'
  if (scopeName.startsWith('constant.numeric'))
    return 'numeric'
  if (scopeName.startsWith('entity.name.function') || scopeName.startsWith('support.function'))
    return 'function'
  if (scopeName.startsWith('entity.name.tag'))
    return 'tag'
  if (scopeName.startsWith('entity.other.attribute-name'))
    return 'attribute'
  if (scopeName.startsWith('entity.name.type') || scopeName.startsWith('support.type') || scopeName.startsWith('storage.type.class'))
    return 'type'

  const root = scopeName.split('.')[0]
  switch (root) {
    case 'keyword':
    case 'storage':
      return 'keyword'
    case 'string':
      return 'string'
    case 'comment':
      return 'comment'
    case 'punctuation':
      return 'punctuation'
    case 'variable':
      return 'variable'
    case 'constant':
      return 'constant'
    case 'entity':
    case 'support':
      return 'type'
    default:
      return 'text'
  }
}

/** Closes a block comment. Held here so the state can name it and restore it. */
const BLOCK_COMMENT_END = '\\*/'

// Character type lookup tables for ultra-fast dispatch
/**
 * The characters a pattern can begin with, or null when that cannot be decided.
 *
 * The tokenizer used to try **every** pattern at **every** offset: twelve
 * regular expressions per character for CSS, each carrying a long alternation.
 * That is why `Tokenizer` ran at 4.4 MB/s on CSS and 69 on TypeScript - not a
 * backtracking pattern, as the roadmap guessed, but a linear scan over the
 * whole rule set repeated once per character. TypeScript escaped it because its
 * identifiers, numbers and whitespace are caught by the character fast paths
 * before the loop is reached; CSS spends most of its bytes on punctuation and
 * selectors, which fall straight through to it.
 *
 * So each pattern is asked, once, which characters it could possibly start
 * with, and at each offset only the patterns that claim the current character
 * are tried. **Null is the safe answer**: a pattern whose opening cannot be
 * read is tried at every position, exactly as before. Being wrong in the other
 * direction would silently stop matching something, which is a colour that
 * quietly disappears rather than a test that fails.
 *
 * Only the shapes these grammars actually use are decided - a literal, an
 * escaped literal, a character class, an alternation of any of those, with an
 * optional `\b` in front. Anything cleverer answers null.
 */
export function patternFirstChars(source: string): Set<number> | null {
  const found = new Set<number>()

  const readBranch = (branch: string): boolean => {
    let index = 0

    // A word boundary or an anchor consumes nothing, so the first character is
    // whatever follows it.
    while (branch.startsWith('\\b', index) || branch.startsWith('^', index))
      index += branch.startsWith('^', index) ? 1 : 2

    if (index >= branch.length)
      return false

    const character = branch[index]!

    if (character === '\\') {
      const escaped = branch[index + 1]

      if (!escaped)
        return false

      // A class escape covers too much to enumerate usefully, except the ones
      // that are worth it. `\d` is ten characters; `\w` and `\s` are answered
      // by the fast paths long before a pattern sees them.
      if (escaped === 'd') {
        for (let code = 48; code <= 57; code++)
          found.add(code)

        return true
      }

      if (/[a-zA-Z]/.test(escaped))
        return false

      found.add(escaped.charCodeAt(0))

      return true
    }

    if (character === '[') {
      const close = branch.indexOf(']', index + 1)

      if (close === -1)
        return false

      const body = branch.slice(index + 1, close)

      // A negated class is everything except a few characters, which is not a
      // set worth building.
      if (body.startsWith('^'))
        return false

      for (let cursor = 0; cursor < body.length; cursor++) {
        if (body[cursor] === '\\') {
          const escaped = body[cursor + 1]

          if (!escaped)
            return false

          if (/[a-zA-Z]/.test(escaped))
            return false

          found.add(escaped.charCodeAt(0))
          cursor++
          continue
        }

        // A range, `a-z`, is every code between its ends.
        if (body[cursor + 1] === '-' && body[cursor + 2] && body[cursor + 2] !== ']') {
          const from = body.charCodeAt(cursor)
          const to = body.charCodeAt(cursor + 2)

          if (to < from || to - from > 128)
            return false

          for (let code = from; code <= to; code++)
            found.add(code)

          cursor += 2
          continue
        }

        found.add(body.charCodeAt(cursor))
      }

      return true
    }

    // A group at the front is an alternation to walk into, but only when it is
    // the whole of what comes first.
    if (character === '(') {
      const close = matchingParen(branch, index)

      if (close === -1)
        return false

      let inner = branch.slice(index + 1, close)

      if (inner.startsWith('?:'))
        inner = inner.slice(2)
      else if (inner.startsWith('?'))
        return false

      return splitAlternatives(inner).every(readBranch)
    }

    // Anything with its own quantifier could match nothing and let the next
    // thing be first, which is more analysis than this is worth.
    if ('*?+{'.includes(branch[index + 1] ?? ''))
      return false

    if ('.$|)'.includes(character))
      return false

    found.add(character.charCodeAt(0))

    return true
  }

  const decided = splitAlternatives(source).every(readBranch)

  return decided && found.size > 0 ? found : null
}

/**
 * The word list of a `\b(one|two)\b` pattern, when that is all it is.
 *
 * Deliberately narrow. Every alternative has to be plain word characters, so
 * the set can be looked up against an identifier read with the character table
 * and mean exactly what `\b` meant. A hyphenated alternative - `font-family` -
 * disqualifies the whole pattern, because `\b` does not treat a hyphen as part
 * of a word and a set keyed on `font` would match the wrong thing.
 */
export function patternWordSet(source: string): Set<string> | null {
  const shape = /^\\b\(([^()]+)\)\\b$/.exec(source)

  if (!shape)
    return null

  const words = shape[1]!.split('|')

  if (words.length < 2)
    return null

  for (const word of words) {
    if (!/^\w+$/.test(word))
      return null
  }

  return new Set(words)
}

/** The index of the `)` closing the `(` at `from`, or -1. */
function matchingParen(source: string, from: number): number {
  let depth = 0

  for (let index = from; index < source.length; index++) {
    if (source[index] === '\\') {
      index++
      continue
    }

    if (source[index] === '(')
      depth++
    else if (source[index] === ')' && --depth === 0)
      return index
  }

  return -1
}

/** Top-level `|` branches, ignoring the ones inside groups or classes. */
function splitAlternatives(source: string): string[] {
  const branches: string[] = []
  let depth = 0
  let inClass = false
  let start = 0

  for (let index = 0; index < source.length; index++) {
    const character = source[index]

    if (character === '\\') {
      index++
      continue
    }

    if (inClass) {
      if (character === ']')
        inClass = false

      continue
    }

    if (character === '[')
      inClass = true
    else if (character === '(')
      depth++
    else if (character === ')')
      depth--
    else if (character === '|' && depth === 0) {
      branches.push(source.slice(start, index))
      start = index + 1
    }
  }

  branches.push(source.slice(start))

  return branches
}

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
  /**
   * For each byte, the root patterns that could start with it, in grammar order.
   *
   * Order is preserved because first match wins: a table that reordered them
   * would change which rule claims a character, which is a colour changing
   * rather than a speed changing. Built once, per rule set.
   */
  private rootByFirstChar: Array<CompiledPattern[]> | null = null
  /**
   * The repository's rules, compiled.
   *
   * They were not, and that is where CSS spends its time: an `include` looked
   * the rule up in the raw grammar and matched its children directly, so every
   * child fell back to the regex cache and none of them carried a word set or a
   * precompiled expression. Profiling a megabyte of CSS put 33ms of the 45ms in
   * the pattern loop inside `#selectors` alone - 40,000 executions of a
   * sixty-branch alternation to produce 10,000 matches.
   */
  private compiledRepository: Map<string, CompiledPattern[]> = new Map()
  /** Compiled pattern by its path in the grammar, e.g. `"3.1.0"`. */
  private patternsByPath: Map<string, CompiledPattern> = new Map()
  /** The same relation the other way, for writing a state out. */
  private pathsByPattern: Map<GrammarPattern, string> = new Map()
  private numberRegex: RegExp
  private isJsOrTs: boolean
  private useFastPaths: boolean
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
    this.rootByFirstChar = Tokenizer.tableFor(grammar, this.compiledPatterns)

    for (const [name, rule] of Object.entries(grammar.repository ?? {})) {
      const patterns = (rule as { patterns?: GrammarPattern[] }).patterns

      if (patterns)
        this.compiledRepository.set(name, this.precompilePatterns(patterns))
    }
    // Pre-compile number regex for fast path
    this.numberRegex = /^(0x[0-9a-f]+|0b[01]+|0o[0-7]+|\d+(\.\d+)?(e[+-]?\d+)?)/i
    // Check if this is JS/TS for safe fast paths
    this.isJsOrTs = grammar.scopeName === 'source.js' || grammar.scopeName === 'source.ts'
    // A markup grammar turns these off; see `Grammar.fastPaths`.
    this.useFastPaths = grammar.fastPaths !== false

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
          // Classified from the front of the scope, the same way every other
          // token is. Taking the last part named the language rather than the
          // kind, and this is the path every keyword goes through.
          this.keywordMap.set(word, { scopes, type: classifyScope(scopeName) })
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

    // Where the current run of unmatched characters began, if one is open.
    //
    // Unmatched characters used to be emitted one token each, which is an
    // object, a shape and - once packed for a worker - an entry in three typed
    // arrays, per character. On a language whose fast paths are off that is
    // most of a document: a line of README prose came out as forty tokens
    // carrying one letter each. Coalescing them costs nothing, because the
    // matching work per character is the same either way; only the token count
    // changes.
    let runStart: number | null = null

    const flushRun = (end: number): void => {
      if (runStart === null)
        return

      tokens.push({
        type: Tokenizer.TYPE_TEXT,
        content: line.slice(runStart, end),
        scopes: this.scopeStack[this.scopeStack.length - 1].scopes,
        line: lineNumber,
        offset: runStart,
      })
      runStart = null
    }

    while (offset < line.length) {
      const result = this.matchNextToken(line, offset, lineNumber)

      if (result) {
        // Closed before the matched token is pushed, so the tokens stay in the
        // order the line reads.
        flushRun(offset)

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
        // No match found. Opens a run rather than emitting a token, so a
        // stretch of ordinary text is one token instead of one per character.
        if (runStart === null)
          runStart = offset
        offset++
      }
    }

    flushRun(offset)

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

    // Ultra-fast character dispatch with pre-computed scopes - only at root
    // level, and only where the language's own syntax does not begin with the
    // characters these claim. See `Grammar.fastPaths`.
    if (currentScope.rule === null && !currentScope.raw && this.useFastPaths) {
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

    /*
     * Only the patterns that could begin with this character.
     *
     * The root set is the hot one - a line spends most of its offsets there -
     * and it is the one with a table. Inside a rule the candidate set is
     * already small, so it is walked whole rather than carrying a table per
     * rule for a saving that would not show.
     */
    const code = line.charCodeAt(offset)
    const patterns = currentScope.rule?.patterns
      ?? (this.rootByFirstChar !== null && code < 256 ? this.rootByFirstChar[code]! : this.compiledPatterns)

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
        compiled._words = patternWordSet(pattern.match) ?? undefined
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

        // Classified from the front of the scope. Inlined here once for the
        // function call, and then copied twice; all three took the last part,
        // which names the language rather than the kind of token.
        const type = pattern.name && typeof pattern.name === 'string'
          ? classifyScope(pattern.name)
          : Tokenizer.TYPE_TEXT

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

    /*
     * A word-set pattern, answered without the engine.
     *
     * Same semantics as the `\b(one|two)\b` it replaces: a word character
     * before this offset means `\b` does not hold here, and the word runs to
     * the next non-word character. Only the identifier is read - no
     * alternatives are walked - so a rule listing sixty tag names costs what a
     * rule listing two does.
     */
    if (compiled._words) {
      const before = offset > 0 ? line.charCodeAt(offset - 1) : 0

      if (offset > 0 && (CHAR_TYPE[before]! & (LETTER | DIGIT)))
        return null

      let end = offset

      while (end < line.length && (CHAR_TYPE[line.charCodeAt(end)]! & (LETTER | DIGIT)))
        end++

      if (end === offset)
        return null

      const word = line.slice(offset, end)

      if (!compiled._words.has(word))
        return null

      const scopes = pattern.name
        ? [...this.scopeStack[this.scopeStack.length - 1]!.scopes, pattern.name]
        : this.scopeStack[this.scopeStack.length - 1]!.scopes

      return {
        token: {
          type: pattern.name && typeof pattern.name === 'string' ? classifyScope(pattern.name) : Tokenizer.TYPE_TEXT,
          content: word,
          scopes,
          line: lineNumber,
          offset,
        },
        offset: end,
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

        // Classified from the front of the scope. Inlined here once for the
        // function call, and then copied twice; all three took the last part,
        // which names the language rather than the kind of token.
        const type = pattern.name && typeof pattern.name === 'string'
          ? classifyScope(pattern.name)
          : Tokenizer.TYPE_TEXT

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

      const type = capture && capture.name
        ? classifyScope(capture.name)
        : Tokenizer.TYPE_TEXT

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
      const compiled = this.compiledRepository.get(ruleName)
      const rule = this.grammar.repository?.[ruleName]

      if (compiled) {
        for (const pattern of compiled) {
          const result = this.matchPattern(pattern, line, offset, lineNumber)
          if (result)
            return result
        }

        return null
      }

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

    return classifyScope(scopeName)
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
  /**
   * The first-character table for a rule set.
   *
   * A pattern whose opening cannot be decided goes into every bucket, so the
   * table can only ever try *fewer* patterns than the old loop, never different
   * ones. 256 buckets covers ASCII; anything above it falls back to the whole
   * list, which is the right trade - a grammar keyed on ideographs would gain
   * nothing from a table of bytes.
   */
  /**
   * The characters a pattern - or anything nested inside it - can begin with.
   *
   * Most top-level entries in these grammars are **containers**: a name and a
   * list of children, with no `match` of their own. Reading only `match` and
   * `begin` therefore decided nothing for any grammar here, put every pattern
   * in every bucket, and made the table an exact copy of the loop it replaced
   * with an extra lookup in front. A container's set is the union of its
   * children's, and unknown anywhere means unknown for the whole thing.
   */
  private static startsOf(
    pattern: CompiledPattern,
    repository: Record<string, any> | undefined,
    seen = new Set<string>(),
  ): Set<number> | null {
    const source = pattern.match ?? pattern.begin

    if (source)
      return patternFirstChars(source)

    /*
     * An `include` is a reference into the grammar's repository, and it is what
     * nearly every top-level entry in these grammars is. Following it is the
     * difference between a table that decides something and one that puts every
     * pattern in every bucket - which is what the first version did, making it
     * the same loop with a lookup in front of it.
     *
     * `seen` guards a repository that refers to itself, directly or in a ring.
     * Without it a self-recursive rule is a stack overflow at construction.
     */
    const include = (pattern as { include?: string }).include

    if (include) {
      if (!include.startsWith('#') || !repository)
        return null

      const name = include.slice(1)

      if (seen.has(name))
        return null

      seen.add(name)

      const rule = repository[name]

      return rule ? Tokenizer.startsOf(rule as CompiledPattern, repository, seen) : null
    }

    const children = pattern.patterns as CompiledPattern[] | undefined

    if (!children || children.length === 0)
      return null

    const union = new Set<number>()

    for (const child of children) {
      const starts = Tokenizer.startsOf(child, repository, seen)

      if (!starts)
        return null

      for (const code of starts)
        union.add(code)
    }

    return union.size > 0 ? union : null
  }

  /**
   * The table for a grammar, built once per grammar rather than per tokenizer.
   *
   * Building it walks every pattern and every include, which is cheap beside
   * tokenizing a file and expensive beside tokenizing one line - and a
   * `Tokenizer` is constructed per file in some callers. Measured: charging
   * construction to every run cost TypeScript 23%, wiping out the gain the
   * table exists for. Keyed weakly on the grammar object, which is the thing
   * the table actually describes and is shared by every tokenizer over that
   * language.
   */
  private static tables = new WeakMap<object, Array<CompiledPattern[]>>()

  private static tableFor(grammar: Grammar, patterns: CompiledPattern[]): Array<CompiledPattern[]> {
    const held = Tokenizer.tables.get(grammar as unknown as object)

    if (held)
      return held

    const table = Tokenizer.dispatchTable(patterns, grammar.repository as Record<string, any> | undefined)
    Tokenizer.tables.set(grammar as unknown as object, table)

    return table
  }

  private static dispatchTable(patterns: CompiledPattern[], repository?: Record<string, any>): Array<CompiledPattern[]> {
    const table: Array<CompiledPattern[]> = Array.from({ length: 256 }, () => [])

    for (const pattern of patterns) {
      const starts = Tokenizer.startsOf(pattern, repository)

      if (!starts) {
        for (let code = 0; code < 256; code++)
          table[code]!.push(pattern)

        continue
      }

      for (const code of starts) {
        if (code < 256)
          table[code]!.push(pattern)
      }
    }

    return table
  }

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
