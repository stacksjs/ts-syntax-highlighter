import type { Language } from '../types'
import { abnfGrammar } from './abnf'
import { bashGrammar } from './bash'
import { bnfGrammar } from './bnf'
import { cGrammar } from './c'
import { cmdGrammar } from './cmd'
import { cppGrammar } from './cpp'
import { csharpGrammar } from './csharp'
import { cssGrammar } from './css'
import { csvGrammar } from './csv'
import { dartGrammar } from './dart'
import { diffGrammar } from './diff'
import { dockerfileGrammar } from './dockerfile'
import { goGrammar } from './go'
import { graphqlGrammar } from './graphql'
import { htmlGrammar } from './html'
import { idlGrammar } from './idl'
import { javaGrammar } from './java'
import { javascriptGrammar } from './javascript'
import { jsonGrammar } from './json'
import { json5Grammar } from './json5'
import { jsoncGrammar } from './jsonc'
import { kotlinGrammar } from './kotlin'
import { latexGrammar } from './latex'
import { logGrammar } from './log'
import { luaGrammar } from './lua'
import { makefileGrammar } from './makefile'
import { markdownGrammar } from './markdown'
import { nginxGrammar } from './nginx'
import { phpGrammar } from './php'
import { powershellGrammar } from './powershell'
import { protobufGrammar } from './protobuf'
import { pythonGrammar } from './python'
import { rGrammar } from './r'
import { regexpGrammar } from './regexp'
import { rubyGrammar } from './ruby'
import { rustGrammar } from './rust'
import { scssGrammar } from './scss'
import { solidityGrammar } from './solidity'
import { sqlGrammar } from './sql'
import { stxGrammar } from './stx'
import { swiftGrammar } from './swift'
import { terraformGrammar } from './terraform'
import { textGrammar } from './text'
import { tomlGrammar } from './toml'
import { typescriptGrammar } from './typescript'
import { vueGrammar } from './vue'
import { xmlGrammar } from './xml'
import { yamlGrammar } from './yaml'

export const languages: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    aliases: ['js', 'jsx'],
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    grammar: javascriptGrammar,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    aliases: ['ts', 'tsx'],
    extensions: ['.ts', '.tsx', '.mts', '.cts'],
    grammar: typescriptGrammar,
  },
  {
    id: 'html',
    name: 'HTML',
    aliases: ['htm'],
    extensions: ['.html', '.htm'],
    grammar: htmlGrammar,
  },
  {
    id: 'css',
    name: 'CSS',
    aliases: [],
    extensions: ['.css'],
    grammar: cssGrammar,
  },
  {
    id: 'json',
    name: 'JSON',
    aliases: [],
    extensions: ['.json'],
    grammar: jsonGrammar,
  },
  {
    id: 'stx',
    name: 'STX',
    aliases: [],
    extensions: ['.stx'],
    grammar: stxGrammar,
  },
  {
    id: 'bash',
    name: 'Bash',
    aliases: ['sh', 'shell', 'zsh', 'console'],
    extensions: ['.sh', '.bash', '.zsh'],
    grammar: bashGrammar,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    aliases: ['md'],
    extensions: ['.md', '.markdown'],
    grammar: markdownGrammar,
  },
  {
    id: 'yaml',
    name: 'YAML',
    aliases: ['yml'],
    extensions: ['.yaml', '.yml'],
    grammar: yamlGrammar,
  },
  {
    id: 'jsonc',
    name: 'JSONC',
    aliases: [],
    extensions: ['.jsonc'],
    grammar: jsoncGrammar,
  },
  {
    id: 'diff',
    name: 'Diff',
    aliases: ['patch'],
    extensions: ['.diff', '.patch'],
    grammar: diffGrammar,
  },
  {
    id: 'python',
    name: 'Python',
    aliases: ['py'],
    extensions: ['.py', '.pyw'],
    grammar: pythonGrammar,
  },
  {
    id: 'php',
    name: 'PHP',
    aliases: [],
    extensions: ['.php', '.phtml'],
    grammar: phpGrammar,
  },
  {
    id: 'java',
    name: 'Java',
    aliases: [],
    extensions: ['.java'],
    grammar: javaGrammar,
  },
  {
    id: 'c',
    name: 'C',
    aliases: ['h'],
    extensions: ['.c', '.h'],
    grammar: cGrammar,
  },
  {
    id: 'cpp',
    name: 'C++',
    aliases: ['cc', 'cxx', 'hpp'],
    extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.h++'],
    grammar: cppGrammar,
  },
  {
    id: 'rust',
    name: 'Rust',
    aliases: ['rs'],
    extensions: ['.rs'],
    grammar: rustGrammar,
  },
  {
    id: 'csharp',
    name: 'C#',
    aliases: ['cs'],
    extensions: ['.cs'],
    grammar: csharpGrammar,
  },
  {
    id: 'dockerfile',
    name: 'Dockerfile',
    aliases: ['docker'],
    extensions: ['.dockerfile'],
    grammar: dockerfileGrammar,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    aliases: ['rb'],
    extensions: ['.rb'],
    grammar: rubyGrammar,
  },
  {
    id: 'go',
    name: 'Go',
    aliases: [],
    extensions: ['.go'],
    grammar: goGrammar,
  },
  {
    id: 'sql',
    name: 'SQL',
    aliases: [],
    extensions: ['.sql'],
    grammar: sqlGrammar,
  },
  {
    id: 'idl',
    name: 'IDL',
    aliases: [],
    extensions: ['.idl'],
    grammar: idlGrammar,
  },
  {
    id: 'text',
    name: 'Text',
    aliases: ['txt', 'plain'],
    extensions: ['.txt', '.text'],
    grammar: textGrammar,
  },
  {
    id: 'json5',
    name: 'JSON5',
    aliases: [],
    extensions: ['.json5'],
    grammar: json5Grammar,
  },
  {
    id: 'vue',
    name: 'Vue',
    aliases: [],
    extensions: ['.vue'],
    grammar: vueGrammar,
  },
  {
    id: 'toml',
    name: 'TOML',
    aliases: [],
    extensions: ['.toml'],
    grammar: tomlGrammar,
  },
  {
    id: 'scss',
    name: 'SCSS',
    aliases: ['sass'],
    extensions: ['.scss', '.sass'],
    grammar: scssGrammar,
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    aliases: ['kt'],
    extensions: ['.kt', '.kts'],
    grammar: kotlinGrammar,
  },
  {
    id: 'swift',
    name: 'Swift',
    aliases: [],
    extensions: ['.swift'],
    grammar: swiftGrammar,
  },
  {
    id: 'dart',
    name: 'Dart',
    aliases: [],
    extensions: ['.dart'],
    grammar: dartGrammar,
  },
  {
    id: 'r',
    name: 'R',
    aliases: [],
    extensions: ['.r', '.R'],
    grammar: rGrammar,
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    aliases: ['gql'],
    extensions: ['.graphql', '.gql'],
    grammar: graphqlGrammar,
  },
  {
    id: 'powershell',
    name: 'PowerShell',
    aliases: ['ps1'],
    extensions: ['.ps1', '.psm1'],
    grammar: powershellGrammar,
  },
  {
    id: 'makefile',
    name: 'Makefile',
    aliases: ['make'],
    extensions: ['.make'],
    grammar: makefileGrammar,
  },
  {
    id: 'terraform',
    name: 'Terraform',
    aliases: ['tf', 'hcl'],
    extensions: ['.tf', '.hcl'],
    grammar: terraformGrammar,
  },
  {
    id: 'bnf',
    name: 'BNF',
    aliases: [],
    extensions: ['.bnf'],
    grammar: bnfGrammar,
  },
  {
    id: 'regexp',
    name: 'RegExp',
    aliases: ['regex'],
    extensions: ['.regexp', '.regex'],
    grammar: regexpGrammar,
  },
  {
    id: 'lua',
    name: 'Lua',
    aliases: [],
    extensions: ['.lua'],
    grammar: luaGrammar,
  },
  {
    id: 'cmd',
    name: 'CMD',
    aliases: ['batch'],
    extensions: ['.cmd', '.bat'],
    grammar: cmdGrammar,
  },
  {
    id: 'abnf',
    name: 'ABNF',
    aliases: [],
    extensions: ['.abnf'],
    grammar: abnfGrammar,
  },
  {
    id: 'csv',
    name: 'CSV',
    aliases: [],
    extensions: ['.csv'],
    grammar: csvGrammar,
  },
  {
    id: 'log',
    name: 'Log',
    aliases: [],
    extensions: ['.log'],
    grammar: logGrammar,
  },
  {
    id: 'nginx',
    name: 'Nginx',
    aliases: ['nginxconf'],
    extensions: ['.conf'],
    grammar: nginxGrammar,
  },
  {
    id: 'xml',
    name: 'XML',
    aliases: [],
    extensions: ['.xml'],
    grammar: xmlGrammar,
  },
  {
    id: 'protobuf',
    name: 'Protobuf',
    aliases: ['proto'],
    extensions: ['.proto'],
    grammar: protobufGrammar,
  },
  {
    id: 'solidity',
    name: 'Solidity',
    aliases: ['sol'],
    extensions: ['.sol'],
    grammar: solidityGrammar,
  },
  {
    id: 'latex',
    name: 'LaTeX',
    aliases: ['tex'],
    extensions: ['.tex', '.latex'],
    grammar: latexGrammar,
  },
]

export function getLanguage(id: string): Language | undefined {
  return languages.find(
    lang =>
      lang.id === id
      || lang.aliases?.includes(id)
      || lang.extensions?.includes(`.${id}`)
      || lang.extensions?.includes(id),
  )
}

export function getLanguageByExtension(ext: string): Language | undefined {
  const extension = ext.startsWith('.') ? ext : `.${ext}`
  return languages.find(lang => lang.extensions?.includes(extension))
}

export * from './abnf'
export * from './bash'
export * from './bnf'
export * from './c'
export * from './cmd'
export * from './cpp'
export * from './csharp'
export * from './css'
export * from './css'
export * from './csv'
export * from './dart'
export * from './diff'
export * from './dockerfile'
export * from './go'
export * from './graphql'
export * from './html'
export * from './html'
export * from './idl'
export * from './java'
export * from './javascript'
export * from './javascript'
export * from './json'
export * from './json5'
export * from './jsonc'
export * from './kotlin'
export * from './latex'
export * from './log'
export * from './lua'
export * from './makefile'
export * from './markdown'
export * from './nginx'
export * from './php'
export * from './powershell'
export * from './protobuf'
export * from './python'
export * from './r'
export * from './regexp'
export * from './ruby'
export * from './rust'
export * from './scss'
export * from './solidity'
export * from './sql'
export * from './stx'
export * from './typescript'
