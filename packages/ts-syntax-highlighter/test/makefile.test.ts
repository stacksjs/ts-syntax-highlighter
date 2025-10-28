import { describe, expect, it } from 'bun:test'
import { makefileGrammar } from '../src/grammars/makefile'
import { Tokenizer } from '../src/tokenizer'

describe('Makefile Grammar', () => {
  const tokenizer = new Tokenizer(makefileGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize Makefile code', async () => {
      const code = `all: build test

build:
\tgcc -o program main.c

clean:
\trm -f program`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Targets', () => {
    it('should highlight targets', async () => {
      const code = `install: build
\tcp program /usr/local/bin`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `CC = gcc
CFLAGS = -Wall
all:
\t$(CC) $(CFLAGS) -o out main.c`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
