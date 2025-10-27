import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { solidityGrammar } from '../src/grammars/solidity'
import type { Token, TokenLine } from '../src/types'

describe('Solidity Grammar', () => {
  const tokenizer = new Tokenizer(solidityGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize Solidity code', async () => {
      const code = `pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    function set(uint256 x) public {
        storedData = x;
    }
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Modifiers', () => {
    it('should highlight visibility modifiers', async () => {
      const code = `function publicFunc() public {}
function privateFunc() private {}
function viewFunc() public view returns (uint) {}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
