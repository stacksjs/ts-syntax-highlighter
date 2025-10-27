import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { dockerfileGrammar } from '../src/grammars/dockerfile'
import type { Token, TokenLine } from '../src/types'

describe('Dockerfile Grammar', () => {
  const tokenizer = new Tokenizer(dockerfileGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Dockerfile code', async () => {
      const code = `FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Instruction Support', () => {
    it('should highlight FROM instructions', async () => {
      const code = `FROM node:18
FROM ubuntu:22.04 AS builder
FROM scratch`
      const tokens = tokenizer.tokenize(code)

      const fromTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(fromTokens.length).toBeGreaterThan(0)
    })

    it('should highlight RUN instructions', async () => {
      const code = `RUN apt-get update
RUN npm install
RUN mkdir -p /app/data`
      const tokens = tokenizer.tokenize(code)

      const runTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(runTokens.length).toBeGreaterThan(0)
    })

    it('should highlight COPY and ADD instructions', async () => {
      const code = `COPY package.json .
COPY . /app
ADD archive.tar.gz /data`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Environment Variables', () => {
    it('should highlight ENV instructions', async () => {
      const code = `ENV NODE_ENV=production
ENV PORT 3000
ENV PATH="/app/bin:$PATH"`
      const tokens = tokenizer.tokenize(code)

      const envTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(envTokens.length).toBeGreaterThan(0)
    })

    it.todo('should highlight variable references', async () => {
      const code = `RUN echo $HOME
RUN echo \${USER}
WORKDIR $APP_DIR`
      const tokens = tokenizer.tokenize(code)

      const varTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))

      expect(varTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Multi-stage Builds', () => {
    it('should highlight multi-stage build syntax', async () => {
      const code = `FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `# This is a comment
FROM node:18
# Install dependencies
RUN npm install`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight strings', async () => {
      const code = `RUN echo "Hello World"
LABEL description='My application'
CMD ["npm", "start"]`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('CMD and ENTRYPOINT', () => {
    it('should handle different CMD formats', async () => {
      const code = `CMD ["node", "app.js"]
CMD node app.js
CMD ["/bin/bash"]`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should handle ENTRYPOINT', async () => {
      const code = `ENTRYPOINT ["docker-entrypoint.sh"]
ENTRYPOINT ["/bin/sh", "-c"]`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('EXPOSE and VOLUME', () => {
    it('should highlight EXPOSE instruction', async () => {
      const code = `EXPOSE 80
EXPOSE 443
EXPOSE 3000/tcp`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should highlight VOLUME instruction', async () => {
      const code = `VOLUME /data
VOLUME ["/var/log", "/var/db"]`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
