import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('C# Grammar', () => {
  const tokenizer = new Tokenizer('csharp')

  describe('Basic Tokenization', () => {
    it('should tokenize basic C# code', async () => {
      const code = `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello World");
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Class Support', () => {
    it('should highlight class declarations', async () => {
      const code = `public class Person {
    public string Name { get; set; }
    private int age;

    public Person(string name, int age) {
        Name = name;
        this.age = age;
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const classTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.other'))

      expect(classTokens.length).toBeGreaterThan(0)
    })

    it('should highlight modifiers', async () => {
      const code = `public static class Constants {
    private const int MAX = 100;
    protected internal virtual void Method() {}
    public abstract void AbstractMethod();
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const modifierTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('storage.modifier'))

      expect(modifierTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Property Support', () => {
    it('should highlight auto-properties', async () => {
      const code = `public class MyClass {
    public int Id { get; set; }
    public string Name { get; private set; }
    public int ReadOnly { get; }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('String Support', () => {
    it('should highlight regular strings', async () => {
      const code = `string text = "Hello World";
char ch = 'A';`
      const tokens = await tokenizer.tokenizeAsync(code)

      const stringTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight interpolated strings', async () => {
      const code = `string name = "World";
string greeting = $"Hello {name}!";
string complex = $"Result: {x + y}";`
      const tokens = await tokenizer.tokenizeAsync(code)

      const interpolatedTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

      expect(interpolatedTokens.length).toBeGreaterThan(0)
    })

    it('should highlight verbatim strings', async () => {
      const code = `string path = @"C:\\Users\\Name\\Documents";
string multiline = @"Line 1
Line 2
Line 3";`
      const tokens = await tokenizer.tokenizeAsync(code)

      const verbatimTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('string'))

      expect(verbatimTokens.length).toBeGreaterThan(0)
    })
  })

  describe('LINQ Support', () => {
    it('should handle LINQ queries', async () => {
      const code = `var query = from item in items
          where item.Age > 18
          select item.Name;

var result = items.Where(x => x.Active).Select(x => x.Id);`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Async/Await Support', () => {
    it('should highlight async methods', async () => {
      const code = `public async Task<int> GetDataAsync() {
    await Task.Delay(1000);
    return 42;
}

var result = await GetDataAsync();`
      const tokens = await tokenizer.tokenizeAsync(code)

      const asyncTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('storage.modifier') || t.type.includes('keyword.control'))

      expect(asyncTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Nullable Types', () => {
    it('should handle nullable reference types', async () => {
      const code = `string? nullableString = null;
int? nullableInt = null;
var value = nullableInt ?? 0;`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Attribute Support', () => {
    it('should highlight attributes', async () => {
      const code = `[Serializable]
[Obsolete("Use NewMethod instead")]
public class MyClass {
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const attributeTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('attribute'))

      expect(attributeTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if (x > 0) {
    Console.WriteLine("positive");
} else if (x < 0) {
    Console.WriteLine("negative");
} else {
    Console.WriteLine("zero");
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const controlTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.control'))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight loops', async () => {
      const code = `for (int i = 0; i < 10; i++) {
    Console.WriteLine(i);
}

foreach (var item in items) {
    Console.WriteLine(item);
}

while (x > 0) {
    x--;
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      const controlTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('keyword.control'))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `// Single line comment
/// XML documentation comment
/* Multi-line
   comment */
int x = 10;`
      const tokens = await tokenizer.tokenizeAsync(code)

      const commentTokens = tokens.flatMap(line => line.tokens)
        .filter(t => t.type.includes('comment'))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Namespace Support', () => {
    it('should highlight namespace declarations', async () => {
      const code = `namespace MyApp.Services {
    using System;
    using System.Collections.Generic;

    public class MyService {
        // ...
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)

      expect(tokens).toBeDefined()
    })
  })
})
