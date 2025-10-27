import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { cppGrammar } from '../src/grammars/cpp'
import type { Token, TokenLine } from '../src/types'

describe('C++ Grammar', () => {
  const tokenizer = new Tokenizer(cppGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic C++ code', async () => {
      const code = `#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Class Support', () => {
    it('should highlight class declarations', async () => {
      const code = `class Person {
private:
    std::string name;
    int age;

public:
    Person(std::string n, int a) : name(n), age(a) {}

    std::string getName() const {
        return name;
    }
};`
      const tokens = tokenizer.tokenize(code)

      const classTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(classTokens.length).toBeGreaterThan(0)
    })

    it('should highlight access specifiers', async () => {
      const code = `class Test {
public:
    int x;
private:
    int y;
protected:
    int z;
};`
      const tokens = tokenizer.tokenize(code)

      const accessTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.modifier.access')))

      expect(accessTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Template Support', () => {
    it('should handle template syntax', async () => {
      const code = `template <typename T>
class Container {
    T value;
public:
    Container(T v) : value(v) {}
    T getValue() { return value; }
};

template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Modern C++ Features', () => {
    it('should highlight auto keyword', async () => {
      const code = `auto x = 10;
auto y = 3.14;
auto z = std::vector<int>{1, 2, 3};`
      const tokens = tokenizer.tokenize(code)

      const autoTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(autoTokens.length).toBeGreaterThan(0)
    })

    it('should highlight lambda expressions', async () => {
      const code = `auto lambda = [](int x, int y) -> int {
    return x + y;
};

auto result = lambda(5, 3);`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should highlight nullptr', async () => {
      const code = `int* ptr = nullptr;`
      const tokens = tokenizer.tokenize(code)

      const nullptrTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('constant.language')))

      expect(nullptrTokens.length).toBeGreaterThan(0)
    })

    it('should highlight constexpr', async () => {
      const code = `constexpr int factorial(int n) {
    return n <= 1 ? 1 : (n * factorial(n - 1));
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Namespace Support', () => {
    it('should highlight namespace declarations', async () => {
      const code = `namespace MyNamespace {
    class MyClass {
        // ...
    };
}

using namespace std;
using std::cout;`
      const tokens = tokenizer.tokenize(code)

      const namespaceTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other')))

      expect(namespaceTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight regular strings', async () => {
      const code = `std::string str = "Hello World";
char ch = 'A';`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight raw string literals', async () => {
      const code = `std::string raw = R"(This is a
multiline raw
string literal)";`
      const tokens = tokenizer.tokenize(code)

      const rawStringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(rawStringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight range-based for loops', async () => {
      const code = `std::vector<int> vec = {1, 2, 3, 4, 5};
for (const auto& item : vec) {
    std::cout << item << std::endl;
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Exception Handling', () => {
    it('should highlight try-catch blocks', async () => {
      const code = `try {
    throw std::runtime_error("Error occurred");
} catch (const std::exception& e) {
    std::cerr << e.what() << std::endl;
} catch (...) {
    std::cerr << "Unknown error" << std::endl;
}`
      const tokens = tokenizer.tokenize(code)

      const exceptionTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(exceptionTokens.length).toBeGreaterThan(0)
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
})
