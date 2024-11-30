/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code appears to be a React functional component for a signup form.
There are no obvious security issues in this code.
The code could be improved by using a consistent code style throughout.
For example, the function signature uses single quotes for the prop types,
but the JSX uses double quotes for attribute values.
Consider using PropTypes to define the types of error, name, and email props.
The code does not appear to have any significant performance issues.
Consider adding event handlers for the form submission and button clicks.
The code is relatively simple and easy to read, but could be improved
with better variable naming, such as renaming the `error` prop to something
more descriptive, like `errorMessage`.
There is no error handling for the form validation or submission process.
Consider adding Zustand or Redux for state management and validation.
*/

import { Field } from '@/components/Field.tsx';

export function SignupForm(
  { error, name, email }: { error: string; name: string; email: string },
) {
  return (
    <form method='POST'>
      <Field name='name' label='Name' required autofocus value={name} />
      <Field name='email' label='Email' type='email' required value={email} />
      <Field name='password' label='Password' type='password' required />

      {error && <p class='error-message' role='alert' aria-live='assertive'>{error}</p>}

      <div>
        <button>Sign Up</button>
        <a href='/user/signin'>Sign In</a>
      </div>
    </form>
  );
}
