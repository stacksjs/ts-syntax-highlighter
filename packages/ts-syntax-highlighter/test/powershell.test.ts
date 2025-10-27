import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('PowerShell Grammar', () => {
  const tokenizer = new Tokenizer('powershell')
  describe('Basic Tokenization', () => {
    it('should tokenize PowerShell code', async () => {
      const code = `Write-Host "Hello World"
$name = "PowerShell"`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `$var1 = "test"
$_myVar = 123`
      const tokens = await tokenizer.tokenizeAsync(code)
      const varTokens = tokens.flatMap(line => line.tokens).filter(t => t.type.includes('variable'))
      expect(varTokens.length).toBeGreaterThan(0)
    })
  })
  describe('Cmdlets', () => {
    it('should highlight cmdlets', async () => {
      const code = `Get-Process
Set-Location
Write-Output`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
