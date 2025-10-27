import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Solidity Grammar', () => {
  const tokenizer = new Tokenizer('solidity')
  describe('Basic Tokenization', () => {
    it('should tokenize Solidity code', async () => {
      const code = `pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    function set(uint256 x) public {
        storedData = x;
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Modifiers', () => {
    it('should highlight visibility modifiers', async () => {
      const code = `function publicFunc() public {}
function privateFunc() private {}
function viewFunc() public view returns (uint) {}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
