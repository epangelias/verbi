import { define } from '@/lib/utils.ts';
import { page } from 'fresh';
import { authorizeUserData, createUserData, setAuthCookie } from '@/lib/user-data.ts';
import { SignupForm } from '@/components/SiginupForm.tsx';
import { Meth } from '@/lib/meth.ts';
import { Page } from '@/components/Page.tsx';
import { RateLimiter } from '@/lib/rate-limiter.ts';
import { sendEmailVerification } from '@/app/verify-email.ts';
import { createUser } from '@/app/user.ts';

const limiter = new RateLimiter();

export const handler = define.handlers({
  POST: async (ctx) => {
    await new Promise((r) => setTimeout(r, 1000));

    limiter.request();

    const { name, email, password } = Meth.formDataToObject(await ctx.req.formData());

    try {
      const user = await createUser(name, email, password);

      try {
        await sendEmailVerification(ctx.url.origin, user);
      } catch (e) {
        // Do nothing if rate limited
        console.error('Error sending verification email: ', e);
      }

      const authCode = await authorizeUserData(email, password);
      if (authCode) return setAuthCookie(ctx, authCode);

      throw new Error('Error authorizing user');
    } catch (e) {
      return page({ error: Meth.getErrorMessage(e), name, email });
    }
  },
});

export default define.page<typeof handler>(({ data }) => (
  <Page>
    <div>
      <h1>Sign Up</h1>
      <SignupForm error={data?.error} email={data?.email} name={data?.name} />
    </div>
  </Page>
));
