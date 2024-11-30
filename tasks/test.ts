#!/usr/bin/env -S deno run -A

// npx puppeteer browsers install firefox

import puppeteer from 'npm:puppeteer';
import { deleteUserData } from '@/lib/user-data.ts';
import { getUserIdByEmail } from '@/lib/user-data.ts';

// Clean up test data
await deleteUserData(await getUserIdByEmail('test@test.test'));
await deleteUserData(await getUserIdByEmail('ztest@test.test'));

console.log('Ensure app running locally at http://0.0.0.0:8000');

// Launch browser
const browser = await puppeteer.launch({
  // browser: "firefox",
  headless: false, // Enable non-headless mode for debugging
  browser: 'firefox',
});

const page = await browser.newPage();

// Navigate to the app
await page.goto('http://0.0.0.0:8000', { waitUntil: 'networkidle0' });

// Click on the login/signup link in the header
await page.waitForSelector('header .right a'); // Wait for the selector to be visible
await page.click('header .right a');

// Click the "Sign Up" link
await page.waitForSelector('button + a'); // Wait for the "Sign Up" button to appear
await page.click('button + a');

// Fill in the signup form
await page.waitForSelector('[name="name"]');
await page.type('[name="name"]', 'Test');
await page.type('[name="email"]', 'test@test.test');
await page.type('[name="password"]', 'test@test.test');

Promise.all([
  page.click('form button'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

await new Promise((r) => setTimeout(r, 3000));

// Log out by clicking the header link
Promise.all([
  page.click('header .right a'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

// Fill in the signup form with a new user
await page.waitForSelector('[name="name"]');
await page.type('[name="name"]', 'z');
await page.type('[name="email"]', 'z');

Promise.all([
  page.click('form button'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

Promise.all([
  page.click('[href="/user/resend-email"]'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

Promise.all([
  page.click('main a'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

Promise.all([
  page.click('.right a'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

Promise.all([
  page.click('[href="/user/signout"]'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

Promise.all([
  page.click('a'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

browser.close();

await page.type('[name="email"]', 'ztest@test.test');
await page.type('[name="password"]', 'test@test.test');

Promise.all([
  page.click('form button'),
  page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

// Close the browser
// await browser.close();
