/* AI GENERATED COMMENT
Here is my feedback on the provided code:

Security issues:
- The VAPID private key is stored as an environment variable, which may not be secure.
  Consider using a secrets manager or an encrypted storage.
- The `generateVAPIDKeys()` function is called when the VAPID keys are not set,
  but the generated keys are not stored or used anywhere.

Performance issues:
- In the `sendNotificationToUser` function, if a user has many subscriptions and
  an error occurs while sending a notification, the function will remove the
  subscription and update the user data, which could be inefficient.

Code style issues:
- The code uses both single and double quotes for strings,
  it's better to stick to a single convention throughout the code.
- Some lines are quite long and could be broken up for better readability.

Best practices:
- It's a good practice to handle errors more explicitly instead of catching
  a general `_e` error. This can help to debug issues more efficiently.
- The `PushPlugin` function is not explicitly exported as a plugin,
  consider adding a clearer indication of its purpose.

Maintainability issues:
- The `sendNotificationToUser` function has multiple responsibilities:
  sending notifications and updating user data.
  Consider breaking this down into separate functions.
- The `PushPlugin` function is not easily testable due to its tight coupling
  with the `ApushPlugintate` objects.

Readability issues:
- The `sendNotificationToUser` function could be renamed to something more
  descriptive, such as `sendNotificationsToUserSubscriptions`.
- The `PushPlugin` function could be renamed to something more descriptive,
  such as `NotificationSubscriptionPlugin`.

Refactoring:
- The `sendNotificationToUser` function could be refactored to use `await Promise.all()`
  to send notifications in parallel, which could improve performance.
*/

import { App, HttpError } from 'fresh';
import * as webPush from 'web-push';
import { site } from '@/app/site.ts';
import { asset } from 'fresh/runtime';
import { STATUS_CODE } from '@std/http/status';
import { setUserData } from '@/lib/user-data.ts';
import { State, UserData } from '@/app/types.ts';

// import * as webPushTypes from '@types/web-push';
// const webPush = _webPush as typeof webPushTypes;

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails('mailto:' + site.email, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.log('To enable notifications, set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY');
  console.log(webPush.generateVAPIDKeys());
}

export async function sendNotificationToUser(user: UserData, title: string, message: string) {
  let subscriptionRemoved = false;

  for (const subscription of user.pushSubscriptions) {
    try {
      const data = { body: message, icon: asset(site.appIcon), title };
      await webPush.sendNotification(subscription, JSON.stringify(data), { TTL: 60 });
    } catch (_e) {
      // Removes subscription on error, change later
      subscriptionRemoved = true;
      const index = user.pushSubscriptions.indexOf(subscription);
      if (index > -1) user.pushSubscriptions.splice(index, 1);
    }
  }

  if (subscriptionRemoved) await setUserData(user);
}

export function pushPlugin(app: App<State>) {
  app.get('/api/vapid-public-key', () => Response.json(VAPID_PUBLIC_KEY));
  app.post('/api/subscribe-notifications', async (ctx) => {
    if (!ctx.state.user) throw new HttpError(STATUS_CODE.Unauthorized);
    const { subscription } = await ctx.req.json();
    ctx.state.user.pushSubscriptions.push(subscription);
    await setUserData(ctx.state.user);
    return Response.json({}, { status: 201 });
  });
}
