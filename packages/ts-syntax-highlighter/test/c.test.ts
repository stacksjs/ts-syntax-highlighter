import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { cGrammar } from '../src/grammars/c'
import type { Token, TokenLine } from '../src/types'

describe('C Grammar', () => {
  const tokenizer = new Tokenizer(cGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic C code', async () => {
      const code = `#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Preprocessor Directives', () => {
    it('should highlight include directives', async () => {
      const code = `#include <stdio.h>
#include "myheader.h"`
      const tokens = tokenizer.tokenize(code)

      const preprocessorTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('preprocessor')))

      expect(preprocessorTokens.length).toBeGreaterThan(0)
    })

    it('should highlight define directives', async () => {
      const code = `#define MAX 100
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#undef MAX`
      const tokens = tokenizer.tokenize(code)

      const preprocessorTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('preprocessor')))

      expect(preprocessorTokens.length).toBeGreaterThan(0)
    })

    it('should highlight conditional directives', async () => {
      const code = `#ifdef DEBUG
    printf("Debug mode\\n");
#elif defined(VERBOSE)
    printf("Verbose mode\\n");
#else
    printf("Normal mode\\n");
#endif`
      const tokens = tokenizer.tokenize(code)

      const directiveTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('directive')))

      expect(directiveTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Type Support', () => {
    it('should highlight primitive types', async () => {
      const code = `int x = 10;
float y = 3.14;
char c = 'A';
double d = 2.718;
unsigned long ul = 100UL;`
      const tokens = tokenizer.tokenize(code)

      const typeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(typeTokens.length).toBeGreaterThan(0)
    })

    it('should highlight struct definitions', async () => {
      const code = `struct Point {
    int x;
    int y;
};

typedef struct {
    float r, g, b;
} Color;`
      const tokens = tokenizer.tokenize(code)

      const structTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(structTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Pointer Support', () => {
    it('should handle pointer syntax', async () => {
      const code = `int *ptr;
int **ptr2;
void *generic_ptr;
char *str = "Hello";
ptr->member;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if (x > 0) {
    printf("positive\\n");
} else if (x < 0) {
    printf("negative\\n");
} else {
    printf("zero\\n");
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight loops', async () => {
      const code = `for (int i = 0; i < 10; i++) {
    printf("%d\\n", i);
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

    it('should highlight switch statements', async () => {
      const code = `switch (value) {
    case 1:
        printf("one\\n");
        break;
    case 2:
        printf("two\\n");
        break;
    default:
        printf("other\\n");
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Functions', () => {
    it('should highlight function definitions', async () => {
      const code = `int add(int a, int b) {
    return a + b;
}

void greet(const char *name) {
    printf("Hello, %s!\\n", name);
}`
      const tokens = tokenizer.tokenize(code)

      const functionTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('function')))

      expect(functionTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `// Single line comment
/* Multi-line
   comment */
int x = 10; // inline comment`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight strings and character literals', async () => {
      const code = `char *str = "Hello World";
char ch = 'A';
char *escaped = "Line 1\\nLine 2\\tTabbed";`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })
})
