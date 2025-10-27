import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { rubyGrammar } from '../src/grammars/ruby'
import type { Token, TokenLine } from '../src/types'

describe('Ruby Grammar', () => {
  const tokenizer = new Tokenizer(rubyGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic Ruby code', async () => {
      const code = `puts "Hello World"
name = "Ruby"
puts "Hello #{name}"`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('Class Support', () => {
    it('should highlight class definitions', async () => {
      const code = `class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    puts "Hello, I'm #{@name}"
  end
end`
      const tokens = tokenizer.tokenize(code)

      const classTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(classTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Symbol Support', () => {
    it('should highlight symbols', async () => {
      const code = `symbol = :hello
hash = { name: "John", age: 30 }
method(:to_s)`
      const tokens = tokenizer.tokenize(code)

      const symbolTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('symbol')))

      expect(symbolTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight string interpolation', async () => {
      const code = `name = "World"
greeting = "Hello #{name}!"
complex = "Result: #{x + y}"`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight different string delimiters', async () => {
      const code = `single = 'Hello'
double = "Hello"
percent = %q{Hello}
percent_Q = %Q{Hello #{name}}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Block Support', () => {
    it('should handle do-end blocks', async () => {
      const code = `[1, 2, 3].each do |num|
  puts num
end`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should handle brace blocks', async () => {
      const code = `[1, 2, 3].map { |x| x * 2 }`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `if x > 0
  puts "positive"
elsif x < 0
  puts "negative"
else
  puts "zero"
end`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight case statements', async () => {
      const code = `case value
when 1
  puts "one"
when 2, 3
  puts "two or three"
else
  puts "other"
end`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Module Support', () => {
    it('should highlight modules', async () => {
      const code = `module Greetings
  def hello
    puts "Hello"
  end
end

class Person
  include Greetings
  extend SomeModule
end`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Comments', () => {
    it('should highlight comments', async () => {
      const code = `# Single line comment
=begin
Multi-line
comment
=end
puts "test" # inline comment`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Regular Expressions', () => {
    it('should highlight regex', async () => {
      const code = `pattern = /hello/
pattern2 = /[a-z]+/i
if str =~ /\\d+/
  puts "contains digits"
end`
      const tokens = tokenizer.tokenize(code)

      const regexTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('regexp')))

      expect(regexTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Exception Handling', () => {
    it('should highlight rescue blocks', async () => {
      const code = `begin
  risky_operation
rescue StandardError => e
  puts e.message
ensure
  cleanup
end`
      const tokens = tokenizer.tokenize(code)

      const rescueTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(rescueTokens.length).toBeGreaterThan(0)
    })
  })
})
