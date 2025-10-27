import type { Grammar } from '../types'

export const sqlGrammar: Grammar = {
  name: 'SQL',
  scopeName: 'source.sql',
  keywords: {
    // DML
    'SELECT': 'keyword.other.dml.sql',
    'INSERT': 'keyword.other.dml.sql',
    'UPDATE': 'keyword.other.dml.sql',
    'DELETE': 'keyword.other.dml.sql',
    'MERGE': 'keyword.other.dml.sql',
    // DDL
    'CREATE': 'keyword.other.ddl.sql',
    'ALTER': 'keyword.other.ddl.sql',
    'DROP': 'keyword.other.ddl.sql',
    'TRUNCATE': 'keyword.other.ddl.sql',
    'RENAME': 'keyword.other.ddl.sql',
    // Clauses
    'FROM': 'keyword.other.sql',
    'WHERE': 'keyword.other.sql',
    'JOIN': 'keyword.other.sql',
    'INNER': 'keyword.other.sql',
    'LEFT': 'keyword.other.sql',
    'RIGHT': 'keyword.other.sql',
    'FULL': 'keyword.other.sql',
    'OUTER': 'keyword.other.sql',
    'CROSS': 'keyword.other.sql',
    'ON': 'keyword.other.sql',
    'USING': 'keyword.other.sql',
    'GROUP': 'keyword.other.sql',
    'BY': 'keyword.other.sql',
    'HAVING': 'keyword.other.sql',
    'ORDER': 'keyword.other.sql',
    'ASC': 'keyword.other.sql',
    'DESC': 'keyword.other.sql',
    'LIMIT': 'keyword.other.sql',
    'OFFSET': 'keyword.other.sql',
    'FETCH': 'keyword.other.sql',
    'DISTINCT': 'keyword.other.sql',
    'ALL': 'keyword.other.sql',
    'AS': 'keyword.other.sql',
    'INTO': 'keyword.other.sql',
    'VALUES': 'keyword.other.sql',
    'SET': 'keyword.other.sql',
    // Logical
    'AND': 'keyword.operator.logical.sql',
    'OR': 'keyword.operator.logical.sql',
    'NOT': 'keyword.operator.logical.sql',
    'IN': 'keyword.operator.logical.sql',
    'BETWEEN': 'keyword.operator.logical.sql',
    'LIKE': 'keyword.operator.logical.sql',
    'IS': 'keyword.operator.logical.sql',
    'NULL': 'constant.language.sql',
    'TRUE': 'constant.language.sql',
    'FALSE': 'constant.language.sql',
    // Aggregate
    'COUNT': 'support.function.aggregate.sql',
    'SUM': 'support.function.aggregate.sql',
    'AVG': 'support.function.aggregate.sql',
    'MIN': 'support.function.aggregate.sql',
    'MAX': 'support.function.aggregate.sql',
    // Types
    'INT': 'storage.type.sql',
    'INTEGER': 'storage.type.sql',
    'BIGINT': 'storage.type.sql',
    'SMALLINT': 'storage.type.sql',
    'TINYINT': 'storage.type.sql',
    'DECIMAL': 'storage.type.sql',
    'NUMERIC': 'storage.type.sql',
    'FLOAT': 'storage.type.sql',
    'REAL': 'storage.type.sql',
    'DOUBLE': 'storage.type.sql',
    'VARCHAR': 'storage.type.sql',
    'CHAR': 'storage.type.sql',
    'TEXT': 'storage.type.sql',
    'DATE': 'storage.type.sql',
    'TIME': 'storage.type.sql',
    'TIMESTAMP': 'storage.type.sql',
    'DATETIME': 'storage.type.sql',
    'BOOLEAN': 'storage.type.sql',
    'BOOL': 'storage.type.sql',
    'BLOB': 'storage.type.sql',
    // Constraints
    'PRIMARY': 'keyword.other.sql',
    'KEY': 'keyword.other.sql',
    'FOREIGN': 'keyword.other.sql',
    'REFERENCES': 'keyword.other.sql',
    'UNIQUE': 'keyword.other.sql',
    'CHECK': 'keyword.other.sql',
    'DEFAULT': 'keyword.other.sql',
    'AUTO_INCREMENT': 'keyword.other.sql',
    // Other
    'TABLE': 'keyword.other.sql',
    'VIEW': 'keyword.other.sql',
    'INDEX': 'keyword.other.sql',
    'DATABASE': 'keyword.other.sql',
    'SCHEMA': 'keyword.other.sql',
    'IF': 'keyword.control.sql',
    'EXISTS': 'keyword.other.sql',
    'CASCADE': 'keyword.other.sql',
    'CONSTRAINT': 'keyword.other.sql',
    'UNION': 'keyword.other.sql',
    'INTERSECT': 'keyword.other.sql',
    'EXCEPT': 'keyword.other.sql',
    'CASE': 'keyword.control.sql',
    'WHEN': 'keyword.control.sql',
    'THEN': 'keyword.control.sql',
    'ELSE': 'keyword.control.sql',
    'END': 'keyword.control.sql',
  },
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#keywords' },
    { include: '#numbers' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-dash.sql',
          match: '--.*$',
        },
        {
          name: 'comment.line.number-sign.sql',
          match: '#.*$',
        },
        {
          name: 'comment.block.sql',
          begin: '\\/\\*',
          end: '\\*\\/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.single.sql',
          begin: "'",
          end: "'",
          patterns: [
            {
              name: 'constant.character.escape.sql',
              match: "''",
            },
          ],
        },
        {
          name: 'string.quoted.double.sql',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.sql',
              match: '""',
            },
          ],
        },
      ],
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.other.dml.sql',
          match: '\\b(?i:SELECT|INSERT|UPDATE|DELETE|MERGE)\\b',
        },
        {
          name: 'keyword.other.ddl.sql',
          match: '\\b(?i:CREATE|ALTER|DROP|TRUNCATE|RENAME)\\b',
        },
        {
          name: 'keyword.other.sql',
          match: '\\b(?i:FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|USING|GROUP|BY|HAVING|ORDER|ASC|DESC|LIMIT|OFFSET|FETCH|DISTINCT|ALL|AS|INTO|VALUES|SET|TABLE|VIEW|INDEX|DATABASE|SCHEMA|EXISTS|CASCADE|CONSTRAINT|UNION|INTERSECT|EXCEPT|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|AUTO_INCREMENT)\\b',
        },
        {
          name: 'keyword.operator.logical.sql',
          match: '\\b(?i:AND|OR|NOT|IN|BETWEEN|LIKE|IS)\\b',
        },
        {
          name: 'keyword.control.sql',
          match: '\\b(?i:IF|CASE|WHEN|THEN|ELSE|END)\\b',
        },
        {
          name: 'constant.language.sql',
          match: '\\b(?i:NULL|TRUE|FALSE)\\b',
        },
        {
          name: 'support.function.aggregate.sql',
          match: '\\b(?i:COUNT|SUM|AVG|MIN|MAX)\\b',
        },
        {
          name: 'storage.type.sql',
          match: '\\b(?i:INT|INTEGER|BIGINT|SMALLINT|TINYINT|DECIMAL|NUMERIC|FLOAT|REAL|DOUBLE|VARCHAR|CHAR|TEXT|DATE|TIME|TIMESTAMP|DATETIME|BOOLEAN|BOOL|BLOB)\\b',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          name: 'constant.numeric.sql',
          match: '\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b',
        },
      ],
    },
    operators: {
      patterns: [
        {
          name: 'keyword.operator.sql',
          match: '(=|!=|<>|<|>|<=|>=|\\+|\\-|\\*|/|%|\\|\\|)',
        },
      ],
    },
  },
}
