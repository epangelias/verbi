/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code is well-structured and easy to read, with clear variable names and concise logic.

However, there is a potential security issue with the `updateUser` function, which updates the user's tokens.
It's not clear what kind of tokens these are or how they're validated, but it's possible for an attacker to manipulate the tokens.

It would be better to validate the user's tokens and subscriptions before updating them.

Additionally, the `saveMessages` function is called on multiple events (onError, onCancel, onEnd), which could lead to unexpected behavior.
It might be better to separate these events and handle them individually.

The code could benefit from some error handling and logging, especially when throwing `HttpError`s.

The imports are well-organized, but it would be good to consider reorganizing them alphabetically for better readability.

The `handler` function is quite long and does multiple tasks; it might be better to break it down into smaller, more focused functions for better maintainability.

That's it!
*/

import { define } from '@/lib/utils.ts';
import { AIMessage } from '@/lib/types.ts';
import { StreamAI } from '@/lib/stream-ai.ts';
import { setUserData } from '@/lib/user-data.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { getChatData, setChatData } from '@/app/chat-data.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    const user = ctx.state.user;

    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    if (!(user.tokens >= 0 || user.isSubscribed)) throw new HttpError(STATUS_CODE.Unauthorized);
    const chatData = await getChatData(user);
    if (!chatData) throw new HttpError(STATUS_CODE.NotFound);

    const saveMessages = async (messages: AIMessage[]) => {
      await setChatData({ ...chatData, messages });
      await setUserData({ ...user, tokens: user.tokens - 1 });
    };

    return StreamAI({
      messages: chatData.messages,
      onError: saveMessages,
      onCancel: saveMessages,
      onEnd: saveMessages,
    });
  },
});
