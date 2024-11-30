/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code has a good separation of concerns and is well-organized.

The use of environment variables for API key and base URL is a good practice for security.

The use of a `backends` record to cache OpenAI instances is a good performance optimization.

The `generateChatCompletionStream` function is redundant and can be removed, as it simply calls `generateChatCompletion` with `stream` set to `true`.

The `generateChatCompletion` function has a misleading name, as it returns a stream when `stream` is `true`, and a completion when `stream` is `false`.

The type casting to `unknown` and then to a specific type is not necessary and can be removed.

The `messages` array is mapped to a new array with the same shape, which is unnecessary and can be removed.

The `backendId` variable can be a `const` instead of `let`.

The `backends` record can be a `Map` instead of an object, for better performance.

The `defaultTestOptions` object can be a constant instead of a variable.

There is no error handling for the case where the environment variables are not set.
*/

import OpenAI from 'https://deno.land/x/openai@v4.28.0/mod.ts';
import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.28.0/resources/mod.ts';
import { Stream } from 'https://deno.land/x/openai@v4.28.0/streaming.ts';
import { AIMessage, OAIOptions } from '@/lib/types.ts';

const backends: Record<string, OpenAI> = {};

const defaultTestOptions = {
  apiKey: Deno.env.get('AI_API_KEY') || 'ollama',
  baseURL: Deno.env.get('AI_URL') || 'http://localhost:11434/v1',
  model: Deno.env.get('AI_MODEL') || 'llama3.2:1b-instruct-q4_K_M',
};

export async function generateChatCompletionStream(
  options: OAIOptions = defaultTestOptions,
  messages: AIMessage[],
) {
  return await generateChatCompletion(options, messages, true) as unknown as Stream<
    OpenAI.ChatCompletionChunk
  >;
}

export async function generateChatCompletion(
  options: OAIOptions = defaultTestOptions,
  messages: AIMessage[],
  stream = false,
) {
  messages = messages.map(({ role, content }) => ({ role, content }));

  const backendId = `${options.baseURL}:${options.apiKey}`;

  backends[backendId] = backends[backendId] || new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseURL,
  });

  return await backends[backendId].chat.completions.create({
    model: options.model,
    messages: messages as ChatCompletionMessageParam[],
    stream,
  }) as unknown as OpenAI.ChatCompletion;
}
