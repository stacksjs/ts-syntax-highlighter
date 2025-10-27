import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Protobuf Grammar', () => {
  const tokenizer = new Tokenizer('protobuf')
  describe('Basic Tokenization', () => {
    it('should tokenize protobuf code', async () => {
      const code = `syntax = "proto3";
package example;

message Person {
  string name = 1;
  int32 id = 2;
  repeated string emails = 3;
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Service Definitions', () => {
    it('should highlight services', async () => {
      const code = `service UserService {
  rpc GetUser(UserRequest) returns (UserResponse);
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
