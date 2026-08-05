/**
 * Tokens as flat arrays rather than as objects.
 *
 * An object per token is fine for a file and ruinous for a hundred thousand
 * lines. Each `{ type, content }` is an allocation, a shape, and - if the
 * tokens are going through `postMessage` - a structured clone that walks the
 * whole graph. A 100k line file at six tokens a line is 600,000 objects to
 * allocate, clone, and then collect.
 *
 * The flat form is one string per line plus two typed arrays: where each token
 * ends, and what class it is. Typed arrays clone as a memcpy and can be
 * transferred outright, so the cost of moving a tokenized file between threads
 * stops scaling with the token count and starts scaling with the byte count.
 *
 * The object API stays. `unpackLines` is the wrapper, and every consumer that
 * does not care about the difference goes on using it.
 */

/** One line's tokens, in the shape most consumers want. */
export interface FlatToken {
  type: string
  content: string
}

export interface FlatTokenLines {
  /** The source line, one entry per line. The tokens are slices of these. */
  text: string[]
  /**
   * Where each line's tokens begin in `ends` and `types`.
   *
   * One entry per line plus a final entry for the total, so the tokens of line
   * `n` are `starts[n]` up to `starts[n + 1]` with no special case for the
   * last line.
   */
  starts: Uint32Array
  /** The end offset of each token within its own line. */
  ends: Uint32Array
  /** The class of each token, as an index into `classes`. */
  types: Uint16Array
  /** The class names, indexed by `types`. Usually a dozen entries. */
  classes: string[]
}

/**
 * The typed arrays, for `postMessage`'s transfer list.
 *
 * Transferring rather than copying is the difference between a memcpy and a
 * move, and on a large file it is most of the cost of the hop. The arrays are
 * unusable in the sending thread afterwards, which is exactly right: they have
 * been handed over.
 */
export function transferable(flat: FlatTokenLines): ArrayBuffer[] {
  return [flat.starts.buffer as ArrayBuffer, flat.ends.buffer as ArrayBuffer, flat.types.buffer as ArrayBuffer]
}

/**
 * Pack tokenized lines into the flat form.
 *
 * The token *contents* are not stored: they are slices of the line, so keeping
 * both would double the text. Only the boundaries are kept, and `unpackLines`
 * cuts the line back up. That is only sound if the tokens reproduce the line
 * exactly, which is the one property this whole library rests on - so it is
 * checked here rather than assumed, and a line whose tokens do not reproduce it
 * is packed as one plain token instead of being silently corrupted.
 */
export function packLines(lines: readonly (readonly FlatToken[])[], sources?: readonly string[]): FlatTokenLines {
  const text: string[] = []
  const starts = new Uint32Array(lines.length + 1)
  const classes: string[] = []
  const classIds = new Map<string, number>()

  const classId = (type: string): number => {
    const existing = classIds.get(type)
    if (existing !== undefined)
      return existing

    const id = classes.length
    classes.push(type)
    classIds.set(type, id)
    return id
  }

  let total = 0
  for (const tokens of lines)
    total += tokens.length

  const ends = new Uint32Array(total)
  const types = new Uint16Array(total)

  let at = 0
  for (const [index, tokens] of lines.entries()) {
    starts[index] = at

    const joined = tokens.map(token => token.content).join('')
    const source = sources?.[index] ?? joined

    // The contract, checked. A token stream that does not reproduce its line
    // cannot be stored as offsets into that line, and storing it anyway would
    // render text the file does not contain.
    if (joined !== source) {
      text.push(source)
      ends[at] = source.length
      types[at] = classId('text')
      at += 1
      continue
    }

    text.push(source)

    let offset = 0
    for (const token of tokens) {
      offset += token.content.length
      ends[at] = offset
      types[at] = classId(token.type)
      at += 1
    }
  }

  starts[lines.length] = at

  // Trimmed, because the mismatch path above writes one token where the line
  // had several and the arrays would otherwise carry the difference as zeroes.
  return {
    text,
    starts,
    ends: ends.subarray(0, at),
    types: types.subarray(0, at),
    classes,
  }
}

/** Cut the flat form back into tokens. The inverse of `packLines`. */
export function unpackLines(flat: FlatTokenLines): FlatToken[][] {
  const lines: FlatToken[][] = []

  for (let index = 0; index < flat.text.length; index++) {
    const source = flat.text[index]!
    const from = flat.starts[index]!
    const to = flat.starts[index + 1]!
    const tokens: FlatToken[] = []

    let offset = 0
    for (let at = from; at < to; at++) {
      const end = flat.ends[at]!
      tokens.push({ type: flat.classes[flat.types[at]!] ?? 'text', content: source.slice(offset, end) })
      offset = end
    }

    lines.push(tokens)
  }

  return lines
}

/**
 * How much source is worth tokenizing.
 *
 * Above this, the file renders as plain text. A minified bundle on one line is
 * the case: it is a hundred thousand characters of no interest to a reader,
 * tokenizing it is quadratic in some grammars, and the reader would not be able
 * to read the colours anyway. The diff or the file is still shown - the colours
 * are the optional part.
 *
 * In the library rather than in each consumer, so every one of them gives up at
 * the same point instead of inventing its own ceiling or, more often, not
 * having one.
 */
export const TOKENIZE_CEILING_CHARS = 100_000

/** Whether a source is over the ceiling and should render plain. */
export function overTokenizeCeiling(source: string | readonly string[], ceiling = TOKENIZE_CEILING_CHARS): boolean {
  if (typeof source === 'string')
    return source.length > ceiling

  let total = 0
  for (const line of source) {
    total += line.length + 1
    // Stops early on a big file rather than measuring all of it, which matters
    // when the answer is going to be "too big" anyway.
    if (total > ceiling)
      return true
  }

  return false
}

/** Every line as one plain token. The result over the ceiling, and on failure. */
export function plainLines(lines: readonly string[]): FlatToken[][] {
  return lines.map(line => [{ type: 'text', content: line }])
}
