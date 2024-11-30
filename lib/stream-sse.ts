/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code appears to be well-structured and follows good practices.

For security, it's good that the code uses `try-catch` blocks to handle errors when enqueuing data to the stream controller.

Performance-wise, the use of async/await and for-await-of loops is efficient for handling asynchronous operations.

Code style is consistent and follows common TypeScript conventions.

In terms of best practices, the function parameters are well-defined in an interface, making it clear what options are available.

For maintainability, the function is modular and easy to understand, with clear separation of concerns.

One minor suggestion for readability is to consider adding more whitespace between blocks of code for easier reading.

No refactoring suggestions at this time.
*/

import { db } from '@/lib/utils.ts';

interface Options {
  watchKey?: Deno.KvKey;
  onChunk?: (send: (s: unknown) => void) => void;
  onCancel?: () => void;
}

export function StreamSSR({ onChunk, onCancel, watchKey }: Options) {
  const stream = new ReadableStream({
    start: async (controller) => {
      const send = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(new TextEncoder().encode(message));
        } catch (e) {
          controller.error(e);
        }
      };

      if (onChunk) onChunk(send);

      if (watchKey) {
        for await (const event of db.watch([watchKey])) {
          if (event[0].versionstamp === null) continue;
          send(event[0].value);
        }
      }
    },
    cancel: onCancel,
  });

  const headers = new Headers({ 'Content-Type': 'text/event-stream' });
  return new Response(stream, { headers });
}
