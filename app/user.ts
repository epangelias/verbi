// Strip user data for sending to client

import { UserData } from '@/app/types.ts';
import { createUserData } from '@/lib/user-data.ts';

// This is the user data sent to the client
export function stripUserData(user?: UserData) {
    if (!user) return undefined;
    return {
        name: user.name,
        tokens: user.tokens,
        isSubscribed: user.isSubscribed,
        isEmailVerified: user.isEmailVerified,
        email: user.email,
        hasVerifiedEmail: user.hasVerifiedEmail,
    } as Partial<UserData>;
}

export function createUser(name: string, email: string, password: string) {
    return createUserData({
        name,
        email,
        password,
        tokens: 50,
        isSubscribed: false,
        isEmailVerified: false,
        hasVerifiedEmail: false,
        pushSubscriptions: [],
    });
}

export function deleteUserRelatedData(atomic: Deno.AtomicOperation, user: UserData) {
    return atomic.delete(['chat', user.id]);
}