/* AI GENERATED COMMENT
Here is the feedback on the provided code:

Code style issue: Consistent spacing is missing between import statements.

Performance issue: The handler function is not memoized, it can lead to performance issues if it's computationally expensive.

Security issue: No input validation is done on ctx.state.user, it could lead to potential security vulnerabilities.

Best practice issue: The function and variable names are not following a consistent naming convention (e.g., camelCase).

Maintainability issue: The code is tightly coupled with the 'fresh' library, making it hard to switch to a different library if needed.

Refactoring suggestion: Consider separating the logic of the GET handler into a separate function for better readability and maintainability.

Readability issue: The conditionals in the default export are complex and hard to read, consider breaking them down into separate components or functions.
*/

import { define } from '@/lib/utils.ts';
import ChatBox from '@/islands/ChatBox.tsx';
import { page } from 'fresh';
import { site } from '@/app/site.ts';
import { Page } from '@/components/Page.tsx';
import { getChatData } from '@/app/chat-data.ts';
import { Spatium } from '@/islands/Spatium.tsx';

export const handler = define.handlers({
  GET: async (ctx) => {
    if (!ctx.state.user) return page();
    const chatData = await getChatData(ctx.state.user);
    return page({ chatData });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <Page>
      {data?.chatData ? <Spatium /> : (
        <>
          <h1>{site.name}</h1>
          <p>{site.description}</p>
          <p>
            <a href='/user/signin'>Sign In</a> to chat.
          </p>
        </>
      )}
    </Page>
  );
});
