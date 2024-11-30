import * as ammonia from 'https://deno.land/x/ammonia@0.3.1/mod.ts';
import { marked } from 'marked';

const ammoniaInit = ammonia.init();

export async function renderMarkdown(input: string): Promise<string> {
  await ammoniaInit;
  return ammonia.clean(await marked(input));
}
