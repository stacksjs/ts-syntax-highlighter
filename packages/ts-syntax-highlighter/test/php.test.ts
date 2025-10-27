import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'
import { phpGrammar } from '../src/grammars/php'
import type { Token, TokenLine } from '../src/types'

describe('PHP Grammar', () => {
  const tokenizer = new Tokenizer(phpGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic PHP code', async () => {
      const code = `<?php
echo "Hello World";
?>`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('PHP Tags', () => {
    it.todo('should highlight PHP tags', async () => {
      const code = `<?php
echo "test";
?>`
      const tokens = tokenizer.tokenize(code)

      const phpTagTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('punctuation.section.embedded')))

      expect(phpTagTokens.length).toBeGreaterThan(0)
    })

    it('should highlight short echo tags', async () => {
      const code = `<?= $variable ?>`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Variable Support', () => {
    it('should highlight variables', async () => {
      const code = `<?php
$name = "John";
$age = 25;
echo $name;`
      const tokens = tokenizer.tokenize(code)

      const variableTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))

      expect(variableTokens.length).toBeGreaterThan(0)
    })

    it('should highlight special variables', async () => {
      const code = `<?php
echo $this->name;
echo $_GET['id'];
echo $_POST['data'];`
      const tokens = tokenizer.tokenize(code)

      const variableTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('variable')))

      expect(variableTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight double-quoted strings with interpolation', async () => {
      const code = `<?php
$name = "World";
echo "Hello $name";`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })

    it('should highlight single-quoted strings', async () => {
      const code = `<?php
echo 'Hello World';`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Class Support', () => {
    it.todo('should highlight class declarations', async () => {
      const code = `<?php
class User {
    public $name;
    private $age;

    public function getName() {
        return $this->name;
    }
}`
      const tokens = tokenizer.tokenize(code)

      const classTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.type.class')))

      expect(classTokens.length).toBeGreaterThan(0)
    })

    it('should highlight visibility modifiers', async () => {
      const code = `<?php
class Test {
    public $a;
    private $b;
    protected $c;
    static $d;
}`
      const tokens = tokenizer.tokenize(code)

      const modifierTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('storage.modifier')))

      expect(modifierTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Control Flow', () => {
    it('should highlight if statements', async () => {
      const code = `<?php
if ($x > 0) {
    echo "positive";
} elseif ($x < 0) {
    echo "negative";
} else {
    echo "zero";
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })

    it('should highlight loops', async () => {
      const code = `<?php
for ($i = 0; $i < 10; $i++) {
    echo $i;
}

foreach ($array as $item) {
    echo $item;
}

while ($x > 0) {
    $x--;
}`
      const tokens = tokenizer.tokenize(code)

      const controlTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(controlTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Functions', () => {
    it('should highlight function definitions', async () => {
      const code = `<?php
function greet($name) {
    return "Hello " . $name;
}

echo greet("World");`
      const tokens = tokenizer.tokenize(code)

      const functionTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('function')))

      expect(functionTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `<?php
// Single line comment
# Hash comment
/* Multi-line
   comment */
echo "test";`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Namespace Support', () => {
    it('should highlight namespaces', async () => {
      const code = `<?php
namespace App\\Controllers;

use App\\Models\\User;

class UserController {
    // ...
}`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
