import { contacts } from '@/database/schema';

export type ContactRepo = typeof contacts.$inferSelect;
export type ContactInsert = typeof contacts.$inferInsert;
