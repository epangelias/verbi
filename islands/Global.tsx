/* AI GENERATED COMMENT
Here is the feedback on the provided code:

The code appears to be well-structured and follows best practices, but here are a few points to consider:

The `useEffect` hook is used to sync SSE when the `user` prop is provided, but it's not clear why it's only sync'ed when the `user` prop is provided, rather than always.

The `global` object is created using `useSignal` and `useComputed`, but it's not clear why these hooks are used instead of `useState` and `useMemo`.

The `outOfTokens` computed property is based on `global.user.value`, but it's not clear what happens when `global.user.value` is null or undefined.

The `useGlobal` hook is used to get the global context, but it's not clear why it's explicitly casting the result to `GlobalData`.

Consider adding types for the `children` prop and the `user` prop to ensure they conform to expected types.

Consider adding error handling for cases where `global.user.value` is null or undefined.

Consider refactoring the `Global` component to use a more functional approach, as it's currently using a mix of functional and object-oriented programming styles.
*/

import { useContext, useEffect } from 'preact/hooks';
import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { GlobalData, UserData } from '@/lib/types.ts';
import { useComputed, useSignal } from '@preact/signals';
import { syncSSE } from '../lib/stream-client.ts';
import { usePWA } from '@/lib/pwa.ts';

export function Global(
  { children, user }: { children: ComponentChildren; user?: Partial<UserData> },
) {
  const global: GlobalData = {
    user: useSignal(user),
    outOfTokens: useComputed(() => global.user.value?.tokens! <= 0 && !global.user.value?.isSubscribed),
    pwa: usePWA(),
  };

  if (user) useEffect(() => syncSSE('/api/userdata', { data: global.user }), []);
  return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>;
}

const GlobalContext = createContext<GlobalData | null>(null);

export const useGlobal = () => useContext(GlobalContext) as GlobalData;
