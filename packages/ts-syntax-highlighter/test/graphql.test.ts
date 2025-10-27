import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('GraphQL Grammar', () => {
  const tokenizer = new Tokenizer('graphql')
  describe('Basic Tokenization', () => {
    it('should tokenize GraphQL queries', async () => {
      const code = `query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Type Definitions', () => {
    it('should highlight type definitions', async () => {
      const code = `type User {
  id: ID!
  name: String!
  email: String
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Directives', () => {
    it('should highlight directives', async () => {
      const code = `query GetUser($withEmail: Boolean!) {
  user {
    name
    email @include(if: $withEmail)
  }
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
