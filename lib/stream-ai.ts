/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code has a mix of concerns, such as generating a chat completion stream, handling errors, and rendering markdown, making it difficult to maintain and read.

The `StreamAI` function has a long method chain and multiple responsibilities, violating the Single Responsibility Principle.

The `onChunk` and `onCancel` callbacks have similar logic, which can be extracted into a separate function to avoid code duplication.

The `insertLoaderToHTML` function is not following the conventional naming convention of camelCase in JavaScript.

The `StreamAI` function does not handle the case where `generateChatCompletionStream` returns an error, it should be handled properly.

There is no validation for the input `Options` object, it should be validated before being used.

The `StreamSSR` function is not imported from anywhere, it should be imported or defined in the same file.

No type checking is done for the `messages` array, it should be checked to ensure it's an array of `AIMessage`.

Error handling can be improved by providing more context and details about the error.

The function `safelyRenderMarkdown` is not defined in this file, it should be imported or defined in the same file.

The code can be refactored to use async/await consistently throughout the function, instead of mixing it with promises.

The variable `stream` is defined at the top of the function, but it's only used inside the `onChunk` function, it can be defined inside the `onChunk` function.

The function can be broken down into smaller functions, each with a single responsibility, to improve readability and maintainability.
*/

import { StreamSSR } from '@/lib/stream-sse.ts';
import { ChatCompletionChunk } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';
import { generateChatCompletionStream } from '@/lib/oai.ts';
import { renderMarkdown } from '@/lib/md.ts';

interface Options {
  messages: AIMessage[];
  options?: OAIOptions;
  onChunk?: (messages: AIMessage[]) => void;
  onEnd?: (messages: AIMessage[]) => void;
  onError?: (messages: AIMessage[]) => void;
  onCancel?: (messages: AIMessage[]) => void;
}

export function StreamAI({ messages, options, onChunk, onEnd, onError, onCancel }: Options) {
  let stream: Stream<ChatCompletionChunk>;

  const message = { role: 'assistant', content: '', html: '' };

  return StreamSSR({
    async onChunk(send) {
      try {
        stream = await generateChatCompletionStream(options, messages);
        if (stream instanceof Stream == false) throw new Error('Invalid stream');
        if (onChunk) onChunk(messages);
      } catch (e) {
        if (onError) onError(messages);
        stream?.controller.abort();
        console.error(e);
      }

      let content = '';

      messages.push(message);

      for await (const token of stream) {
        const deltaContent = token.choices[0].delta.content;
        if (typeof deltaContent == 'undefined') break;
        content += deltaContent;
        const html = insertLoaderToHTML(await renderMarkdown(content));
        message.content = content;
        message.html = html;
        send(message);
      }

      message.html = await renderMarkdown(content);
      send(message);
      stream.controller.abort();
      send(null);

      if (onEnd) onEnd(messages);
    },
    async onCancel() {
      message.html = await renderMarkdown(message.content);
      if (onCancel) onCancel(messages);
      stream?.controller?.abort();
    },
  });
}

function insertLoaderToHTML(html: string) {
  return html.replace(/<\/([^>]+)>\n+$/, `&nbsp;&nbsp;<span class="loader"></span></$1>`);
}
