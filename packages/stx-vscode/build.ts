/**
 * Build script for STX VSCode extension
 * Generates the TextMate grammar from the source grammar
 */

import { stxGrammar } from '../ts-syntax-highlighter/src/grammars/stx'
import { exportToTextMateString } from '../ts-syntax-highlighter/src/export-textmate'

const outputPath = './syntaxes/stx.tmLanguage.json'

console.log('Building STX TextMate grammar...')

const tmGrammar = exportToTextMateString(stxGrammar)

await Bun.write(outputPath, tmGrammar)

console.log(`Generated ${outputPath}`)
console.log('Build complete!')
