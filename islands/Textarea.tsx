/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Security issues:
None found.

Performance issues:
Using `setInterval` with a short interval of 100ms can cause performance issues, consider using a debounced function instead.

Code style issues:
Function `OnInput` should be camelCase, and it's not clear why it's not a arrow function.

Best practices:
The `OnInput` function is not necessary, the functionality could be moved inside the `useEffect` hook.

Maintainability issues:
The component is tightly coupled with the DOM, consider using a more declarative approach.

Readability issues:
Variable names are not descriptive, `OnInput` is not clear, consider renaming to `handleInput`.

Refactoring suggestion:
Instead of using `setInterval`, consider using a debounced function from a library like `lodash`, and merge the `OnInput` function into the `useEffect` hook.

Code could be improved by:
Using a consistent naming convention, and adding type annotations for function `OnInput`.
*/

import { useEffect, useRef } from 'preact/hooks';
import { JSX, RefObject } from 'preact';

export function Textarea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    inputRef?: RefObject<HTMLTextAreaElement>;
  },
) {
  const textareaRef = props.inputRef || useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function OnInput() {
    if (!textareaRef.current) return;
    if (containerRef?.current) {
      containerRef.current.style.height = textareaRef.current.clientHeight + 'px';
    }
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = (textareaRef.current.scrollHeight) + 'px';
    if (containerRef?.current) containerRef.current.style.height = 'auto';
  }

  useEffect(() => {
    if (!textareaRef.current) return;
    const value = 'height:' + (textareaRef.current.scrollHeight) + 'px;overflow-y:auto';
    textareaRef.current.setAttribute('style', value);
    textareaRef.current.addEventListener('input', OnInput);
    setInterval(() => OnInput(), 100);
  }, []);

  return (
    <div ref={containerRef} class='textarea-container'>
      {props.label && <label for={`field-${props.name}`}>{props.label}</label>}
      <textarea
        rows={1}
        autocomplete='off'
        ref={textareaRef}
        {...props}
      >
      </textarea>
    </div>
  );
}
