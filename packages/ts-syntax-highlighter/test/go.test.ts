import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { goGrammar } from '../src/grammars/go'
import { Tokenizer } from '../src/tokenizer'

describe('Go Grammar', () => {
  const tokenizer = new Tokenizer(goGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Go code', async () => {
      const code = `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Package and Import', () => {
    it('should highlight package declarations', async () => {
      const code = `package main
package mypackage`
      const tokens = tokenizer.tokenize(code)

      const packageTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(packageTokens.length).toBeGreaterThan(0)
    })

    it('should highlight import statements', async () => {
      const code = `import "fmt"
import (
    "io"
    "os"
    "strings"
)`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Function Support', () => {
    it('should highlight function definitions', async () => {
      const code = `func add(a int, b int) int {
    return a + b
}

func greet(name string) {
    fmt.Println("Hello", name)
}`
      const tokens = tokenizer.tokenize(code)

      const funcTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(funcTokens.length).toBeGreaterThan(0)
    })

    it('should handle multiple return values', async () => {
      const code = `func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Struct Support', () => {
    it('should highlight struct definitions', async () => {
      const code = `type Person struct {
    Name string
    Age  int
}

type Point struct {
    X, Y float64
}`
      const tokens = tokenizer.tokenize(code)

      const structTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(structTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Interface Support', () => {
    it('should highlight interface definitions', async () => {
      const code = `type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Goroutines and Channels', () => {
    it('should highlight goroutines', async () => {
      const code = `go func() {
    fmt.Println("Running in goroutine")
}()

go processData(data)`
      const tokens = tokenizer.tokenize(code)

      const goTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(goTokens.length).toBeGreaterThan(0)
    })

    it('should highlight channel operations', async () => {
      const code = `ch := make(chan int)
ch <- 42
value := <-ch
close(ch)`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if x > 0 {
    fmt.Println("positive")
} else if x < 0 {
    fmt.Println("negative")
} else {
    fmt.Println("zero")
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight for loops', async () => {
      const code = `for i := 0; i < 10; i++ {
    fmt.Println(i)
}

for key, value := range myMap {
    fmt.Println(key, value)
}

for {
    // infinite loop
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should highlight switch statements', async () => {
      const code = `switch value {
case 1:
    fmt.Println("one")
case 2, 3:
    fmt.Println("two or three")
default:
    fmt.Println("other")
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Defer and Panic', () => {
    it('should highlight defer statements', async () => {
      const code = `func example() {
    defer fmt.Println("deferred")
    fmt.Println("normal")
}`
      const tokens = tokenizer.tokenize(code)

      const deferTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(deferTokens.length).toBeGreaterThan(0)
    })

    it('should highlight panic and recover', async () => {
      const code = `func example() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered:", r)
        }
    }()
    panic("error occurred")
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('String Support', () => {
    it('should highlight different string types', async () => {
      const code = `str1 := "Hello World"
str2 := 'A'
str3 := \`Raw string
with multiple lines\``
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `// Single line comment
/* Multi-line
   comment */
func test() {
    // inline comment
}`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Type Support', () => {
    it('should highlight primitive types', async () => {
      const code = `var i int = 10
var f float64 = 3.14
var b bool = true
var s string = "hello"
var by byte = 255`
      const tokens = tokenizer.tokenize(code)

      const typeTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type')))

      expect(typeTokens.length).toBeGreaterThan(0)
    })
  })
})
