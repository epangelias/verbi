/* AI GENERATED COMMENT
Here is my feedback:

Security Issues:
The code uses `alert` which can be a security issue as it can be used for phishing attacks.
It's better to use a more modern way of displaying notifications to the user.

Performance Issues:
The `requestPushSubscription` function performs multiple fetches and subscription operations.
These operations can be optimized by caching the results or using a more efficient API.

Code Style Issues:
The code uses inconsistent naming conventions (e.g., `useSignal` and `useEffect`).
It's better to stick to a single convention throughout the code.

Best Practices:
The `loadServiceWorker` function registers a new service worker if the current one is outdated.
However, it's better to handle service worker updates in a more robust way,
e.g., by using `navigator.serviceWorker.ready` promise.

Maintainability Issues:
The `usePWA` function is quite long and complex.
It's better to break it down into smaller, more manageable functions.

Readability Issues:
Some variable names, such as `Meth` and `IS_BROWSER`, are not very descriptive.
It's better to use more descriptive names to improve code readability.

Refactoring Suggestions:
The `requestPushSubscription` function can be refactored to use async/await more consistently.
The `usePWA` function can be refactored to use a more functional programming style,
e.g., by using `useCallback` instead of `useEffect` with an empty dependency array.
*/

import { Meth } from '@/lib/meth.ts';
import { fetchOrError } from '@/lib/fetch.ts';
import { asset, IS_BROWSER } from 'fresh/runtime';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export async function requestPushSubscription(worker?: ServiceWorkerRegistration | null) {
  if (!worker) return null;

  if (Notification.permission == 'denied') {
    alert('Notifications are disabled. Please enable them in your browser or device settings.');
    return null;
  }

  const existingSubscription = await worker.pushManager.getSubscription();
  if (existingSubscription) return existingSubscription;

  const vapidPublicKey = await fetchOrError('/api/vapid-public-key') as string;
  console.log('Loaded VAPID key: ', vapidPublicKey);
  const convertedVapidKey = Meth.urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await worker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });

  console.log('Subscribed.');

  await fetchOrError('/api/subscribe-notifications', { method: 'POST', body: { subscription } });

  return subscription;
}

export async function getSubscription(worker: ServiceWorkerRegistration | null) {
  if (!worker) return null;
  if (Notification.permission !== 'granted') null;
  return await worker.pushManager.getSubscription();
}

export async function loadServiceWorker() {
  if ('serviceWorker' in navigator == false) {
    console.warn('Service Worker Disabled');
    return null;
  }

  let registration = await navigator.serviceWorker.getRegistration();

  const workerURL = asset('/worker.js');
  const oldWorkerURL = registration?.active?.scriptURL;

  if (!registration || oldWorkerURL != workerURL) {
    if (registration) await registration.unregister();
    registration = await navigator.serviceWorker.register(workerURL, { scope: '/' });
  }

  return registration;
}

export function isIOSSafari(): boolean {
  const userAgent = globalThis.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  return isIOS && isSafari;
}

function detectIsPWA(): boolean {
  return IS_BROWSER && globalThis.matchMedia('(display-mode: standalone)').matches;
}

export function usePWA() {
  const installPWA = useSignal<() => void>();
  const isPWA = useSignal(false);
  const worker = useSignal<ServiceWorkerRegistration | null>(null);
  const pushSubscription = useSignal<PushSubscription | null>(null);

  useEffect(() => {
    globalThis.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();

      const deferredPrompt = e as Event & { prompt: () => void; userChoice: Promise<void> };

      installPWA.value = async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log(choice);
      };
    });

    globalThis.matchMedia('(display-mode: standalone)')
      .addEventListener('change', () => isPWA.value = detectIsPWA());

    isPWA.value = detectIsPWA();

    (async () => {
      worker.value = await loadServiceWorker();
      pushSubscription.value = await getSubscription(worker.value);
    })();
  }, []);

  return {
    isPWA,
    installPWA,
    worker,
    pushSubscription,

    async requestSubscription() {
      return pushSubscription.value = await requestPushSubscription(worker.value);
    },
  };
}
