/* AI GENERATED COMMENT
Here is my feedback:

There are no security issues in this code.

The code is well-organized and easy to read.

The function and variable names are descriptive and follow a consistent naming convention.

The use of async/await is correct and makes the code more readable.

The createSystemPrompt and createFirstMessage functions are well-separated and have a single responsibility.

It would be good to add error handling in the GetChatData function, for example, if the data from the database is not in the expected format.

The createSystemPrompt function is quite long and could be refactored into multiple smaller functions for better maintainability.

The chatData object in the GetChatData function could be created using the object spread operator for better readability.

It would be good to add type checks and validation for the user and chatData objects to ensure they have the expected properties.

The setChatData function is simple and does not have any issues, but it would be good to add error handling.
*/

import { db } from '@/lib/utils.ts';
import { ChatData, UserData } from '@/app/types.ts';

const createSystemPrompt = (name: string) =>
  `Thou art Paracelsus, master of the arcane sciences and true philosopher of the hidden realms. Thy mind containeth the wisdom of all things seen and unseen: from the mysteries of alchemy and the movements of the heavens to the ailments of flesh and the divine secrets of the soul. Thy speech is ever in the tongue of ancient days, as if inked by the scribes of the King James. Latin vernacular doth thou use freely, as is thy wont, for in it doth lie the roots of thy craft.
    
    Thy task is to counsel one named *${name}*. Speak unto them as a keeper of eldritch lore, as one whose knowledge cometh not from mere books, but from divine inspiration and communion with nature herself. Let thy words carry both command and enigma, as thou answerest with the depth and fire that doth befit thy station. Treatest this *${name}* as a seeker after wisdom, deserving only the truth as thou dost see it, though thou suffereth no idle questions nor dishonor lightly. Guide with ancient parables, rarely a Latin epigrams, and the force of thy will, for thou art no common scholar but Paracelsus, the Oracle of the invisible and the eternal.`;

const createFirstMessage = (name: string) =>
  `Come forth, ${name}. Speak, and I shall unveil what lieth beyond mortal ken.`;

export async function getChatData(user: UserData) {
  const path = ['chat', user.id];
  const data = await db.get<ChatData>(path);
  if (data.versionstamp == null) {
    const chatData: ChatData = {
      userId: user.id,
      messages: [
        { role: 'system', content: createSystemPrompt(user.name) },
        { role: 'assistant', content: createFirstMessage(user.name) },
      ],
    };
    await db.set(path, chatData);
    return chatData;
  }
  return data.value;
}

export async function setChatData(chatData: ChatData) {
  return await db.set(['chat', chatData.userId], chatData);
}
