/* AI GENERATED COMMENT
Here is my feedback:

The code is mostly clean and readable.
However, there are some issues:
A aria-label in the logo anchor tag is not descriptive enough for accessibility purposes.
The use of class instead of className is inconsistent and can cause issues in JSX.
The Meth.limitText function is not well named, consider renaming it to something like truncateText.
The global.user.value is accessed multiple times, consider storing it in a variable.
Consider adding a loader or a fallback when global.user.value is not available.
The code can be refactored to reduce nesting and improve readability.
The img tag should have an alt text that is not empty.
Consider adding a fallback for site.favicon and site.name in case they are not available.
*/

import { useGlobal } from '@/islands/Global.tsx';
import { site } from '../app/site.ts';
import { Meth } from '@/lib/meth.ts';

export function Header() {
  const global = useGlobal();

  const name = Meth.limitText(global.user.value?.name?.split(' ')[0], 15);

  return (
    <>
      <header>
        <div className='left'>
          <a href='/' class='logo' aria-label='Go to home page'>
            <img src={site.favicon} width={48} height={48} alt='' />
            <span>{site.name}</span>
          </a>
        </div>
        <div className='right'>
          {global.user.value && (
            <span class='tokens'>
              ⚡️{global.user.value.isSubscribed ? '∞' : global.user.value.tokens}
            </span>
          )}

          {global.user.value ? <a href='/user'>{name}</a> : <a href='/user/signin'>Sign In</a>}
        </div>
      </header>
    </>
  );
}
