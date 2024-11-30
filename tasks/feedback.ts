#!/usr/bin/env -S deno run -A --env

import { walk } from 'jsr:@std/fs';
import { generateChatCompletion } from '@/lib/oai.ts';

const path = new URL('../', import.meta.url);

const createPrompt = (file: string, path: string) =>
  `You will provide feedback on the provided code.
You will provide feedback on any security issues, performance issues, code style issues, best practices, maintainability issues, and readability issues.
You may also provide feedback on refactoring the code only if you see something that can be refactored.
You will provide only the most knowledgeable and useful information.
If you have nothing to say that is important or necessary, just don't say it.
Your response should be in plain text, a newline after each sentence and a maximum of 80 characters per line.
Your response should be no longer than 50 words unless you have more to say about it.
Your response will later be added as a comment by me, so do not put anything that is formatted.

<file path="${path}">
${file}
</file>`;

for await (const file of walk(path)) {
  if (
    !(file.path.endsWith('.js') || file.path.endsWith('.ts') || file.path.endsWith('.tsx') ||
      file.path.endsWith('.css'))
  ) {
    continue;
  }
  if (file.path.includes('.archive')) continue;
  if (!file.isFile) continue;
  let text = await Deno.readTextFile(file.path);

  const prompt = createPrompt(text, file.path);

  const res = await generateChatCompletion(undefined, [{ role: 'user', content: prompt }]);

  const msg = res.choices[0].message.content;

  const comment = `/* AI GENERATED COMMENT\n${msg}\n*/\n\n\n`;

  let firstLine = '';
  if (text.startsWith('#!')) {
    const lines = text.split('\n');
    firstLine = lines.shift() + '\n\n';
    text = lines.join('\n');
  }

  text = firstLine + comment + text;

  await Deno.writeTextFile(file.path, text);

  console.log(`Generated file ${file.path.split('\n').at(-1)}`);

  await new Promise((r) => setTimeout(r, 10000));
}
