/* eslint-disable no-console */
/**
 * Throughput, in MB/s, per language and per tokenizer.
 *
 * The number this project is actually judged on. A "12ms for this fixture"
 * figure cannot be compared against anything - not the same file next month,
 * not a different language, not the other tokenizer - because it folds the size
 * of the input into the result. Megabytes per second divides it back out.
 *
 * ## Why both tokenizers, side by side
 *
 * `Tokenizer` walks the grammar's rules and carries a scope stack, which is
 * what makes nested constructs and multi-line strings come out right.
 * `FastTokenizer` classifies bytes through a lookup table and does not. The
 * library ships both and the interesting question is not which is faster - it
 * is *how much* faster, because that is the price of correctness and nobody had
 * measured it. Running them over the same bytes in the same process is the only
 * way that number means anything.
 *
 * ## Reading the output
 *
 * Every row is one language against one tokenizer. The corpus is generated
 * rather than fetched so the number is reproducible on a machine with no
 * network, and each input is padded past a megabyte so a run is long enough to
 * escape timer noise and short enough to sit in cache - which is the state a
 * highlighter runs in when a page has many snippets.
 */

import process from 'node:process'
import { FastTokenizer } from '../../ts-syntax-highlighter/src/fast-tokenizer'
import { getLanguage } from '../../ts-syntax-highlighter/src/grammars'
import { Tokenizer } from '../../ts-syntax-highlighter/src/tokenizer'

/** A megabyte, near enough, of each language. */
const TARGET_BYTES = 1024 * 1024

/**
 * The samples, chosen for the shapes that cost a tokenizer differently.
 *
 * Strings and comments are what a scope stack is *for* - they suspend the
 * ordinary rules until they close - so a corpus of nothing but keywords would
 * flatter the stack-carrying tokenizer by never asking it to do its job.
 */
const SAMPLES: Array<{ language: string, code: string }> = [
  {
    language: 'typescript',
    code: `
export interface Cache<T> { get: (key: string) => T | undefined }

/** A comment, because comments suspend the rules. */
export class Store<T> implements Cache<T> {
  private held = new Map<string, T>()

  get(key: string): T | undefined {
    // A string with a brace { and a quote ' inside it.
    return this.held.get(\`\${key}:scoped\`)
  }
}
`,
  },
  {
    language: 'javascript',
    code: `
const rows = items.map((item, index) => ({ ...item, index }))

/* A block comment
   over several lines. */
async function load(url) {
  const answer = await fetch(url, { headers: { accept: 'application/json' } })
  if (!answer.ok) throw new Error(\`refused: \${answer.status}\`)
  return answer.json()
}
`,
  },
  {
    language: 'python',
    code: `
from typing import Optional

class Store:
    """A docstring, which is a string that spans lines."""

    def get(self, key: str) -> Optional[str]:
        # A comment with a quote ' in it
        return self._held.get(f"{key}:scoped")
`,
  },
  {
    language: 'rust',
    code: `
use std::collections::HashMap;

/// A doc comment.
pub struct Store<T> { held: HashMap<String, T> }

impl<T> Store<T> {
    pub fn get(&self, key: &str) -> Option<&T> {
        self.held.get(&format!("{}:scoped", key))
    }
}
`,
  },
  {
    language: 'css',
    code: `
:root { --ink: #08201f; --paper: #f7f7f5; }

/* A comment */
.card { color: var(--ink); background: var(--paper); border-radius: 11px; }
.card:hover { box-shadow: 0 1px 2px rgb(0 0 0 / 12%); }
`,
  },
  {
    language: 'json',
    code: `{ "name": "store", "version": "1.0.0", "keywords": ["cache", "map"], "private": true }`,
  },
]

/** Repeat a sample until it is about a megabyte. */
function corpusFor(code: string): string {
  const times = Math.max(1, Math.ceil(TARGET_BYTES / Math.max(1, code.length)))

  return code.repeat(times)
}

interface Row {
  language: string
  tokenizer: 'Tokenizer' | 'FastTokenizer'
  megabytes: number
  ms: number
  mbPerSecond: number
  tokens: number
}

/** Time one tokenizer over one corpus, after a warm-up pass. */
function measure(language: string, kind: Row['tokenizer'], code: string): Row | null {
  const found = getLanguage(language)

  if (!found)
    return null

  const bytes = new TextEncoder().encode(code).byteLength
  const megabytes = bytes / 1024 / 1024

  const run = (): number => {
    if (kind === 'Tokenizer')
      return new Tokenizer(found.grammar).tokenize(code).length

    return new FastTokenizer(found.grammar).tokenize(code).length
  }

  // Once to build whatever the tokenizer builds lazily, then timed. Without
  // this the first language measured pays for everybody's warm-up.
  run()

  const started = Bun.nanoseconds()
  const tokens = run()
  const ms = (Bun.nanoseconds() - started) / 1_000_000

  return { language, tokenizer: kind, megabytes, ms, mbPerSecond: megabytes / (ms / 1000), tokens }
}

const only = process.argv.find(argument => argument.startsWith('--language='))?.split('=')[1]
const rows: Row[] = []

for (const sample of SAMPLES) {
  if (only && sample.language !== only)
    continue

  const code = corpusFor(sample.code)

  for (const kind of ['Tokenizer', 'FastTokenizer'] as const) {
    const row = measure(sample.language, kind, code)

    if (row)
      rows.push(row)
  }
}

if (rows.length === 0) {
  console.error(only ? `No sample for ${only}.` : 'No samples ran.')
  process.exit(1)
}

console.log('')
console.log('  language     tokenizer          MB/s       ms      tokens')
console.log('  ' + '-'.repeat(58))

for (const row of rows) {
  console.log(
    `  ${row.language.padEnd(12)} ${row.tokenizer.padEnd(16)} ${row.mbPerSecond.toFixed(1).padStart(7)} ${row.ms.toFixed(0).padStart(8)} ${String(row.tokens).padStart(11)}`,
  )
}

// The ratio is the point of running both: it is the price of the scope stack,
// per language, and it is what decides where each tokenizer belongs.
console.log('')
console.log('  language     FastTokenizer is')
console.log('  ' + '-'.repeat(38))

for (const sample of SAMPLES) {
  const slow = rows.find(row => row.language === sample.language && row.tokenizer === 'Tokenizer')
  const fast = rows.find(row => row.language === sample.language && row.tokenizer === 'FastTokenizer')

  if (slow && fast)
    console.log(`  ${sample.language.padEnd(12)} ${(fast.mbPerSecond / slow.mbPerSecond).toFixed(1)}x faster, and carries no scope stack`)
}

console.log('')
