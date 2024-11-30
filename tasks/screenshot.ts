#!/usr/bin/env -S deno run -A --env

// npx puppeteer browsers install firefox

import puppeteer from 'npm:puppeteer';

console.log('Ensure app running locally at http://0.0.0.0:8000');

// Must modify for windows
const path = new URL('../static/img/screenshot.jpg', import.meta.url).href.slice(7);

const browser = await puppeteer.launch({ browser: 'firefox', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto('http://0.0.0.0:8000', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  document.body.style.zoom = '2';
  document.body.style.fontSize = '1rem';
});
await page.screenshot({ path });
await browser.close();
