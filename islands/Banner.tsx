/* AI GENERATED COMMENT
**Security Issues:**

* Using `localStorage` directly can be vulnerable to XSS attacks. Consider using a library like `dom-storage` to handle storage securely.

**Performance Issues:**

* The `useMemo` hook is memoizing the `banner` variable based on multiple dependencies. This might cause unnecessary re-renders. Consider optimizing the dependencies or using `useCallback` instead.

**Code Style Issues:**

* The code uses both single quotes and double quotes for string literals. It's better to stick to a single convention throughout the code.

**Best Practices:**

* The `Banners` component has a complex logic for determining the banner to display. Consider breaking it down into smaller, more manageable functions for better readability and maintainability.

**Maintainability Issues:**

* The `Banner` component has a lot of inline styles and HTML structure. Consider separating the presentational aspects into a separate component or using a CSS framework for better maintainability.

**Readability Issues:**

* The `banners` array has objects with complex condition functions. Consider extracting these functions into separate, named functions for better readability.

**Refactoring Suggestions:**

* The `Banner` component can be refactored to use a more functional programming style, with separate functions for rendering the banner content, close button, and open button.
* Consider using a more robust state management system instead of `useSignal` and `localStorage`.
*/

import { IS_BROWSER } from 'fresh/runtime';
import { useGlobal } from '@/islands/Global.tsx';
import { useSignal } from '@preact/signals';
import { isIOSSafari } from '@/lib/pwa.ts';
import { useMemo } from 'preact/hooks';
import { BannerData } from '@/app/types.ts';

export function Banners() {
  const global = useGlobal();

  if (!IS_BROWSER) return <></>;

  const banners: BannerData[] = [
    {
      name: 'verify-email',
      condition: () => !global.user.value?.hasVerifiedEmail && global.outOfTokens.value,
      canClose: false,
      content: () => (
        <>
          <a href='/user/resend-email'>Verify email</a> for more tokens
        </>
      ),
    },
    {
      name: 'subscribe',
      condition: () => global.user.value?.hasVerifiedEmail && global.outOfTokens.value,
      canClose: true,
      content: () => (
        <>
          <a href='/user/subscribe' target='_blank'>Subscribe</a> for unlimited tokens
        </>
      ),
    },
    {
      name: 'ios-install',
      condition: () => !global.pwa.isPWA.value && isIOSSafari(),
      canClose: true,
      content: () => <a href='/install-guide-ios'>Install this app to your device</a>,
    },
    {
      name: 'pwa-install',
      condition: () => global.pwa.installPWA.value && !global.pwa.isPWA.value && !isIOSSafari(),
      canClose: true,
      content: () => (
        <a href='javascript:void(0);' onClick={global.pwa.installPWA.value}>
          Install this app to your device
        </a>
      ),
    },
    // {
    //   name: 'notifications',
    //   condition: () => !global.pwa.pushSubscription.value && global.pwa.isPWA.value,
    //   canClose: true,
    //   content: () => <a href='javascript:void(0);' onClick={global.pwa.requestSubscription}>Enable Notifications</a>,
    // },
  ];

  const banner = useMemo(() => banners.find((b) => b.condition()), [
    global.pwa.installPWA.value,
    global.pwa.isPWA.value,
    global.outOfTokens.value,
    global.pwa.pushSubscription.value,
    global.pwa.worker.value,
    global.user.value,
  ]);

  if (!banner) return <></>;

  return <Banner data={banner} />;
}

export function Banner(
  { data: { name, canClose, content } }: { data: BannerData },
) {
  const hideBanner = useSignal(!!localStorage.getItem('hideBanner-' + name));

  function onClose() {
    localStorage.setItem('hideBanner-' + name, '1');
    hideBanner.value = true;
  }

  function onOpen() {
    localStorage.removeItem('hideBanner-' + name);
    hideBanner.value = false;
  }

  return (
    <>
      <button
        class='banner-button'
        onClick={onOpen}
        data-hide={!hideBanner.value}
        aria-label='Open Banner'
      >
        <span>!</span>
      </button>
      <div class='banner' role='status' aria-live='polite' data-hide={hideBanner.value}>
        {content()}
        {canClose && <button onClick={onClose} aria-label='Close'>×</button>}
      </div>
    </>
  );
}
