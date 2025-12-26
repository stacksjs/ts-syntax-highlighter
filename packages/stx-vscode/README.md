# STX Language Support for VS Code

Syntax highlighting for [STX](https://github.com/stacksjs/stx) - a modern frontend framework rivaling Vue and React.

## Features

- Full syntax highlighting for `.stx` files
- Support for Blade-style directives
- Alpine.js reactive directives (`x-data`, `x-model`, `x-show`, etc.)
- Vue-style attribute binding (`:prop`, `v-bind`, `v-on`)
- Event handling with modifiers (`@click.prevent`, `@keydown.enter`)
- PascalCase component tags (`<MyComponent>`, `<HomeIcon>`)
- Filter syntax (`{{ value | uppercase }}`)
- Embedded TypeScript/JavaScript/CSS blocks
- Smart bracket matching and auto-closing
- Code folding for directive blocks

## Supported Syntax

### Template Expressions

```stx
{{ variable }}
{{{ unescapedHtml }}}
{!! rawHtml !!}
{{ name | uppercase | truncate:20 }}
```

### Directives

```stx
@if(condition)
  Content
@elseif(other)
  Alternative
@else
  Fallback
@endif

@foreach(items as item)
  {{ item.name }}
@endforeach

@component('Card')
  @slot('header')
    Title
  @endslot
@endcomponent
```

### Alpine-style Reactivity

```stx
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>
    Content
  </div>
</div>
```

### Attribute Binding

```stx
<div :class="activeClass" :style="{ color: textColor }">
<input x-model="name" @input.debounce:500="search">
<button @click.prevent="submit" :disabled="isLoading">
```

### Components

```stx
<MyComponent prop="value">
  <ChildComponent />
</MyComponent>

<HomeIcon size="24" />
<SettingsIcon color="red" />
```

### Script Blocks

```stx
<script>
  // Server-side TypeScript
  const title = "Hello World"
  export const items = await fetchItems()
</script>

<script client>
  // Client-side reactivity
  import { ref } from 'stx'
  const count = ref(0)
</script>
```

## Installation

### From VS Code Marketplace

Search for "STX" in the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).

### Manual Installation

1. Download the `.vsix` file from releases
2. Open VS Code
3. Run `Extensions: Install from VSIX...` from command palette
4. Select the downloaded file

### Development

```bash
# Clone and build
cd packages/stx-vscode
bun install
bun run build

# Package extension
bun run package
```

## Building from Source

The TextMate grammar is automatically generated from the TypeScript grammar source:

```bash
bun run build
```

This reads from `../ts-syntax-highlighter/src/grammars/stx.ts` and outputs `syntaxes/stx.tmLanguage.json`.

## License

MIT
