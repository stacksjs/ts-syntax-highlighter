import { expect, test } from 'bun:test'
import { findLanguageForFilename, resolveGrammar, Tokenizer } from '../src/browser'
import { detectLanguageFromExtension } from '../src/detect'

test('detects dotenv files and environment-specific variants in both entry points', () => {
  for (const path of ['.env', 'config/.env.production.local', 'C:\\app\\.env.example']) {
    expect(findLanguageForFilename(path)?.id).toBe('dotenv')
    expect(detectLanguageFromExtension(path)?.id).toBe('dotenv')
  }
  expect(findLanguageForFilename('.envrc')).toBeUndefined()
})

test('highlights keys, interpolation, and comments without colouring quoted hashes as comments', async () => {
  const grammar = await resolveGrammar('env')
  expect(grammar?.scopeName).toBe('source.dotenv')
  const tokenizer = new Tokenizer(grammar!)
  const lines = [' export DB_URL="${HOST}#path" # comment', 'TITLE=It\'s a value', 'MULTILINE="start', '# inside quotes"']
  const result = tokenizer.tokenizeLinesFrom(lines, tokenizer.initialState())
  expect(result.lines.map(line => line.tokens.map(token => token.content).join(''))).toEqual(lines)
  const tags = (index: number) => result.lines[index]!.tokens.map(({ content, type }) => [content, type])
  expect(tags(0)).toContainEqual(['export', 'keyword'])
  expect(tags(0)).toContainEqual(['DB_URL', 'variable'])
  expect(tags(0)).toContainEqual(['=', 'operator'])
  expect(tags(0)).toContainEqual(['${HOST}', 'variable'])
  expect(tags(0)).toContainEqual(['#path', 'string'])
  expect(tags(0)).toContainEqual(['# comment', 'comment'])
  expect(tags(1)).toContainEqual(["It's a value", 'string'])
  expect(tags(3)).toContainEqual(['# inside quotes', 'string'])
})
