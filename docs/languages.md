# Language Support

We support **48 languages** out of the box, each with comprehensive grammar definitions and battle-tested tokenization. Whether you're building a code editor, documentation site, or developer tool, we've got the languages you need.

## 🌐 Web & Frontend (10 Languages)

### JavaScript / JSX
**Aliases**: `js`, `jsx`, `javascript`
**Extensions**: `.js`, `.jsx`, `.mjs`, `.cjs`

Everything you love about modern JavaScript:
- **ES2024+ Features**: BigInt (`123n`), numeric separators (`1_000_000`), optional chaining (`obj?.prop`)
- **Async/Await**: Full support for promises and async functions
- **Template Literals**: Including tagged templates and embedded expressions
- **JSX**: Complete React JSX support with components, props, and fragments
- **Regex**: Modern regex with flags and named groups

```javascript
// We understand all of this
const data = await fetch(url)?.json() ?? []
const big = 1_000_000n
const Component = () => <div>{data.map(x => <Item key={x.id} {...x} />)}</div>
```

### TypeScript / TSX
**Aliases**: `ts`, `tsx`, `typescript`
**Extensions**: `.ts`, `.tsx`, `.mts`, `.cts`

Full TypeScript support with all the type goodness:
- **Type Annotations**: Interfaces, types, generics, utility types
- **Advanced Types**: Union types, intersection types, conditional types
- **Decorators**: Class and method decorators
- **TSX**: TypeScript + JSX = developer happiness
- **Modern Syntax**: Everything from JavaScript plus type safety

```typescript
interface User<T extends string = string> {
  id: number
  name: T
  email?: string
}

const Component: React.FC<User> = ({ name }) => <div>{name}</div>
```

### HTML
**Aliases**: `html`, `htm`
**Extensions**: `.html`, `.htm`

Complete HTML5 support:
- **Tags & Attributes**: All HTML5 elements and attributes
- **ARIA**: Full accessibility attribute support
- **Data Attributes**: `data-*` attributes
- **Embedded Scripts**: Recognizes `<script>` and `<style>` blocks
- **Entities**: HTML entities like `&nbsp;`, `&lt;`, etc.

### CSS
**Aliases**: `css`
**Extensions**: `.css`

Modern CSS with all the latest features:
- **CSS4 Colors**: `rgb()`, `hsl()`, `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`
- **Container Queries**: `@container` with size and style queries
- **CSS Layers**: `@layer` for cascade control
- **Math Functions**: `calc()`, `min()`, `max()`, `clamp()`
- **Custom Properties**: CSS variables with fallbacks
- **Nesting**: Native CSS nesting support

```css
@layer base, components, utilities;

@layer components {
  .button {
    background: oklch(0.7 0.2 200);
    padding: clamp(0.5rem, 2vw, 1rem);

    @container (min-width: 400px) {
      padding: 1rem 2rem;
    }
  }
}
```

### SCSS / Sass
**Aliases**: `scss`, `sass`
**Extensions**: `.scss`, `.sass`

Full Sass/SCSS support:
- **Variables**: `$primary-color: #333` with full scope tracking
- **Nesting**: Deep nesting with parent selectors (`&`)
- **Mixins**: `@mixin` and `@include` with parameters
- **Functions**: Built-in and custom functions
- **Imports**: `@import` and `@use` / `@forward`

### JSON / JSONC / JSON5
**Aliases**: `json`, `jsonc`, `json5`
**Extensions**: `.json`, `.jsonc`, `.json5`

Smart JSON parsing:
- **JSON**: Strict RFC 8259 compliance
- **JSONC**: JSON with comments (VS Code style)
- **JSON5**: Extended JSON with trailing commas, unquoted keys, more

### XML
**Aliases**: `xml`
**Extensions**: `.xml`, `.svg`, `.plist`

Full XML support:
- Tags, attributes, CDATA, processing instructions
- Namespaces and qualified names
- Well-formed document structure

### Vue
**Aliases**: `vue`
**Extensions**: `.vue`

Vue single-file components:
- `<template>`, `<script>`, `<style>` blocks
- Vue-specific directives
- Scoped styles

---

## 🔧 Systems & DevOps (7 Languages)

### Bash / Shell
**Aliases**: `bash`, `sh`, `shell`, `zsh`
**Extensions**: `.sh`, `.bash`, `.zsh`

Complete shell scripting support:
- **Variables**: `$VAR`, `${VAR}`, `$1`, `$@`, `$#`, `$?`
- **Control Flow**: `if/then/else`, `for`, `while`, `case`
- **Functions**: Function definitions and calls
- **Pipes & Redirection**: `|`, `>`, `>>`, `<`, `2>&1`
- **Command Substitution**: `$(command)` and backticks
- **Heredocs**: `<<EOF` syntax

```bash
#!/bin/bash
for file in *.txt; do
  if [[ -f "$file" ]]; then
    cat "$file" | grep "pattern" > "${file%.txt}.log"
  fi
done
```

### PowerShell
**Aliases**: `powershell`, `ps1`
**Extensions**: `.ps1`, `.psm1`, `.psd1`

Windows automation:
- **Cmdlets**: `Get-Process`, `Set-Location`, etc.
- **Variables**: `$variable`, `$_`, automatic variables
- **Pipelines**: Object-based pipelines
- **Script Blocks**: `{ }` with parameters

### Dockerfile
**Aliases**: `dockerfile`, `docker`
**Extensions**: `Dockerfile`, `.dockerfile`

Container definitions:
- **Instructions**: `FROM`, `RUN`, `COPY`, `CMD`, `ENTRYPOINT`, etc.
- **Variables**: `$VAR`, `${VAR}` with defaults
- **Multi-stage**: `FROM ... AS builder` patterns
- **Comments**: `#` comments

### YAML
**Aliases**: `yaml`, `yml`
**Extensions**: `.yaml`, `.yml`

Configuration files:
- **Keys & Values**: Mappings and scalars
- **Arrays**: Sequences and lists
- **Anchors**: `&anchor` and `*reference`
- **Multi-line**: `|` and `>` for long strings
- **Comments**: `#` comments

### TOML
**Aliases**: `toml`
**Extensions**: `.toml`

Modern config format:
- Tables, arrays, inline tables
- Dates and times
- Multi-line strings

### Makefile
**Aliases**: `makefile`, `make`
**Extensions**: `Makefile`, `.mk`

Build automation:
- Targets, dependencies, recipes
- Variables and functions
- Pattern rules

### CMD / Batch
**Aliases**: `cmd`, `bat`, `batch`
**Extensions**: `.cmd`, `.bat`

Windows batch files:
- Commands, labels, goto
- Environment variables
- Control flow

---

## 💻 Programming Languages (20 Languages)

### Python
**Aliases**: `python`, `py`
**Extensions**: `.py`, `.pyw`

Modern Python:
- **Functions & Classes**: With decorators
- **F-Strings**: `f"Hello {name}"`
- **Type Hints**: `def func(x: int) -> str:`
- **Async/Await**: Full async support
- **Comprehensions**: List, dict, set comprehensions

### Java
**Aliases**: `java`
**Extensions**: `.java`

Enterprise Java:
- Classes, interfaces, annotations
- Generics and wildcards
- Lambda expressions
- Modules (Java 9+)

### C
**Aliases**: `c`
**Extensions**: `.c`, `.h`

Systems programming:
- **Preprocessor**: `#include`, `#define`, `#ifdef`, `#elif`, `#endif`
- **Functions**: Function definitions and declarations
- **Pointers**: Pointer syntax and dereferencing
- **Types**: All C types including `struct`, `union`, `enum`

### C++
**Aliases**: `cpp`, `c++`, `cxx`
**Extensions**: `.cpp`, `.cc`, `.cxx`, `.hpp`, `.hh`

Modern C++:
- Templates and concepts
- Namespaces
- RAII and smart pointers
- Lambda expressions
- Range-based for loops

### C#
**Aliases**: `csharp`, `cs`
**Extensions**: `.cs`

.NET development:
- **LINQ**: Query expressions
- **Async/Await**: Task-based async
- **Properties**: Auto-properties and getters/setters
- **Attributes**: `[Attribute]` syntax
- **Nullable**: `string?` nullable reference types

### Go
**Aliases**: `go`, `golang`
**Extensions**: `.go`

Cloud-native language:
- Goroutines and channels
- Interfaces and structs
- Defer, panic, recover
- Modules and packages

### Rust
**Aliases**: `rust`, `rs`
**Extensions**: `.rs`

Memory-safe systems:
- **Ownership**: Borrow checker friendly
- **Lifetimes**: `'a`, `'static`
- **Macros**: `println!()`, `vec![]`
- **Traits**: Trait definitions and impls
- **Pattern Matching**: Exhaustive matches

### Swift
**Aliases**: `swift`
**Extensions**: `.swift`

iOS/macOS development:
- Optionals and unwrapping
- Protocols and extensions
- Closures
- Generics

### Kotlin
**Aliases**: `kotlin`, `kt`
**Extensions**: `.kt`, `.kts`

Modern JVM:
- Null safety
- Data classes
- Coroutines
- Extension functions

### Dart
**Aliases**: `dart`
**Extensions**: `.dart`

Flutter development:
- Async/await
- Streams and futures
- Null safety
- Cascades (`..`)

### PHP
**Aliases**: `php`
**Extensions**: `.php`

Web development:
- **Tags**: `<?php` and `?>`
- **Classes**: OOP with namespaces
- **Variables**: `$variable` syntax
- **Functions**: Built-in and user-defined
- **Traits**: PHP traits

### Ruby
**Aliases**: `ruby`, `rb`
**Extensions**: `.rb`

Elegant scripting:
- Blocks and procs
- Symbols
- Metaprogramming
- Gems and requires

### R
**Aliases**: `r`
**Extensions**: `.r`, `.R`

Statistical computing:
- Data frames and vectors
- Functions and packages
- Operators
- Comments

### Solidity
**Aliases**: `solidity`, `sol`
**Extensions**: `.sol`

Smart contracts:
- Contract definitions
- Events and modifiers
- State variables
- Functions (pure, view, payable)

### Lua
**Aliases**: `lua`
**Extensions**: `.lua`

Lightweight scripting:
- Tables and metatables
- Functions and closures
- Coroutines
- Local/global scope

### GraphQL
**Aliases**: `graphql`, `gql`
**Extensions**: `.graphql`, `.gql`

API schemas:
- Type definitions
- Queries and mutations
- Fragments
- Directives

### IDL
**Aliases**: `idl`
**Extensions**: `.idl`

Interface definitions:
- Interface declarations
- Type definitions
- Attributes and operations

### Protobuf
**Aliases**: `protobuf`, `proto`
**Extensions**: `.proto`

Protocol buffers:
- Message definitions
- Services and RPCs
- Field options
- Syntax versions

### LaTeX
**Aliases**: `latex`, `tex`
**Extensions**: `.tex`, `.latex`

Document preparation:
- Commands and environments
- Math mode
- Citations
- Packages

---

## 📊 Data & Configuration (11 Languages)

### SQL
**Aliases**: `sql`
**Extensions**: `.sql`

Database queries:
- SELECT, INSERT, UPDATE, DELETE
- JOINs and subqueries
- Functions and aggregates
- DDL statements

### Markdown
**Aliases**: `markdown`, `md`
**Extensions**: `.md`, `.markdown`

Documentation:
- Headers, lists, links
- Code blocks (fenced and indented)
- Emphasis (bold, italic)
- Tables and task lists

### Diff
**Aliases**: `diff`, `patch`
**Extensions**: `.diff`, `.patch`

Version control:
- Unified diff format
- Context lines
- File headers
- Line changes (+/-)

### Terraform
**Aliases**: `terraform`, `tf`, `hcl`
**Extensions**: `.tf`, `.tfvars`

Infrastructure as code:
- Resource definitions
- Variables and outputs
- Modules
- Providers

### Nginx
**Aliases**: `nginx`, `nginxconf`
**Extensions**: `.conf`

Web server config:
- Server blocks
- Location directives
- Upstream definitions
- Variables

### CSV
**Aliases**: `csv`
**Extensions**: `.csv`

Comma-separated values:
- Headers and rows
- Quoted fields
- Escaping

### RegExp
**Aliases**: `regex`, `regexp`
**Extensions**: N/A

Regular expressions:
- Character classes
- Quantifiers
- Groups and captures
- Anchors and assertions

### BNF
**Aliases**: `bnf`
**Extensions**: `.bnf`

Grammar notation:
- Production rules
- Terminals and non-terminals
- Alternatives

### ABNF
**Aliases**: `abnf`
**Extensions**: `.abnf`

Augmented BNF:
- RFC-style grammars
- Repetition operators
- Value ranges

### Log
**Aliases**: `log`
**Extensions**: `.log`

Log files:
- Timestamps
- Log levels (INFO, ERROR, etc.)
- Messages and stack traces

### Text
**Aliases**: `text`, `txt`, `plain`
**Extensions**: `.txt`

Plain text:
- No special highlighting
- Useful as a fallback

---

## 🎯 Usage

All languages work the same way - just import the grammar you need:

```typescript
import { Tokenizer } from 'ts-syntax-highlighter'
import { rustGrammar } from 'ts-syntax-highlighter/grammars'

const tokenizer = new Tokenizer(rustGrammar)
const tokens = tokenizer.tokenize(`
fn main() {
    let x = vec![1, 2, 3];
    println!("{:?}", x);
}
`)
```

## 🔍 Finding the Right Language

Not sure which grammar to use? Here's a quick reference:

- **Web development?** → JavaScript, TypeScript, HTML, CSS, Vue
- **Backend services?** → Python, Java, Go, Rust, C#, PHP
- **System scripts?** → Bash, PowerShell, Makefile
- **Config files?** → YAML, TOML, JSON, Nginx
- **Documentation?** → Markdown, LaTeX
- **Data processing?** → SQL, CSV, R
- **Infrastructure?** → Terraform, Dockerfile, Kubernetes (YAML)

## 💡 Tips & Tricks

**Consistent API** - Every language uses the same `Tokenizer` interface. Learn it once, use it everywhere.

**Language Detection** - We include language aliases and file extensions. Use whatever makes sense for your use case.

**Extensible** - Need a custom language? You can define your own grammar using the same TextMate format we use internally.

**Performance** - All 48 languages use the same optimized tokenization engine. No language is a "second-class citizen".

## 🚀 What's Next?

We're always improving language support. Future additions might include:

- OCaml / ReasonML
- Elixir
- Haskell
- Clojure
- Zig
- V
- And more based on community feedback!

Have a language request? [Open an issue](https://github.com/stacksjs/ts-syntax-highlighter/issues) and let us know!
