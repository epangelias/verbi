import { define } from '@/lib/utils.ts';
import { HttpError, page } from 'fresh';
import { getUserByVerificationCode, setUserData } from '@/lib/user-data.ts';
import { STATUS_CODE } from '@std/http/status';
import { Page } from '@/components/Page.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    const code = ctx.url.searchParams.get('code') as string;
    if (!code) throw new HttpError(STATUS_CODE.BadRequest, 'Missing verification code');
    const user = await getUserByVerificationCode(code);
    if (!user) {
      throw new HttpError(STATUS_CODE.NotFound, 'Verification code expired. Request a new one in the user settings');
    }
    if (!user.hasVerifiedEmail) user.tokens += 100;
    user.isEmailVerified = true;
    user.hasVerifiedEmail = true;
    await setUserData(user);
    return page();
  },
});

export default define.page(() => (
  <Page>
    <h1>Email Verified!</h1>
    <p>
      <a href='/'>Back</a>
    </p>
  </Page>
));
