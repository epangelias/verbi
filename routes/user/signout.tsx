import { define } from '@/lib/utils.ts';
import { deleteCookie, getCookies } from 'jsr:@std/http/cookie';
import { db } from '@/lib/utils.ts';

export const handler = define.handlers({
  GET: async (ctx) => {
    const res = ctx.redirect('/');
    deleteCookie(res.headers, 'auth', { path: '/' });
    const { auth } = getCookies(ctx.req.headers);
    if (auth) await db.delete(['usersByAuth', auth]);
    return res;
  },
});
