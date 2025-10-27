import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { javaGrammar } from '../src/grammars/java'
import type { Token, TokenLine } from '../src/types'

describe('Java Grammar', () => {
  const tokenizer = new Tokenizer(javaGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Java code', async () => {
      const code = `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Class Support', () => {
    it('should highlight class declarations', async () => {
      const code = `public class User {
    private String name;
    private int age;

    public String getName() {
        return name;
    }
}`
      const tokens = tokenizer.tokenize(code)

      const classTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(classTokens.length).toBeGreaterThan(0)
    })

    it('should highlight modifiers', async () => {
      const code = `public static final class Constants {
    private static final int MAX = 100;
    protected abstract void method();
}`
      const tokens = tokenizer.tokenize(code)

      const modifierTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.modifier')))

      expect(modifierTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Annotation Support', () => {
    it('should highlight annotations', async () => {
      const code = `@Override
@Deprecated
@SuppressWarnings("unchecked")
public void method() {
    // ...
}`
      const tokens = tokenizer.tokenize(code)

      const annotationTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('annotation')))

      expect(annotationTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight strings', async () => {
      const code = `String greeting = "Hello World";
char ch = 'A';`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight text blocks', async () => {
      const code = `String html = """
    <html>
        <body>
            <p>Hello</p>
        </body>
    </html>
    """;`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if (x > 0) {
    System.out.println("positive");
} else if (x < 0) {
    System.out.println("negative");
} else {
    System.out.println("zero");
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight loops', async () => {
      const code = `for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (x > 0) {
    x--;
}

do {
    x++;
} while (x < 10);`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Generic Support', () => {
    it('should handle generic types', async () => {
      const code = `List<String> names = new ArrayList<>();
Map<String, Integer> map = new HashMap<>();`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `// Single line comment
/* Multi-line
   comment */
/**
 * JavaDoc comment
 * @param name the name
 * @return greeting
 */
public String greet(String name) {
    return "Hello " + name;
}`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Package and Import', () => {
    it('should highlight package and import statements', async () => {
      const code = `package com.example.app;

import java.util.List;
import java.util.ArrayList;
import static java.lang.Math.PI;`
      const tokens = tokenizer.tokenize(code)

      const keywordTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other')))

      expect(keywordTokens.length).toBeGreaterThan(0)
    })
  })
})
