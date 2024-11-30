/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code is generally well-structured and easy to read.

However, there are a few potential security issues:
The code does not perform any input validation on `ctx.state.user` or `ctx.state.auth`.
This could lead to potential security vulnerabilities if these values are not properly sanitized.

There are no obvious performance issues in this code.

In terms of code style, the code follows standard coding conventions.

One best practice that could be improved is the use of early returns:
Instead of throwing an error, consider using an early return to simplify the code flow.

The code is generally maintainable and readable.

One potential refactoring opportunity is to extract the logic inside the `for await` loop into a separate function.
This could improve the readability of the code.

That's all.
*/

import { define } from '@/lib/utils.ts';
import { StreamSSR } from '@/lib/stream-sse.ts';
import { db } from '@/lib/utils.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { stripUserData } from '@/app/user.ts';
import { UserData } from '@/app/types.ts';

export const handler = define.handlers((ctx) => {
  if (!ctx.state.user || !ctx.state.auth) throw new HttpError(STATUS_CODE.Unauthorized);

  const key: Deno.KvKey = ['users', ctx.state.user!.id];

  return StreamSSR({
    async onChunk(send) {
      for await (const [user] of db.watch<[UserData]>([key])) {
        if (user.versionstamp === null) continue;
        send(stripUserData(user.value));
      }
    },
  });
});
