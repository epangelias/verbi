/* AI GENERATED COMMENT
Here is my feedback:

The code is concise and easy to read.
It's good to see the use of early returns and a clear separation of concerns.
However, the error handling could be improved by providing more informative error messages.
The magic number 20 in the message slicing should be replaced with a named constant for better readability.
The function is not validating the `chatData` object before slicing its messages, which could lead to errors.
Consider adding input validation to ensure `chatData` is in the correct shape.
The `Response.json({})` return could be replaced with a more informative response body or a redirect.
The `db.set` operation is not being awaited properly, it should be awaited to ensure the operation is completed.
Consider adding a try-catch block around the `db.set` operation to handle any potential errors.
It's good to see the use of TypeScript, but consider adding more type annotations and interfaces to improve code readability.
*/

import { define } from '@/lib/utils.ts';
import { StreamSSR } from '@/lib/stream-sse.ts';
import { db } from '@/lib/utils.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { ChatData } from '@/app/types.ts';

export const handler = define.handlers(async (ctx) => {
  if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);

  const path = ['chat', ctx.state.user.id];

  if (ctx.req.method == 'GET') {
    return StreamSSR({ watchKey: path });
  } else if (ctx.req.method == 'POST') {
    const chatData = await ctx.req.json() as ChatData;

    // Remove old messages
    chatData.messages = chatData.messages.slice(-20);
    await db.set(path, chatData);
    return Response.json({});
  } else {
    throw new HttpError(STATUS_CODE.MethodNotAllowed);
  }
});
