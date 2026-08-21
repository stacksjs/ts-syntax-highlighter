/**
 * The worker entry.
 *
 * Tokenizing is the expensive half of highlighting and it is pure CPU, so it is
 * the classic thing to move off whichever thread is trying to stay responsive -
 * a browser's main thread, or a server's event loop. Every consumer that wants
 * that has so far had to write this file themselves, which means each of them
 * invents its own protocol, its own cancellation, and its own answer to what
 * happens when a grammar is missing.
 *
 * The protocol is four messages and deliberately small:
 *
 *     → { id, type: 'tokenize', language, lines }
 *     ← { id, type: 'tokens', flat }        the flat form, arrays transferred
 *     ← { id, type: 'plain' }               over the ceiling, or no grammar
 *     ← { id, type: 'error', message }
 *     → { id, type: 'cancel' }              drop it if it has not started
 *
 * Cancellation is best-effort and says so. A request already being tokenized
 * runs to completion, because the tokenizer is a tight loop with no yield
 * points in it and adding some would cost more than the cancellation saves. The
 * case cancellation is for is a reader scrolling past forty queued files, and
 * for that a queue check is enough.
 */

import type { FlatTokenLines } from './flat-tokens'
import { FastTokenizer } from './fast-tokenizer'
import { overTokenizeCeiling, packLines, transferable } from './flat-tokens'
import { resolveGrammar } from './lazy'

export interface TokenizeRequest {
  id: number
  type: 'tokenize'
  language: string
  lines: string[]
  /** Overrides the library ceiling for this request. */
  ceiling?: number
}

export interface CancelRequest {
  id: number
  type: 'cancel'
}

export type WorkerRequest = TokenizeRequest | CancelRequest

export type WorkerResponse =
  | { id: number, type: 'tokens', flat: FlatTokenLines }
  | { id: number, type: 'plain' }
  | { id: number, type: 'error', message: string }

/**
 * Handle one request, without knowing what it is running inside.
 *
 * Separated from the message plumbing so it can be tested directly: a test for
 * "a file over the ceiling comes back plain" should not have to start a worker
 * to find out.
 */
export async function handleTokenize(request: TokenizeRequest): Promise<WorkerResponse> {
  if (overTokenizeCeiling(request.lines, request.ceiling))
    return { id: request.id, type: 'plain' }

  try {
    const grammar = await grammarFor(request.language)

    if (!grammar)
      return { id: request.id, type: 'plain' }

    const tokenized = new FastTokenizer(grammar).tokenize(request.lines.join('\n'))

    // A tokenizer that returns a different number of lines would shift every
    // line number the consumer anchors on, so the plain answer is the safe one.
    if (tokenized.length !== request.lines.length)
      return { id: request.id, type: 'plain' }

    const flat = packLines(
      tokenized.map(line => line.tokens.map(token => ({ type: token.type, content: token.content }))),
      request.lines,
    )

    return { id: request.id, type: 'tokens', flat }
  }
  catch (error) {
    return { id: request.id, type: 'error', message: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * One grammar per language, loaded on the first request that needs it.
 *
 * This used to build a `Highlighter`, which imports the eager grammar barrel -
 * so a worker asked for TypeScript downloaded all forty-eight grammars to
 * answer, and every consumer bundling this entry shipped them. Measured with
 * `packages/benchmarks/src/bundle-size.ts`, which exists because that number is
 * what decides whether the browser path is worth having at all.
 *
 * `resolveGrammar` reads the generated catalogue and dynamically imports one
 * grammar, which every bundler splits into its own chunk. Its own cache makes a
 * second request for the same language free, and two requests arriving together
 * share one import rather than racing.
 *
 * A language with no grammar answers `undefined`, and the caller sends `plain`.
 * That is the same answer a file over the ceiling gets, and it is the right one:
 * the reader gets the code, uncoloured, rather than an error where a diff
 * should be.
 */
function grammarFor(language: string): ReturnType<typeof resolveGrammar> {
  return resolveGrammar(language)
}

/**
 * Wire the protocol to a worker scope.
 *
 * Takes the scope rather than reaching for a global, so this is testable and so
 * the same function serves a browser `Worker`, a Bun worker, and a `MessagePort`
 * without a branch for each.
 */
export function serveTokenizer(scope: {
  addEventListener: (type: 'message', listener: (event: { data: unknown }) => void) => void
  postMessage: (message: unknown, transfer?: unknown[]) => void
}): void {
  /** Requests received and not yet started. Cancellation empties this. */
  const queued = new Set<number>()

  scope.addEventListener('message', (event) => {
    const request = event.data as WorkerRequest
    if (request == null || typeof request !== 'object')
      return

    if (request.type === 'cancel') {
      queued.delete(request.id)
      return
    }

    if (request.type !== 'tokenize')
      return

    queued.add(request.id)

    void handleTokenize(request).then((response) => {
      // Cancelled while it was being worked on. The work is done and thrown
      // away, which is the honest cost of not being able to interrupt a tight
      // loop - but the *reply* is dropped, so the caller is not handed a result
      // for something it has stopped caring about.
      if (!queued.delete(request.id))
        return

      if (response.type === 'tokens')
        scope.postMessage(response, transferable(response.flat))
      else
        scope.postMessage(response)
    })
  })
}

/**
 * There is deliberately no auto-start here.
 *
 * The first version of this file ended with a guard that called
 * `serveTokenizer(self)` when `self` looked like a worker scope. In a browser
 * that is fine. In Bun and Node, `self`, `addEventListener` and `postMessage`
 * all exist on the **main** thread as well - so merely importing this package
 * registered a message listener on the main thread, which kept its event loop
 * alive and hung every process that imported the library. A benchmark that had
 * been finishing in forty seconds simply never returned.
 *
 * A worker entry is two lines and says what it is:
 *
 *     import { serveTokenizer } from 'ts-syntax-highlighter'
 *     serveTokenizer(self)
 *
 * Explicit, and impossible to trigger by accident.
 */
