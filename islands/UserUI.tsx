/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Security Issues:
The code uses inline JavaScript in the `href` attribute, which can be a security risk if not properly sanitized.

Performance Issues:
The code uses multiple conditional statements, which can affect performance if the conditions are complex or the components are deeply nested.

Code Style Issues:
The code uses inconsistent indentation (mix of spaces and tabs) and lacks consistent whitespace between lines and around brackets.

Best Practices:
The code uses a consistent naming convention, but some variable names (e.g., `global`) could be more descriptive.

Maintainability Issues:
The code has a complex conditional logic, which can make it hard to maintain and debug.

Readability Issues:
The code has long lines and lacks whitespace, making it hard to read.

Refactoring Suggestions:
Consider extracting the conditional logic into separate components or functions to improve readability and maintainability.
Consider using a consistent naming convention for variables and components.
Consider using a linter and a code formatter to enforce consistent code style and formatting.
*/

import { useGlobal } from '@/islands/Global.tsx';
import { Field } from '@/components/Field.tsx';

export function UserUI({ error, message }: { error?: string; message?: string }) {
  const global = useGlobal();

  return (
    <>
      <p>
        <a href='/user/signout'>Sign Out</a>
        {global.user.value?.isSubscribed
          ? <a href='/user/subscription' target='_blank'>Manage Subscription</a>
          : <a href='/user/subscribe' target='_blank'>Subscribe</a>}
      </p>

      {global.pwa.worker.value && !global.pwa.pushSubscription.value && (
        <div>
          <a onClick={global.pwa.requestSubscription} href='javascript:void(0);'>Enable Notifications</a>
        </div>
      )}

      {!global.user.value?.isEmailVerified && (
        <p>
          Please verify your email address. <a href='/user/resend-email'>Resend email</a>
        </p>
      )}

      <form method='POST'>
        <Field name='name' label='Name' required autofocus defaultValue={global.user.value?.name} />
        <Field name='email' label='Email' required autofocus defaultValue={global.user.value?.email} />

        <div>
          <button>Save</button>
          {message && <span class='message' role='status' aria-live='polite'>{message}</span>}
          {error && <span class='error-message' role='alert' aria-live='assertive'>{error}</span>}
        </div>
      </form>
    </>
  );
}
