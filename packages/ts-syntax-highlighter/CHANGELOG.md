# Changelog

## v0.0.0 (Initial Release)

### Features

- **Core Highlighter Engine**
  - Performant tokenization system with regex-based pattern matching
  - Smart caching system for improved performance
  - Full TypeScript support with comprehensive type definitions

- **Language Support**
  - JavaScript (ES6+) with full syntax support
  - TypeScript with type annotations and generics
  - HTML with proper tag and attribute highlighting
  - CSS with properties, values, and selectors
  - STX templating language with Blade-inspired directives

- **Themes**
  - GitHub Dark theme
  - GitHub Light theme
  - Nord theme
  - Custom theme support with full type safety

- **Plugin System**
  - Extensible architecture for custom transformers
  - Support for custom language grammars
  - Support for custom themes
  - Example plugins for common use cases

- **CLI Tool**
  - Highlight files from command line
  - Multiple output formats
  - Line number support
  - Theme selection
  - Language and theme information commands

- **Developer Experience**
  - Comprehensive test suite with 48 passing tests
  - Full API documentation
  - Example code and usage patterns
  - Configuration via bunfig
  - Both library and CLI interfaces

### API

- `createHighlighter(config?)` - Create highlighter instance
- `highlight(code, lang, options?)` - Quick highlight function
- `Highlighter.highlight()` - Highlight code with options
- `Highlighter.loadLanguage()` - Load custom language
- `Highlighter.loadTheme()` - Load custom theme
- `Highlighter.getSupportedLanguages()` - List languages
- `Highlighter.getSupportedThemes()` - List themes
- `Highlighter.clearCache()` - Clear token cache
- `Highlighter.getCacheSize()` - Get cache size

### Performance

- Built-in token caching
- Lazy loading of languages and themes
- Optimized regex patterns
- Minimal bundle size with zero runtime dependencies
