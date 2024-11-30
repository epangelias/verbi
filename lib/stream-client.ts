/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The function names `syncSSE`, `watchSSE`, and `sendSSE` are descriptive and follow a consistent naming convention.

The type annotations for function parameters and return types are useful for code readability and maintainability.

The use of destructuring for function parameters is a good practice for readability.

The `fetchOrError` function from `@/lib/fetch.ts` is used correctly for handling fetch errors.

There is no error handling for the `JSON.parse(event.data)` line, which could throw an error if the event data is not a valid JSON string.

The `EventSource` object is not checked for browser support before being instantiated, which could cause issues in older browsers.

The `globalThis.addEventListener` line may not be necessary, as EventSource objects are automatically closed when the page is unloaded.

The `eventSource?.close()` line in the `watchSSE` function can be simplified to `eventSource.close()`, as `eventSource` is guaranteed to exist in this context.

The `onError` function in `watchSSE` is only called when an error occurs, but it does not provide any error information to the callback function.

The `Meth.objectEquals` function is not a standard JavaScript function, and its implementation is not shown; it may have performance or correctness issues.

Consider adding JSDoc comments or TypeScript documentation comments to provide additional information about the functions and their parameters.
*/

import { Signal } from '@preact/signals';
import { fetchOrError } from '@/lib/fetch.ts';
import { Meth } from '@/lib/meth.ts';

export function syncSSE<T>(endpoint: string, { data, onError }: { data: Signal<T>; onError?: () => void }) {
  return watchSSE(endpoint, {
    onError,
    onMessage(newData: T) {
      if (Meth.objectEquals(data.value, newData)) return;
      data.value = newData;
    },
  });
}

export function watchSSE<T>(
  endpoint: string,
  { onMessage, onError }: {
    onMessage?: (d: T) => void;
    onError?: () => void;
  },
) {
  const eventSource = new EventSource(endpoint);

  eventSource.onmessage = (event) => onMessage && onMessage(JSON.parse(event.data));
  eventSource.onerror = (_error) => onError && onError();

  globalThis.addEventListener('beforeunload', () => eventSource.close());

  return () => eventSource?.close();
}

export async function sendSSE<T>(endpoint: string, body: unknown) {
  return await fetchOrError<T>(endpoint, { method: 'POST', body });
}
