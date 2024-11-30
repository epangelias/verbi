import { FreshContext } from 'fresh';
import { getCookies, setCookie } from 'jsr:@std/http/cookie';
import { db } from '@/lib/utils.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';
import { generateCode, hashText } from '@/lib/crypto.ts';
import { State, UserData } from '@/app/types.ts';
import { validation } from '@/lib/validation.ts';
import { deleteUserRelatedData } from '@/app/user.ts';

// DB

export async function getUserByAuth(auth: string) {
  if (!auth) return null;
  const res = await db.get<{ id: string }>(['usersByAuth', auth]);
  if (res.versionstamp == null) return null;
  return await getUserById(res.value.id);
}

export async function getUserById(id: string) {
  const res = await db.get<UserData>(['users', id]);
  if (res.versionstamp == null) return null;
  return res.value;
}

export async function getUserIdByEmail(email: string) {
  email = normalizeEmail(email);
  const res = await db.get<{ id: string }>(['usersByEmail', email]);
  if (res.versionstamp == null) return null;
  return res.value?.id;
}

// User session

export async function authorizeUserData(email: string, password: string) {
  const id = await getUserIdByEmail(email);
  if (!id) return null;
  const user = await getUserById(id);
  if (!user) return null;
  const passwordHash = await hashText(`${user.salt}:${password}`);
  if (user.passwordHash != passwordHash) return null;
  const code = generateCode();
  await db.set(['usersByAuth', code], { id }, { expireIn: 1000 * 60 * 60 * 24 * 30 });
  return code;
}

export async function generateEmailVerificationCode(user: UserData) {
  const code = generateCode();
  await db.set(['userVerification', code], { id: user.id, email: user.email }, {
    expireIn: 1000 * 60 * 60, // One hour
  });
  return code;
}

export async function getUserByVerificationCode(code: string) {
  const res = await db.get<{ id: string; email: string }>(['userVerification', code]);
  if (res.versionstamp == null) return null;
  const user = await getUserById(res.value.id);
  if (user?.email != res.value.email) return null;
  return user;
}

export function setAuthCookie(ctx: FreshContext, authCode: string) {
  const res = ctx.redirect('/');
  setCookie(res.headers, {
    name: 'auth',
    value: authCode,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: ctx.req.url.startsWith('https://'),
  });
  return res;
}

export async function loadUserToContext(ctx: FreshContext<State>) {
  if (ctx.state.user) return ctx.state.user;
  const { auth } = getCookies(ctx.req.headers);
  ctx.state.auth = auth;
  const user = await getUserByAuth(auth);
  if (user) ctx.state.user = user;
}

// Stripe

export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const res = await db.get<{ id: string }>(['usersByStripeCustomer', stripeCustomerId]);
  if (res.versionstamp == null) return null;
  return await getUserById(res.value.id);
}

async function generateStripeCustomerId(name: string, email: string) {
  if (!isStripeEnabled()) return;
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
}

// User Data
type OmittedUserData = Omit<UserData, 'passwordHash' | 'salt' | 'id' | 'created'> & { password: string };
export async function createUserData(data: OmittedUserData) {
  validation('password', data.password, { min: 6, max: 100 });

  const salt = generateCode();
  const passwordHash = await hashText(`${salt}:${data.password}`);

  const user: UserData = {
    id: generateCode(),
    created: Date.now(),
    salt,
    passwordHash,
    ...data,
  };

  return setUserData(user, { isNew: true });
}

export async function setUserData(user: UserData, { isNew } = { isNew: false }) {
  const atomic = db.atomic();
  let errorMessage = 'Error updating user';

  user = { ...user };
  user.email = normalizeEmail(user.email);
  user.name = normalizeName(user.name);

  validation('email', user.email, { email: true, min: 5, max: 320 });
  validation('name', user.name, { textAndSpaces: true, min: 3, max: 100 });

  if (isNew) {
    // If new user, check that doesn't already exist
    atomic.check({ key: ['users', user.id], versionstamp: null })
      .check({ key: ['usersByEmail', user.email], versionstamp: null })
      .set(['usersByEmail', user.email], { id: user.id });

    errorMessage = 'User already exists';
  } else {
    const old = await db.get<UserData>(['users', user.id]);

    if (old.versionstamp == null) throw new Error('User does not exist');

    const emailChanged = old.value.email != user.email;
    const nameChanged = old.value.name != user.name;

    // Ensure user data hasn't changed during atomic operation
    atomic.check({ key: ['users', user.id], versionstamp: old.versionstamp });
    errorMessage = 'User data changed';

    if (emailChanged) {
      user.isEmailVerified = false;

      atomic.check({ key: ['usersByEmail', user.email], versionstamp: null })
        .delete(['usersByEmail', old.value.email])
        .set(['usersByEmail', user.email], { id: user.id });

      errorMessage = 'User with email already exists';
    }

    if (isStripeEnabled() && old.value.stripeCustomerId && (emailChanged || nameChanged)) {
      // If user data changed, update stripe account
      await stripe.customers.update(old.value.stripeCustomerId, { email: user.email, name: user.name });
    }
  }

  // Create Stripe customer
  if (!user.stripeCustomerId && isStripeEnabled()) {
    user.stripeCustomerId = await generateStripeCustomerId(user.name, user.email);
    if (!user.stripeCustomerId) throw new Error('Failed to create stripe customer');
    atomic.set(['usersByStripeCustomer', user.stripeCustomerId], { id: user.id });
  }

  atomic.set(['users', user.id], user);

  const { ok } = await atomic.commit();
  if (!ok) throw new Error(errorMessage);

  return user;
}

export async function deleteUserData(id: string | null) {
  if (!id) return;
  const user = await getUserById(id);
  if (!user) return;

  const atomic = db.atomic()
    .delete(['users', id])
    .delete(['usersByEmail', user.email])
    .delete(['usersByStripeCustomer', user.stripeCustomerId || '']);

  deleteUserRelatedData(atomic, user);

  await atomic.commit();
}

// Normalize data

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').split(' ').map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
