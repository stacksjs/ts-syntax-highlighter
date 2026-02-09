import type { PickierConfig } from 'pickier'

const config: PickierConfig = {
  verbose: false,

  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/fixtures/**',
  ],

  lint: {
    extensions: ['ts', 'js'],
    reporter: 'stylish',
    cache: false,
    maxWarnings: -1,
  },

  format: {
    extensions: ['ts', 'js', 'json', 'md', 'yaml', 'yml'],
    trimTrailingWhitespace: true,
    maxConsecutiveBlankLines: 1,
    finalNewline: 'one',
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  rules: {
    noDebugger: 'error',
    noConsole: 'off',
  },

  pluginRules: {
    'markdown/heading-increment': 'warn',
    'markdown/no-trailing-spaces': 'error',
    'markdown/fenced-code-language': 'warn',

    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'ts/no-top-level-await': 'off',
    'style/brace-style': 'off',
    'style/max-statements-per-line': 'off',
  },
}

export default config
