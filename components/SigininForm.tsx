/* AI GENERATED COMMENT
Here is my feedback:

Security issue: The form's method is set to POST but there is no validation or sanitization of user input, which could lead to security vulnerabilities.

Performance issue: There is no handling of form submission, which could cause a full page reload.

Code style issue: The code is concise but lacks whitespace between elements, making it hard to read.

Best practice: Consider using a form library or a UI framework to handle form submission and validation.

Maintainability issue: The error message is not accessible to screen readers as it is not associated with the form control.

Refactoring suggestion: Consider separating the form fields into a separate component for better reusability.
*/

import { Field } from '@/components/Field.tsx';

export function SigninForm({ error, email }: { error: string; email: string }) {
  return (
    <form method='POST'>
      <Field name='email' type='email' label='Email' value={email} required autofocus />
      <Field name='password' type='password' label='Password' required />

      {error && <p class='error-message' role='alert' aria-live='assertive'>{error}</p>}

      <div>
        <button>Sign In</button>
        <a href='/user/signup'>Sign Up</a>
      </div>
    </form>
  );
}
