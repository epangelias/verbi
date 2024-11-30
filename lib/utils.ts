import { createDefine } from 'fresh';
import { State } from '@/app/types.ts';

export const define = createDefine<State>();
export const db = await Deno.openKv();
