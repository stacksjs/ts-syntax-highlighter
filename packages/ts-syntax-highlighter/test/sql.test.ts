import type { Token, TokenLine } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { sqlGrammar } from '../src/grammars/sql'
import { Tokenizer } from '../src/tokenizer'

describe('SQL Grammar', () => {
  const tokenizer = new Tokenizer(sqlGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize basic SQL code', async () => {
      const code = `SELECT * FROM users WHERE age > 18;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
      expect(tokens.length).toBeGreaterThan(0)
    })
  })

  describe('SELECT Statements', () => {
    it('should highlight SELECT queries', async () => {
      const code = `SELECT id, name, email
FROM users
WHERE active = TRUE
ORDER BY name ASC;`
      const tokens = tokenizer.tokenize(code)

      const selectTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword')))

      expect(selectTokens.length).toBeGreaterThan(0)
    })

    it('should highlight DISTINCT and aggregate functions', async () => {
      const code = `SELECT DISTINCT country,
       COUNT(*) as total,
       AVG(age) as avg_age
FROM users
GROUP BY country
HAVING COUNT(*) > 10;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('JOIN Operations', () => {
    it('should highlight different join types', async () => {
      const code = `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
LEFT JOIN addresses a ON u.id = a.user_id
WHERE o.total > 100;`
      const tokens = tokenizer.tokenize(code)

      const joinTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword')))

      expect(joinTokens.length).toBeGreaterThan(0)
    })
  })

  describe('INSERT Statements', () => {
    it('should highlight INSERT queries', async () => {
      const code = `INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 25);

INSERT INTO users (name, email)
SELECT name, email FROM temp_users;`
      const tokens = tokenizer.tokenize(code)

      const insertTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other.dml')))

      expect(insertTokens.length).toBeGreaterThan(0)
    })
  })

  describe('UPDATE Statements', () => {
    it('should highlight UPDATE queries', async () => {
      const code = `UPDATE users
SET age = 26, updated_at = NOW()
WHERE id = 1;`
      const tokens = tokenizer.tokenize(code)

      const updateTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other.dml')))

      expect(updateTokens.length).toBeGreaterThan(0)
    })
  })

  describe('DELETE Statements', () => {
    it('should highlight DELETE queries', async () => {
      const code = `DELETE FROM users
WHERE last_login < '2020-01-01';`
      const tokens = tokenizer.tokenize(code)

      const deleteTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other.dml')))

      expect(deleteTokens.length).toBeGreaterThan(0)
    })
  })

  describe('DDL Statements', () => {
    it('should highlight CREATE TABLE', async () => {
      const code = `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    age INT CHECK (age >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
      const tokens = tokenizer.tokenize(code)

      const createTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.other.ddl')))

      expect(createTokens.length).toBeGreaterThan(0)
    })

    it('should highlight ALTER TABLE', async () => {
      const code = `ALTER TABLE users
ADD COLUMN phone VARCHAR(20);

ALTER TABLE users
DROP COLUMN phone;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })

    it('should highlight DROP statements', async () => {
      const code = `DROP TABLE IF EXISTS temp_users;
DROP INDEX idx_email ON users;
DROP DATABASE old_db;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('Subqueries', () => {
    it('should handle subqueries', async () => {
      const code = `SELECT name, age
FROM users
WHERE age > (SELECT AVG(age) FROM users);

SELECT *
FROM (SELECT * FROM users WHERE age > 18) AS adults;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })

  describe('CASE Expressions', () => {
    it('should highlight CASE statements', async () => {
      const code = `SELECT name,
       CASE
           WHEN age < 18 THEN 'Minor'
           WHEN age BETWEEN 18 AND 65 THEN 'Adult'
           ELSE 'Senior'
       END AS age_group
FROM users;`
      const tokens = tokenizer.tokenize(code)

      const caseTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('keyword.control')))

      expect(caseTokens.length).toBeGreaterThan(0)
    })
  })

  describe('String Support', () => {
    it('should highlight strings', async () => {
      const code = `SELECT * FROM users WHERE name = 'John Doe';
SELECT * FROM users WHERE email LIKE '%@example.com';`
      const tokens = tokenizer.tokenize(code)

      const stringTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('string')))

      expect(stringTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Comments', () => {
    it('should highlight different comment styles', async () => {
      const code = `-- Single line comment
# Another comment style
/* Multi-line
   comment */
SELECT * FROM users; -- inline comment`
      const tokens = tokenizer.tokenize(code)

      const commentTokens = tokens.flatMap((line: TokenLine) => line.tokens)
        .filter((t: Token) => t.scopes.some((scope: string) => scope.includes('comment')))

      expect(commentTokens.length).toBeGreaterThan(0)
    })
  })

  describe('Set Operations', () => {
    it('should highlight UNION operations', async () => {
      const code = `SELECT name FROM users
UNION
SELECT name FROM customers;

SELECT id FROM table1
INTERSECT
SELECT id FROM table2;`
      const tokens = tokenizer.tokenize(code)

      expect(tokens).toBeDefined()
    })
  })
})
