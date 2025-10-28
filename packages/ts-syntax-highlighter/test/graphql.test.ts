import { describe, expect, it } from 'bun:test'
import { graphqlGrammar } from '../src/grammars/graphql'
import { Tokenizer } from '../src/tokenizer'

describe('GraphQL Grammar', () => {
  const tokenizer = new Tokenizer(graphqlGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize GraphQL queries', async () => {
      const code = `query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
  }
}`
      const tokens = tokenizer.tokenize(code)
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
      const tokens = tokenizer.tokenize(code)
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
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
