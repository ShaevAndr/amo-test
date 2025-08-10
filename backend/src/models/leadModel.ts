import { leads } from '@/database/schema';

export type LeadRepo = typeof leads.$inferSelect;
export type LeadInsert = typeof leads.$inferInsert;
