/// <reference lib="deno.unstable" />

import { App, fsRoutes, staticFiles } from 'fresh';
import { pushPlugin } from '@/lib/push.ts';
import { State } from '@/app/types.ts';
import { stripePlugin } from '@/lib/stripe-plugin.ts';
import { userPlugin } from '@/lib/user-plugin.tsx';

export const app = new App<State>();

stripePlugin(app);
pushPlugin(app);
userPlugin(app);

app.use(staticFiles());

await fsRoutes(app, {
  dir: './',
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) await app.listen();
