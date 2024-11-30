import { State } from '@/app/types.ts';
import { App } from 'fresh';
import { loadUserToContext } from '@/lib/user-data.ts';
import { define } from '@/lib/utils.ts';

export function userPlugin(app: App<State>) {
  app.use(async (ctx) => {
    // Skip static assets
    if (!ctx.req.url.includes('?__frsh_c=') && !ctx.req.url.includes('/_fresh')) {
      await loadUserToContext(ctx);
    }
    return await ctx.next();
  });
}

export default define.page(() => <p>hi</p>);
