import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { powershellGrammar } from '../src/grammars/powershell'
import { Tokenizer } from '../src/tokenizer'

describe('PowerShell Grammar', () => {
  const tokenizer = new Tokenizer(powershellGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize PowerShell code', async () => {
      const code = `Write-Host "Hello World"
$name = "PowerShell"`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `$var1 = "test"
$_myVar = 123`
      const tokens = tokenizer.tokenize(code)
      const varTokens = tokens.flatMap((line: TokenLine) => line.tokens).filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))
      expect(varTokens.length).toBeGreaterThan(0)
    })
  })
  describe('Cmdlets', () => {
    it('should highlight cmdlets', async () => {
      const code = `Get-Process
Set-Location
Write-Output`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
