# Language Support Implementation Plan

This document outlines the plan to add support for additional languages to ts-syntax-highlighter.

## Implementation Process (Per Language)

For each language, follow these steps:

1. **Create Grammar File** in `packages/ts-syntax-highlighter/src/grammars/`
   - Define language metadata (name, scopeName, aliases, extensions)
   - Implement tokenization patterns (keywords, operators, literals, etc.)
   - Add keyword tables for performance optimization
   - Follow existing grammar structure from `javascript.ts`, `typescript.ts`, etc.

2. **Export Grammar** in `packages/ts-syntax-highlighter/src/grammars/index.ts`
   - Add language export and registration

3. **Create Test File** in `packages/ts-syntax-highlighter/test/`
   - Follow naming convention: `{language}.test.ts`
   - Test basic tokenization
   - Test language-specific features (syntax, keywords, literals)
   - Test edge cases
   - Aim for comprehensive coverage like existing tests

4. **Update Documentation**
   - Add language to README.md supported languages list
   - Update API documentation if needed

## Priority 🔥 Critical (Highest Impact)

### 1. Bash/Shell
- **Aliases**: `bash`, `sh`, `shell`, `zsh`, `console`
- **Usage Count**: 591
- **File**: `packages/ts-syntax-highlighter/src/grammars/bash.ts`
- **Test**: `packages/ts-syntax-highlighter/test/bash.test.ts`
- **Features to support**:
  - Variables ($VAR, ${VAR})
  - Command substitution $(command), `command`
  - Pipes and redirections
  - String quoting (single, double, escaped)
  - Comments
  - Built-in commands
  - Control structures (if, for, while, case)
  - Functions

### 2. Markdown
- **Aliases**: `markdown`, `md`
- **Usage Count**: 518
- **File**: `packages/ts-syntax-highlighter/src/grammars/markdown.ts`
- **Test**: `packages/ts-syntax-highlighter/test/markdown.test.ts`
- **Features to support**:
  - Headings (# ## ###)
  - Bold, italic, strikethrough
  - Links and images
  - Code blocks (with language detection)
  - Inline code
  - Lists (ordered, unordered)
  - Blockquotes
  - Tables
  - Horizontal rules

## Priority ⚡ High

### 3. YAML
- **Aliases**: `yaml`, `yml`
- **Usage Count**: 41
- **File**: `packages/ts-syntax-highlighter/src/grammars/yaml.ts`
- **Test**: `packages/ts-syntax-highlighter/test/yaml.test.ts`
- **Features to support**:
  - Keys and values
  - Nested structures (indentation)
  - Arrays and lists
  - Comments
  - Multiline strings (|, >)
  - Anchors and references (&, *)
  - Boolean, null, numbers

### 4. JSONC
- **Aliases**: `jsonc`
- **Usage Count**: 13
- **File**: `packages/ts-syntax-highlighter/src/grammars/jsonc.ts`
- **Test**: `packages/ts-syntax-highlighter/test/jsonc.test.ts`
- **Features to support**:
  - All JSON features
  - Single-line comments (//)
  - Multi-line comments (/* */)
  - Trailing commas (allowed)

### 5. Diff
- **Aliases**: `diff`, `patch`
- **Usage Count**: 6
- **File**: `packages/ts-syntax-highlighter/src/grammars/diff.ts`
- **Test**: `packages/ts-syntax-highlighter/test/diff.test.ts`
- **Features to support**:
  - File headers (---, +++)
  - Hunk headers (@@ @@)
  - Added lines (+)
  - Removed lines (-)
  - Context lines
  - Line numbers

### 6. PHP
- **Aliases**: `php`
- **Use Case**: Web development
- **File**: `packages/ts-syntax-highlighter/src/grammars/php.ts`
- **Test**: `packages/ts-syntax-highlighter/test/php.test.ts`
- **Features to support**:
  - PHP tags (<?php, ?>)
  - Variables ($variable)
  - Functions and classes
  - Namespaces
  - String interpolation
  - HTML embedding
  - Comments (// /* */ #)
  - Keywords and control structures

### 7. Java
- **Aliases**: `java`
- **Use Case**: Enterprise apps
- **File**: `packages/ts-syntax-highlighter/src/grammars/java.ts`
- **Test**: `packages/ts-syntax-highlighter/test/java.test.ts`
- **Features to support**:
  - Package declarations
  - Imports
  - Classes, interfaces, enums
  - Annotations (@Override, etc.)
  - Generics
  - Keywords and modifiers
  - String literals
  - Comments (// /* */ /** */)

### 8. C
- **Aliases**: `c`, `h`
- **Use Case**: System programming
- **File**: `packages/ts-syntax-highlighter/src/grammars/c.ts`
- **Test**: `packages/ts-syntax-highlighter/test/c.test.ts`
- **Features to support**:
  - Preprocessor directives (#include, #define, etc.)
  - Function definitions
  - Pointers and operators
  - Data types
  - String and character literals
  - Comments (// /* */)
  - Keywords

### 9. C++
- **Aliases**: `cpp`, `cc`, `cxx`, `hpp`
- **Use Case**: System programming
- **File**: `packages/ts-syntax-highlighter/src/grammars/cpp.ts`
- **Test**: `packages/ts-syntax-highlighter/test/cpp.test.ts`
- **Features to support**:
  - All C features
  - Classes and objects
  - Templates
  - Namespaces
  - Operator overloading
  - Lambda expressions
  - Smart pointers
  - Modern C++ keywords (auto, constexpr, etc.)

### 10. Rust
- **Aliases**: `rust`, `rs`
- **Use Case**: System programming
- **File**: `packages/ts-syntax-highlighter/src/grammars/rust.ts`
- **Test**: `packages/ts-syntax-highlighter/test/rust.test.ts`
- **Features to support**:
  - Ownership keywords (mut, ref, move)
  - Traits and implementations
  - Macros (macro!, macro_rules!)
  - Lifetimes ('a, 'static)
  - Pattern matching
  - String literals (raw strings r#""#)
  - Attributes (#[derive], etc.)
  - Comments (// /* */ ///)

### 11. C#
- **Aliases**: `csharp`, `cs`
- **Use Case**: .NET development
- **File**: `packages/ts-syntax-highlighter/src/grammars/csharp.ts`
- **Test**: `packages/ts-syntax-highlighter/test/csharp.test.ts`
- **Features to support**:
  - Namespaces and using directives
  - Classes, interfaces, structs
  - Properties and events
  - LINQ queries
  - Attributes ([Attribute])
  - String interpolation ($"")
  - Async/await
  - Nullable types (?)

### 12. Dockerfile
- **Aliases**: `dockerfile`, `docker`
- **Use Case**: Containers
- **File**: `packages/ts-syntax-highlighter/src/grammars/dockerfile.ts`
- **Test**: `packages/ts-syntax-highlighter/test/dockerfile.test.ts`
- **Features to support**:
  - Instructions (FROM, RUN, COPY, etc.)
  - Comments
  - Environment variables
  - Multi-stage builds
  - Shell commands
  - JSON array syntax

## Priority 🔸 Medium

### 13. IDL
- **Aliases**: `idl`
- **Usage Count**: 18
- **File**: `packages/ts-syntax-highlighter/src/grammars/idl.ts`
- **Test**: `packages/ts-syntax-highlighter/test/idl.test.ts`
- **Features to support**:
  - Interface definitions
  - Type declarations
  - Comments
  - Attributes
  - Keywords

### 14. Text/Plain
- **Aliases**: `text`, `txt`, `plain`
- **Usage Count**: 26
- **File**: `packages/ts-syntax-highlighter/src/grammars/text.ts`
- **Test**: `packages/ts-syntax-highlighter/test/text.test.ts`
- **Features to support**:
  - Plain text (no special syntax)
  - Minimal or no tokenization

### 15. Python
- **Aliases**: `python`, `py`
- **Usage Count**: 8
- **File**: `packages/ts-syntax-highlighter/src/grammars/python.ts`
- **Test**: `packages/ts-syntax-highlighter/test/python.test.ts`
- **Features to support**:
  - Indentation-based blocks
  - Functions and classes
  - Decorators (@decorator)
  - String literals (single, double, triple-quoted, f-strings)
  - Comments
  - Keywords and built-ins
  - Type hints
  - List/dict comprehensions

### 16. Ruby
- **Aliases**: `ruby`, `rb`
- **Usage Count**: 9
- **File**: `packages/ts-syntax-highlighter/src/grammars/ruby.ts`
- **Test**: `packages/ts-syntax-highlighter/test/ruby.test.ts`
- **Features to support**:
  - Classes and modules
  - Symbols (:symbol)
  - String interpolation #{}
  - Blocks (do...end, {})
  - Regular expressions
  - Comments
  - Keywords and methods

### 17. JSON5
- **Aliases**: `json5`
- **Usage Count**: 7
- **File**: `packages/ts-syntax-highlighter/src/grammars/json5.ts`
- **Test**: `packages/ts-syntax-highlighter/test/json5.test.ts`
- **Features to support**:
  - All JSONC features
  - Unquoted keys
  - Single-quoted strings
  - Trailing commas
  - Hexadecimal numbers
  - Infinity, NaN

### 18. Vue
- **Aliases**: `vue`
- **Usage Count**: 7
- **File**: `packages/ts-syntax-highlighter/src/grammars/vue.ts`
- **Test**: `packages/ts-syntax-highlighter/test/vue.test.ts`
- **Features to support**:
  - Template section with HTML
  - Script section with JavaScript/TypeScript
  - Style section with CSS/SCSS
  - Vue directives (v-if, v-for, etc.)
  - Mustache syntax {{ }}
  - Component props and events

### 19. Go
- **Aliases**: `go`
- **Usage Count**: 2
- **File**: `packages/ts-syntax-highlighter/src/grammars/go.ts`
- **Test**: `packages/ts-syntax-highlighter/test/go.test.ts`
- **Features to support**:
  - Package and imports
  - Functions and methods
  - Interfaces and structs
  - Goroutines and channels
  - Defer, panic, recover
  - String literals (raw strings ``)
  - Comments

### 20. SQL
- **Aliases**: `sql`
- **Usage Count**: 2
- **File**: `packages/ts-syntax-highlighter/src/grammars/sql.ts`
- **Test**: `packages/ts-syntax-highlighter/test/sql.test.ts`
- **Features to support**:
  - SELECT, INSERT, UPDATE, DELETE
  - CREATE, ALTER, DROP
  - Joins and subqueries
  - Functions and aggregates
  - String literals
  - Comments (-- /* */)
  - Keywords (case-insensitive)

### 21. TOML
- **Aliases**: `toml`
- **Usage Count**: 2
- **File**: `packages/ts-syntax-highlighter/src/grammars/toml.ts`
- **Test**: `packages/ts-syntax-highlighter/test/toml.test.ts`
- **Features to support**:
  - Key-value pairs
  - Tables [table]
  - Arrays of tables [[table]]
  - Data types (string, integer, float, boolean, datetime, array)
  - Comments
  - Inline tables

### 22. SCSS/Sass
- **Aliases**: `scss`, `sass`
- **Usage Count**: 1
- **File**: `packages/ts-syntax-highlighter/src/grammars/scss.ts`
- **Test**: `packages/ts-syntax-highlighter/test/scss.test.ts`
- **Features to support**:
  - All CSS features
  - Variables ($variable)
  - Nesting
  - Mixins (@mixin, @include)
  - Functions
  - Imports (@import, @use)
  - Conditionals (@if, @else)
  - Loops (@for, @each, @while)

### 23. Kotlin
- **Aliases**: `kotlin`, `kt`
- **Use Case**: Android development
- **File**: `packages/ts-syntax-highlighter/src/grammars/kotlin.ts`
- **Test**: `packages/ts-syntax-highlighter/test/kotlin.test.ts`
- **Features to support**:
  - Package and imports
  - Classes, objects, data classes
  - Nullable types (?)
  - String templates ($variable, ${expression})
  - Lambda expressions
  - Extension functions
  - Coroutines (suspend, async)
  - Annotations

### 24. Swift
- **Aliases**: `swift`
- **Use Case**: iOS development
- **File**: `packages/ts-syntax-highlighter/src/grammars/swift.ts`
- **Test**: `packages/ts-syntax-highlighter/test/swift.test.ts`
- **Features to support**:
  - Imports and modules
  - Classes, structs, protocols
  - Optionals (?, !)
  - String interpolation \()
  - Closures
  - Guard, defer
  - Property wrappers (@Published, etc.)
  - Attributes

### 25. Dart
- **Aliases**: `dart`
- **Use Case**: Flutter apps
- **File**: `packages/ts-syntax-highlighter/src/grammars/dart.ts`
- **Test**: `packages/ts-syntax-highlighter/test/dart.test.ts`
- **Features to support**:
  - Imports and libraries
  - Classes and mixins
  - Async/await, Futures
  - String interpolation $variable, ${expression}
  - Cascade notation (..)
  - Null safety (?, !, late)
  - Annotations (@override, etc.)

### 26. R
- **Aliases**: `r`
- **Use Case**: Data science
- **File**: `packages/ts-syntax-highlighter/src/grammars/r.ts`
- **Test**: `packages/ts-syntax-highlighter/test/r.test.ts`
- **Features to support**:
  - Functions
  - Assignment operators (<-, =, ->, <<-)
  - Vectors and lists
  - Data frames
  - Pipe operator (%>%, |>)
  - Comments
  - String literals

### 27. GraphQL
- **Aliases**: `graphql`, `gql`
- **Use Case**: API queries
- **File**: `packages/ts-syntax-highlighter/src/grammars/graphql.ts`
- **Test**: `packages/ts-syntax-highlighter/test/graphql.test.ts`
- **Features to support**:
  - Query, mutation, subscription
  - Type definitions
  - Fragments
  - Variables
  - Directives (@include, @skip)
  - Comments
  - Scalars and custom types

### 28. PowerShell
- **Aliases**: `powershell`, `ps1`
- **Use Case**: Windows automation
- **File**: `packages/ts-syntax-highlighter/src/grammars/powershell.ts`
- **Test**: `packages/ts-syntax-highlighter/test/powershell.test.ts`
- **Features to support**:
  - Cmdlets (Verb-Noun)
  - Variables ($variable)
  - Parameters (-Parameter)
  - Pipeline (|)
  - String interpolation
  - Comments
  - Operators
  - Script blocks {}

### 29. Makefile
- **Aliases**: `makefile`, `make`
- **Use Case**: Build systems
- **File**: `packages/ts-syntax-highlighter/src/grammars/makefile.ts`
- **Test**: `packages/ts-syntax-highlighter/test/makefile.test.ts`
- **Features to support**:
  - Targets and dependencies
  - Variables ($(VAR), ${VAR})
  - Commands (indented with tabs)
  - Comments
  - Directives (.PHONY, etc.)
  - Functions

### 30. Terraform
- **Aliases**: `terraform`, `tf`, `hcl`
- **Use Case**: Infrastructure
- **File**: `packages/ts-syntax-highlighter/src/grammars/terraform.ts`
- **Test**: `packages/ts-syntax-highlighter/test/terraform.test.ts`
- **Features to support**:
  - Resource blocks
  - Variables and locals
  - Outputs
  - String interpolation ${}
  - Heredoc syntax (<<EOF)
  - Comments
  - Functions

## Priority 🔹 Low

### 31. BNF
- **Aliases**: `bnf`
- **Usage Count**: 7
- **File**: `packages/ts-syntax-highlighter/src/grammars/bnf.ts`
- **Test**: `packages/ts-syntax-highlighter/test/bnf.test.ts`
- **Features to support**:
  - Non-terminals <name>
  - Productions ::=
  - Terminals
  - Alternatives |
  - Optional elements []
  - Repetition {}

### 32. RegExp
- **Aliases**: `regexp`, `regex`
- **Usage Count**: 5
- **File**: `packages/ts-syntax-highlighter/src/grammars/regexp.ts`
- **Test**: `packages/ts-syntax-highlighter/test/regexp.test.ts`
- **Features to support**:
  - Character classes []
  - Groups ()
  - Quantifiers (*, +, ?, {n,m})
  - Anchors (^, $)
  - Escape sequences
  - Flags

### 33. Lua
- **Aliases**: `lua`
- **Usage Count**: 4
- **File**: `packages/ts-syntax-highlighter/src/grammars/lua.ts`
- **Test**: `packages/ts-syntax-highlighter/test/lua.test.ts`
- **Features to support**:
  - Functions
  - Tables {}
  - String literals (single, double, [[long]])
  - Comments (-- --[[ ]])
  - Keywords (local, function, end, etc.)
  - Operators

### 34. CMD/Batch
- **Aliases**: `cmd`, `batch`
- **Usage Count**: 4
- **File**: `packages/ts-syntax-highlighter/src/grammars/cmd.ts`
- **Test**: `packages/ts-syntax-highlighter/test/cmd.test.ts`
- **Features to support**:
  - Commands
  - Variables (%VAR%, !VAR!)
  - Labels :label
  - Comments (REM, ::)
  - Control flow (IF, FOR, GOTO)
  - Echo and redirection

### 35. ABNF
- **Aliases**: `abnf`
- **Usage Count**: 1
- **File**: `packages/ts-syntax-highlighter/src/grammars/abnf.ts`
- **Test**: `packages/ts-syntax-highlighter/test/abnf.test.ts`
- **Features to support**:
  - Rule definitions
  - Alternatives /
  - Concatenation
  - Repetition
  - Optional elements []
  - Comments

### 36. CSV
- **Aliases**: `csv`
- **Usage Count**: 1
- **File**: `packages/ts-syntax-highlighter/src/grammars/csv.ts`
- **Test**: `packages/ts-syntax-highlighter/test/csv.test.ts`
- **Features to support**:
  - Comma-separated values
  - Quoted fields
  - Escaped quotes
  - Headers (optional highlighting)

### 37. Log
- **Aliases**: `log`
- **Usage Count**: 1
- **File**: `packages/ts-syntax-highlighter/src/grammars/log.ts`
- **Test**: `packages/ts-syntax-highlighter/test/log.test.ts`
- **Features to support**:
  - Timestamps
  - Log levels (INFO, WARN, ERROR, DEBUG)
  - Stack traces
  - IP addresses
  - URLs
  - File paths

### 38. Nginx
- **Aliases**: `nginx`, `nginxconf`
- **Use Case**: Web servers
- **File**: `packages/ts-syntax-highlighter/src/grammars/nginx.ts`
- **Test**: `packages/ts-syntax-highlighter/test/nginx.test.ts`
- **Features to support**:
  - Directives
  - Blocks (server, location, etc.)
  - Variables ($variable)
  - Comments
  - String literals
  - Regular expressions

### 39. XML
- **Aliases**: `xml`
- **Use Case**: Data interchange
- **File**: `packages/ts-syntax-highlighter/src/grammars/xml.ts`
- **Test**: `packages/ts-syntax-highlighter/test/xml.test.ts`
- **Features to support**:
  - Tags and elements
  - Attributes
  - CDATA sections
  - Comments
  - DOCTYPE declarations
  - Entities
  - Namespaces

### 40. Protobuf
- **Aliases**: `protobuf`, `proto`
- **Use Case**: API definitions
- **File**: `packages/ts-syntax-highlighter/src/grammars/protobuf.ts`
- **Test**: `packages/ts-syntax-highlighter/test/protobuf.test.ts`
- **Features to support**:
  - Message definitions
  - Field types and numbers
  - Enums
  - Services and RPCs
  - Options
  - Comments
  - Imports

### 41. Solidity
- **Aliases**: `solidity`, `sol`
- **Use Case**: Smart contracts
- **File**: `packages/ts-syntax-highlighter/src/grammars/solidity.ts`
- **Test**: `packages/ts-syntax-highlighter/test/solidity.test.ts`
- **Features to support**:
  - Pragma directives
  - Contracts and interfaces
  - Functions and modifiers
  - Events
  - State variables
  - Special types (address, mapping, etc.)
  - Comments

### 42. LaTeX
- **Aliases**: `latex`, `tex`
- **Use Case**: Document typesetting
- **File**: `packages/ts-syntax-highlighter/src/grammars/latex.ts`
- **Test**: `packages/ts-syntax-highlighter/test/latex.test.ts`
- **Features to support**:
  - Commands \command
  - Environments \begin{} \end{}
  - Math mode $ $, $$ $$
  - Comments %
  - Special characters
  - Packages and includes

## Testing Template

Each test file should follow this structure (based on existing tests):

```typescript
import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('{Language} Grammar', () => {
  const tokenizer = new Tokenizer('{language}')

  describe('Basic Tokenization', () => {
    it('should tokenize basic {language} code', async () => {
      const code = `{sample code}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('{Feature} Support', () => {
    it('should highlight {specific feature}', async () => {
      const code = `{feature example}`
      const tokens = await tokenizer.tokenizeAsync(code)

      // Test specific token types
      const {tokenType}Tokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('{scope}'))

      expect({tokenType}Tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle {edge case}', async () => {
      const code = `{edge case example}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })
})
```

## Progress Tracking

- [ ] Total Languages: 42
- [ ] 🔥 Critical Priority: 2 languages
- [ ] ⚡ High Priority: 10 languages
- [ ] 🔸 Medium Priority: 21 languages
- [ ] 🔹 Low Priority: 9 languages

## Notes

- Each language implementation should follow the existing patterns in `src/grammars/javascript.ts` and `src/grammars/typescript.ts`
- Keyword tables should be used for performance optimization
- Grammar patterns should be ordered by frequency for optimal performance
- Tests should achieve high coverage similar to existing language tests
- All language metadata (aliases, extensions) should be properly registered in `src/grammars/index.ts`
