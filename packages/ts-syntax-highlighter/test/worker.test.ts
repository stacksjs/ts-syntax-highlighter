/**
 * The worker protocol.
 *
 * Tested against `handleTokenize` and a fake scope rather than by starting a
 * real worker: what is worth testing here is the protocol's decisions - when a
 * request comes back plain, what cancellation actually cancels - and none of
 * those need a thread to be exercised. Starting one would only make the tests
 * slow and flaky enough that nobody trusts them.
 */

import { describe, expect, it } from 'bun:test'
import { unpackLines } from '../src/flat-tokens'
import { handleTokenize, serveTokenizer, type WorkerRequest, type WorkerResponse } from '../src/worker'

describe('handleTokenize', () => {
  it('gives back tokens that reproduce every line exactly', async () => {
    const lines = ['const a = 1', '// a comment', '']
    const response = await handleTokenize({ id: 1, type: 'tokenize', language: 'typescript', lines })

    expect(response.type).toBe('tokens')
    if (response.type !== 'tokens')
      return

    const unpacked = unpackLines(response.flat)
    expect(unpacked.map(tokens => tokens.map(token => token.content).join(''))).toEqual(lines)
  })

  it('answers with the id it was asked with', async () => {
    const response = await handleTokenize({ id: 42, type: 'tokenize', language: 'typescript', lines: ['a'] })

    expect(response.id).toBe(42)
  })

  /**
   * The reader gets the file; the colours are the optional part. A minified
   * bundle is one line of a hundred thousand characters, of no interest to
   * read, and quadratic in some grammars.
   */
  it('answers plain rather than tokenizing something over the ceiling', async () => {
    const response = await handleTokenize({
      id: 1,
      type: 'tokenize',
      language: 'typescript',
      lines: ['a'.repeat(200_000)],
    })

    expect(response.type).toBe('plain')
  })

  it('takes a ceiling from the request', async () => {
    const request = { id: 1, type: 'tokenize' as const, language: 'typescript', lines: ['const a = 1'] }

    expect((await handleTokenize({ ...request, ceiling: 4 })).type).toBe('plain')
    expect((await handleTokenize({ ...request, ceiling: 4000 })).type).toBe('tokens')
  })

  it('answers plain for a language it has no grammar for', async () => {
    const response = await handleTokenize({ id: 1, type: 'tokenize', language: 'not-a-language', lines: ['a'] })

    expect(response.type === 'plain' || response.type === 'error').toBe(true)
  })
})

/** A scope that records what was posted, standing in for a worker's global. */
function fakeScope() {
  const posted: WorkerResponse[] = []
  let listener: ((event: { data: unknown }) => void) | null = null

  return {
    posted,
    send: (request: WorkerRequest) => listener?.({ data: request }),
    scope: {
      addEventListener: (_type: 'message', handler: (event: { data: unknown }) => void) => { listener = handler },
      postMessage: (message: unknown) => { posted.push(message as WorkerResponse) },
    },
  }
}

/** Let the handler's promise settle. */
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

describe('serveTokenizer', () => {
  it('answers a tokenize request', async () => {
    const harness = fakeScope()
    serveTokenizer(harness.scope)

    harness.send({ id: 1, type: 'tokenize', language: 'typescript', lines: ['const a = 1'] })
    await settle()

    expect(harness.posted).toHaveLength(1)
    expect(harness.posted[0]).toMatchObject({ id: 1, type: 'tokens' })
  })

  /**
   * The case cancellation exists for: a reader scrolls past forty queued files
   * and none of them are worth tokenizing any more. Best-effort by design - a
   * request already in the tokenizer runs to completion, because the tokenizer
   * is a tight loop and adding yield points to it would cost more than the
   * cancellation saves - but the reply is dropped either way, so the caller is
   * never handed a result for something it stopped caring about.
   */
  it('drops the reply for a request that was cancelled', async () => {
    const harness = fakeScope()
    serveTokenizer(harness.scope)

    harness.send({ id: 1, type: 'tokenize', language: 'typescript', lines: ['const a = 1'] })
    harness.send({ id: 1, type: 'cancel' })
    await settle()

    expect(harness.posted).toHaveLength(0)
  })

  it('cancels only the request it names', async () => {
    const harness = fakeScope()
    serveTokenizer(harness.scope)

    harness.send({ id: 1, type: 'tokenize', language: 'typescript', lines: ['const a = 1'] })
    harness.send({ id: 2, type: 'tokenize', language: 'typescript', lines: ['const b = 2'] })
    harness.send({ id: 1, type: 'cancel' })
    await settle()

    expect(harness.posted).toHaveLength(1)
    expect(harness.posted[0]!.id).toBe(2)
  })

  it('ignores a message that is not part of the protocol', async () => {
    const harness = fakeScope()
    serveTokenizer(harness.scope)

    harness.send(null as never)
    harness.send({ id: 1, type: 'something-else' } as never)
    await settle()

    expect(harness.posted).toHaveLength(0)
  })
})
