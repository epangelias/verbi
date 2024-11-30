/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Security issues:
The Stripe secret key is hardcoded as 'X' if the environment variable is not set.
This is a security risk as it allows unauthorized access to the Stripe account.

Performance issues:
None

Code style issues:
The code is mostly consistent with a good coding style, but some lines are too long.
For example, the line where the Stripe object is created is too long and should be split.

Best practices:
It's good to see that environment variables are used to store sensitive data like API keys.
However, it would be better to use a secrets manager like Deno's built-in secret manager.

Maintainability issues:
The code is mostly modular and easy to maintain, but the GetStripeWebhookEvent function does too much.
It would be better to split it into smaller functions, each with its own responsibility.

Readability issues:
The code is mostly readable, but some variable names like 'ctx' could be more descriptive.

Refactoring:
The GetStripeWebhookEvent function could be refactored to be more modular and easier to read.
It could be split into smaller functions, each with its own responsibility.
*/

import { FreshContext, HttpError } from 'fresh';
import { STATUS_CODE } from '@std/http/status';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || 'X';

export function isStripeEnabled() {
  return Deno.env.has('STRIPE_SECRET_KEY');
}

export function getStripePremiumPlanPriceId() {
  return Deno.env.get('STRIPE_PREMIUM_PLAN_PRICE_ID');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

export async function GetStripeWebhookEvent(ctx: FreshContext) {
  if (!isStripeEnabled()) throw new HttpError(STATUS_CODE.NotFound);

  const body = await ctx.req.text();
  const signature = ctx.req.headers.get('stripe-signature');
  if (signature === null) {
    throw new HttpError(STATUS_CODE.BadRequest, '`Stripe-Signature` header is missing');
  }
  const signingSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (signingSecret === undefined) {
    throw new Error(
      '`STRIPE_WEBHOOK_SECRET` environment variable is not set',
    );
  }

  try {
    return await stripe.webhooks.constructEventAsync(
      body,
      signature,
      signingSecret,
      undefined,
      cryptoProvider,
    ) as Stripe.Event & { data: { object: { customer: string } } };
  } catch (error) {
    throw new HttpError(STATUS_CODE.InternalServerError, 'Error handling stripe webhook');
  }
}


