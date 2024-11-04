import { pgTable, text, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const searchSession = pgTable('search_session', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    userMessage: text('user_message').notNull(),
    aiResponse: text('ai_response').notNull(),
    sources: text('sources').array().notNull(),
    parentSessionId: uuid('search_session').references(() => searchSession.id)
});

export type SearchSession = typeof searchSession.$inferSelect;
export type NewSearchSession = typeof searchSession.$inferInsert;