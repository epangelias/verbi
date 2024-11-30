/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code appears to be a React/Preact component written in TypeScript.

It's good to see the use of type annotations and functional component syntax.

There are no obvious security issues or performance issues in this code.

The code style is mostly consistent with popular React coding standards.

It's good that the component is kept simple and focused on its responsibility.

It's a good practice to keep the component's props interface concise and explicit.

Consider adding a key to the `<main>` element to help React's reconciliation algorithm.

The component's name "Page" is quite generic, consider making it more specific to its purpose.

The `hideHeader` and `hideBanner` props could be replaced with a single `headerVisibility` and `bannerVisibility` props of type boolean.

The class names 'container' and 'scrollable' are not descriptive, consider making them more specific.

There is no error handling in this component, consider adding it if necessary.

This code is easy to read and maintain.
*/

import { Header } from '@/islands/Header.tsx';
import { ComponentChildren } from 'preact';
import { Banners } from '@/islands/Banner.tsx';

export function Page(
  props: { children: ComponentChildren; hideHeader?: boolean; hideBanner?: boolean },
) {
  return (
    <div class='container'>
      {!props.hideHeader && <Header />}
      {!props.hideBanner && <Banners />}
      <div className='scrollable'>
        <main>{props.children}</main>
      </div>
    </div>
  );
}
