import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { protobufGrammar } from '../src/grammars/protobuf'
import type { Token, TokenLine } from '../src/types'

describe('Protobuf Grammar', () => {
  const tokenizer = new Tokenizer(protobufGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize protobuf code', async () => {
      const code = `syntax = "proto3";
package example;

message Person {
  string name = 1;
  int32 id = 2;
  repeated string emails = 3;
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Service Definitions', () => {
    it('should highlight services', async () => {
      const code = `service UserService {
  rpc GetUser(UserRequest) returns (UserResponse);
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
