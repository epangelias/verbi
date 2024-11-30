/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Security Issues:
* Environment variables MJ_APIKEY_PUBLIC and MJ_APIKEY_PRIVATE are being stored in plaintext,
  which is a potential security risk. Consider using a secure environment variable storage.

Performance Issues:
* RateLimiter is being used to limit the number of requests to 2 per minute,
  but it's not clear why this is necessary or if it's the best approach.

Code Style Issues:
* The `verifyEmailTemplate` function is quite long and complex,
  consider breaking it down into smaller functions for better readability.

Best Practices:
* Consider using a more robust error handling mechanism instead of
  console warnings and throwing Errors.

Maintainability Issues:
* The `verifyEmailTemplate` function is tightly coupled to the `site` object,
  consider making it more modular and reusable.

Readability Issues:
* Some variable names, such as `MJ_APIKEY_PUBLIC` and `MJ_APIKEY_PRIVATE`,
  could be more descriptive and follow a consistent naming convention.

Refactoring Suggestions:
* Consider creating a separate module for the email verification template to
  make it more reusable and modular.
* Consider using a templating engine instead of concatenating strings
  for the email verification template.
* Consider using a more robust rate limiter that can handle multiple requests
  and has a more configurable interface.
*/

import Mailjet from 'node-mailjet';
import { RateLimiter } from '@/lib/rate-limiter.ts';
import { MailOptions } from '@/lib/types.ts';

const limiter = new RateLimiter({ maxRequests: 2, interval: 60 }); // 2 per minute

let mailjet: Mailjet.Client;

if (!Deno.env.has('MJ_APIKEY_PUBLIC') || !Deno.env.has('MJ_APIKEY_PRIVATE')) {
  console.warn('Missing mailjet credentials');
} else {
  mailjet = new Mailjet.Client({
    apiKey: Deno.env.get('MJ_APIKEY_PUBLIC'),
    apiSecret: Deno.env.get('MJ_APIKEY_PRIVATE'),
  });
}

export async function sendMail(options: MailOptions) {
  limiter.request();

  if (!mailjet) throw new Error('Mail Disabled');

  await mailjet;
  await mailjet.post('send', { 'version': 'v3.1' }).request({
    Messages: [
      {
        From: { Email: options.from, Name: options.fromName },
        To: [{ Email: options.to, Name: options.toName }],
        Subject: options.subject,
        TextPart: options.text,
        HTMLPart: options.html,
      },
    ],
  });
}
