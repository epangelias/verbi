import OpenAI from 'npm:openai';
import { define } from '../../lib/utils.ts';
import { generateChatCompletion } from '@/lib/oai.ts';
import { HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import { setUserData } from '@/lib/user-data.ts';

export const handler = define.handlers({
  async POST(ctx) {
    const user = ctx.state.user;
    if (!user) throw new HttpError(STATUS_CODE.Unauthorized);
    if (!(user.tokens > 0 || user.isSubscribed)) throw new HttpError(STATUS_CODE.PaymentRequired);
    const { prompt } = await ctx.req.json();
    const completion = await generateChatCompletion(undefined, [{ role: 'system', content: prompt }]);
    await setUserData({ ...user, tokens: user.tokens - 1 });
    return new Response(completion.choices[0].message.content);
  },
});
