import { ComponentChildren } from 'preact';
import { usePWA } from '@/lib/pwa.ts';
import { Signal } from '@preact/signals';
import { AIMessage } from '@/lib/types.ts';

export interface BannerData {
  name: string;
  condition: () => boolean | undefined;
  canClose: boolean;
  content: () => ComponentChildren;
}

export interface UserData {
  id: string;
  created: number;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  stripeCustomerId?: string;
  isSubscribed: boolean;
  tokens: number;
  isEmailVerified: boolean;
  hasVerifiedEmail: boolean;
  pushSubscriptions: PushSubscription[];
}

export type GlobalData = {
  user: Signal<Partial<UserData> | null | undefined>;
  outOfTokens: Signal<boolean>;
  pwa: ReturnType<typeof usePWA>;
};

export interface State {
  user?: UserData;
  auth?: string;
}

export interface ChatData {
  userId: string;
  messages: AIMessage[];
}


// Verbi

export interface VerseData {
  name: string;
  chapter: number;
  verse: 1;
  text: string;
  notes: string;
}

export interface ChapterData {
  chapter: number;
  verses: VerseData[];
}

export interface BookData {
  bookNumber: number;
  name: string;
  testament: "OT" | "NT" | "AP";
  chapters: ChapterData[];
}

export interface BibleData {
  title: string;
  id: string;
  books: BookData[];
}

export interface BookListItem {
  name: string;
  bookNumber: number;
  testament: "OT" | "NT" | "AP";
  chapters: number;
}
