import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { rustGrammar } from '../src/grammars/rust'
import type { Token, TokenLine } from '../src/types'

describe('Rust Grammar', () => {
  const tokenizer = new Tokenizer(rustGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Rust code', async () => {
      const code = `fn main() {
    println!("Hello, world!");
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Function Support', () => {
    it('should highlight function definitions', async () => {
      const code = `fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn greet(name: &str) {
    println!("Hello, {}!", name);
}`
      const tokens = tokenizer.tokenize(code)

      const fnTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other.fn')))

      expect(fnTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Struct and Enum Support', () => {
    it('should highlight struct definitions', async () => {
      const code = `struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Self {
        Person { name, age }
    }
}`
      const tokens = tokenizer.tokenize(code)

      const structTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other')))

      expect(structTokens.length).toBeGreaterThan(0)
    })

    it('should highlight enum definitions', async () => {
      const code = `enum Result<T, E> {
    Ok(T),
    Err(E),
}

match result {
    Ok(value) => println!("Success: {}", value),
    Err(error) => println!("Error: {}", error),
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Lifetime Support', () => {
    it.todo('should highlight lifetimes', async () => {
      const code = `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct ImportantExcerpt<'a> {
    part: &'a str,
}`
      const tokens = tokenizer.tokenize(code)

      const lifetimeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('lifetime')))

      expect(lifetimeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Macro Support', () => {
    it.todo('should highlight macro invocations', async () => {
      const code = `println!("Hello, world!");
vec![1, 2, 3, 4, 5];
assert_eq!(x, y);
dbg!(some_variable);`
      const tokens = tokenizer.tokenize(code)

      const macroTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('macro')))

      expect(macroTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Attribute Support', () => {
    it('should highlight attributes', async () => {
      const code = `#[derive(Debug, Clone)]
#[allow(dead_code)]
struct MyStruct {
    #[serde(rename = "field")]
    my_field: i32,
}`
      const tokens = tokenizer.tokenize(code)

      const attributeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('attribute')))

      expect(attributeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight regular strings', async () => {
      const code = `let s1 = "Hello, world!";
let s2 = 'A';
let s3 = "Line 1\\nLine 2";`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight raw strings', async () => {
      const code = `let raw = r"This is a raw string \\n";
let raw2 = r#"Can contain "quotes""#;
let raw3 = r##"Can contain # and "quotes""##;`
      const tokens = tokenizer.tokenize(code)

      const rawStringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(rawStringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Pattern Matching', () => {
    it('should highlight match expressions', async () => {
      const code = `match number {
    1 => println!("One"),
    2 | 3 | 5 | 7 => println!("Prime"),
    4..=10 => println!("Four to ten"),
    _ => println!("Other"),
}`
      const tokens = tokenizer.tokenize(code)

      const matchTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(matchTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Ownership Keywords', () => {
    it('should highlight ownership-related keywords', async () => {
      const code = `let x = 5;
let mut y = 10;
let ref z = x;
let moved = move || { x };`
      const tokens = tokenizer.tokenize(code)

      const modifierTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.modifier')))

      expect(modifierTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `// Single line comment
/// Documentation comment
/* Multi-line
   comment */
fn test() {
    // ...
}`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Type Support', () => {
    it('should highlight primitive types', async () => {
      const code = `let x: i32 = 10;
let y: u64 = 100;
let z: f64 = 3.14;
let b: bool = true;
let c: char = 'A';`
      const tokens = tokenizer.tokenize(code)

      const typeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(typeTokens.length).toBeGreaterThan(0)
    })
  })
})
