#!/usr/bin/env -S deno run -A

import { db } from '@/lib/utils.ts';

export async function clearDb() {
  const itemsReset: Record<string, number> = {};

  let promises = [];

  for await (const res of db.list({ prefix: [] })) {
    const key = res.key.slice(0, -1).join('/');
    itemsReset[key] = (key in itemsReset) ? itemsReset[key] + 1 : 1;
    promises.push(db.delete(res.key));

    if (promises.length > 50) {
      await Promise.all(promises);
      promises = [];
    }
  }

  console.log(itemsReset);
  await Promise.all(promises);
}

if (import.meta.main) await clearDb();
