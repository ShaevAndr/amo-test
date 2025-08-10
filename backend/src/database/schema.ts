import { relations } from 'drizzle-orm';
import { mysqlTable, serial, varchar, int, bigint, timestamp, index } from 'drizzle-orm/mysql-core';

export const contacts = mysqlTable(
  'contacts',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey(),
    amocrm_id: int('amocrm_id').notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 32 }).unique().notNull(),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow(),
  },
  table => [index('phone_idx').on(table.phone), index('amo_contact_id_idx').on(table.amocrm_id)]
);

export const leads = mysqlTable(
  'leads',
  {
    id: serial('id').primaryKey(),
    amocrm_id: int('amocrm_id').notNull().unique(),
    name: varchar('name', { length: 255 }).unique().notNull(),
    status: varchar('status', { length: 64 }).notNull(),
    contact_id: int('contact_id').references(() => contacts.amocrm_id),
    created_at: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow(),
  },
  table => [index('contact_id_idx').on(table.contact_id), index('amo_lead_id_idx').on(table.amocrm_id)]
);

export const contactsRelations = relations(contacts, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  contact: one(contacts, {
    fields: [leads.contact_id],
    references: [contacts.id],
  }),
}));
