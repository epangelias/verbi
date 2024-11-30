/* AI GENERATED COMMENT
Here is my feedback on the provided code:

**Security Issues:**
- The code uses `dangerouslySetInnerHTML` which can be a security risk if not properly sanitized. It's recommended to use a library like `dompurify` to sanitize the HTML.

**Performance Issues:**
- The `scrollToBottom` function uses `setTimeout` with a 0ms delay, which can be replaced with `requestAnimationFrame` for better performance.
- The `onSubmit` function updates the `chatData` signal and then calls `scrollToBottom` which can cause unnecessary re-renders. Consider debouncing or batching updates.

**Code Style Issues:**
- The code has inconsistent indentation (sometimes 2 spaces, sometimes 4 spaces). It's recommended to use a consistent 2 spaces for indentation.
- Some functions are not formatted correctly (e.g. `generateResponse` has inconsistent spacing).

**Best Practices:**
- The `useEffect` hook is used with an empty dependency array `[]`, which means it will only run once. Consider adding dependencies to ensure the effect runs when necessary.
- The `onSubmit` function does not handle errors properly. Consider adding try-catch blocks or error boundaries.

**Maintainability Issues:**
- The `ChatBox` component has a lot of complex logic. Consider breaking it down into smaller components or extracting functions for better maintainability.

**Readability Issues:**
- Some variable names are not descriptive (e.g. `m` in `chatData.value.messages.filter((m: AIMessage) => ...)`). Consider using more descriptive names.

**Refactoring Suggestions:**
- The `addMessage` function can be simplified by using the spread operator instead of creating a new object.
- The `generateResponse` function can be simplified by extracting the `watchSSE` logic into a separate function.
*/

import { useSignal } from '@preact/signals';
import { sendSSE, syncSSE, watchSSE } from '../lib/stream-client.ts';
import { AIMessage } from '@/lib/types.ts';
import { useEffect, useRef } from 'preact/hooks';
import { useGlobal } from '@/islands/Global.tsx';
import { Textarea } from '@/islands/Textarea.tsx';
import { ChatData } from '@/app/types.ts';

export default function ChatBox({ data }: { data: ChatData }) {
  const global = useGlobal();
  const chatData = useSignal<ChatData>(data);
  const generating = useSignal(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const checkCanGenerate = () => global.user.value && (global.user.value.tokens >= 0 || global.user.value.isSubscribed);

  if (!global.user.value) return <></>;

  useEffect(() => syncSSE('/api/chatdata', { data: chatData }), []);

  useEffect(() => {
    scrollToBottom();
  }, [chatData.value]);

  function addMessage(message: AIMessage) {
    chatData.value.messages.push(message);
    chatData.value = { ...chatData.value };
    return message;
  }

  async function scrollToBottom() {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (!messagesRef.current) return;
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!checkCanGenerate()) return alert('Your out of tokens now pay');
    if (!inputRef.current) return;

    generating.value = true;
    addMessage({ role: 'user', content: inputRef.current.value });
    inputRef.current.value = '';
    scrollToBottom();
    await sendSSE('/api/chatdata', chatData.value);
    generateResponse();
  }

  function generateResponse() {
    const message: AIMessage = addMessage({
      role: 'assistant',
      content: '',
      html: '<span class="loader"></span>',
    });

    generating.value = true;

    watchSSE('/api/ai', {
      onMessage(newMessage: AIMessage) {
        if (newMessage == null) return generating.value = false;
        message.content = newMessage.content;
        message.html = newMessage.html;
        chatData.value = { ...chatData.value };
        scrollToBottom();
      },
      onError() {
        message.html = '<p class="error-message" role="alert" aria-live="assertive">Error generating response</p>';
        generating.value = false;
      },
    });
  }

  function ChatMessage(message: AIMessage) {
    return (
      <div
        data-role={message.role}
        dangerouslySetInnerHTML={message.html ? { __html: message.html } : undefined}
      >
        {message.content}
      </div>
    );
  }

  return (
    <div class='chat-box'>
      <div class='messages' ref={messagesRef}>
        {chatData.value.messages.filter((m: AIMessage) => m.role !== 'system').map(ChatMessage)}
      </div>

      <form onSubmit={onSubmit}>
        <Textarea
          autofocus
          required
          inputRef={inputRef}
        />
        <button disabled={generating.value}>
          <span>◉</span>
        </button>
      </form>
    </div>
  );
}
