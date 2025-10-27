import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Java Grammar', () => {
  const tokenizer = new Tokenizer('java')

  describe('Basic Tokenization', () => {
    it('should tokenize basic Java code', async () => {
      const code = `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const classTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('storage.type'))

      expect(classTokens.length).toBeGreaterThan(0)
    })

    it('should highlight modifiers', async () => {
      const code = `public static final class Constants {
    private static final int MAX = 100;
    protected abstract void method();
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const modifierTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('storage.modifier'))

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const annotationTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('annotation'))

      expect(annotationTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight strings', async () => {
      const code = `String greeting = "Hello World";
char ch = 'A';`
      const tokens = await tokenizer.tokenizeAsync(code)

      const stringTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const stringTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const controlTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.control'))

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const controlTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.control'))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Generic Support', () => {
    it('should handle generic types', async () => {
      const code = `List<String> names = new ArrayList<>();
Map<String, Integer> map = new HashMap<>();`
      const tokens = await tokenizer.tokenizeAsync(code)

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
      const tokens = await tokenizer.tokenizeAsync(code)

      const commentTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('comment'))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Package and Import', () => {
    it('should highlight package and import statements', async () => {
      const code = `package com.example.app;

import java.util.List;
import java.util.ArrayList;
import static java.lang.Math.PI;`
      const tokens = await tokenizer.tokenizeAsync(code)

      const keywordTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.other'))

      expect(keywordTokens.length).toBeGreaterThan(0)
    })
  })
})
