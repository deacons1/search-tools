import { db, supabase } from './index';
import { searchSession } from './schema';
import type { NewSearchSession } from './schema';

export async function createSearchSession(data: NewSearchSession) {
    const [newSession] = await db.insert(searchSession).values(data).returning();
    return newSession;
}

export async function getSearchSessionsByUser(userId: string) {
    return await db.select().from(searchSession)
        .where(({ userId: dbUserId }) => dbUserId.equals(userId))
        .orderBy(({ createdAt }) => createdAt.desc());
}

export async function getSearchSessionById(id: string) {
    const [session] = await db.select().from(searchSession)
        .where(({ id: sessionId }) => sessionId.equals(id));
    return session;
}

export async function updateSearchSession(id: string, data: Partial<NewSearchSession>) {
    const [updatedSession] = await db.update(searchSession)
        .set(data)
        .where(({ id: sessionId }) => sessionId.equals(id))
        .returning();
    return updatedSession;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}