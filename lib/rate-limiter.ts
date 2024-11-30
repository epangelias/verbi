/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code is well-structured and easy to understand.

There is no obvious security issue in the code.

The performance issue is the use of setInterval which may lead to memory leaks if not cleared properly.

The code style is consistent and follows best practices.

The constructor's default parameters are a good use of optional function parameters.

It would be good to add a method to reset the requests counter to 0, instead of relying on the interval.

The `Deno.env.get('GITHUB_ACTIONS')` condition is unclear, it would be better to move this condition to a more relevant place or add a comment explaining why it's necessary.

The `request` method could be renamed to `makeRequest` for better clarity.

The class could be refactored to use a separate timer instance instead of relying on setInterval.

It would be beneficial to add type annotations for the class properties.
*/

import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';

export class RateLimiter {
  requests = 0;
  maxRequests: number;
  interval: number;

  constructor({ maxRequests, interval } = { maxRequests: 10, interval: 60 }) {
    this.maxRequests = maxRequests;
    this.interval = interval * 1000;

    if (Deno.env.get('GITHUB_ACTIONS') === 'true') return;

    setInterval(() => this.requests = 0, this.interval);
  }

  request() {
    if (this.requests >= this.maxRequests) {
      throw new HttpError(
        STATUS_CODE.TooManyRequests,
        `Rate limit exceeded. Try again in ${this.interval / 1000} seconds.`,
      );
    }
    this.requests++;
  }
}
