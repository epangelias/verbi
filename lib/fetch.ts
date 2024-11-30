/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The function signature is clear and well-defined, specifying the type parameter and the optional init object.

The function correctly handles thebody and headers of the request based on the init object.

Error handling is done correctly by throwing an Error object with a descriptive message.

Consider adding a timeout to the fetch function to prevent the promise from hanging indefinitely.

The function assumes that the response will always be JSON, consider adding error handling for non-JSON responses.

The function does not handle network errors, consider adding a try-catch block to handle network errors.

The variable name "body" is used for both the init object property and the fetch options property, consider renaming one of them for clarity.

The function does not validate the url parameter, consider adding validation to ensure it is a valid URL.

Consider adding a max retry mechanism to handle transient errors.

The code style is generally good, but some lines are a bit long, consider breaking them up for readability.

Overall, the code is well-structured and easy to follow.
*/

export async function fetchOrError<T>(
  url: string,
  init?: { method: 'POST' | 'PATCH'; body: unknown } | { method: 'DELETE' },
): Promise<T> {
  const body = init
    ? {
      method: init.method,
      body: 'body' in init ? JSON.stringify(init.body) : undefined,
      headers: { 'content-type': 'application/json', 'accept': 'application/json' },
    }
    : undefined;

  const res = await fetch(url, body);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}: ${await res.text()}`);
  }
  return await res.json();
}
