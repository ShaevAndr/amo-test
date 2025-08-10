import { injectable } from 'inversify';
import { db } from '../../../database/connection';
import type { IDType, IContactRepository } from '../interface';
import { contacts } from '@/database/schema';
import { DBError } from '@/repositories/errors/DBError';
import { eq } from 'drizzle-orm';
import type { ContactInsert, ContactRepo } from '@/models/contactModel';

@injectable()
export class DrizzleContactRepository implements IContactRepository {
  private db;
  constructor() {
    this.db = db;
  }

  async getByAmoId(amoId: number): Promise<ContactRepo> {
    const [contact] = await this.db.select().from(contacts).where(eq(contacts.amocrm_id, amoId)).limit(1);
    return contact;
  }

  async getByPhone(phone: string): Promise<ContactRepo> {
    const [contact] = await this.db.select().from(contacts).where(eq(contacts.phone, phone)).limit(1);
    return contact;
  }

  async updateByAmoId(amoId: number, data: Partial<ContactInsert>): Promise<void> {
    try {
      await this.db.update(contacts).set(data).where(eq(contacts.amocrm_id, amoId));
    } catch (error) {
      throw new DBError('Error updating lead', error);
    }
  }

  async create(data: ContactInsert): Promise<IDType> {
    try {
      const [contactRepo] = await this.db.insert(contacts).values(data).$returningId();
      return contactRepo;
    } catch (error) {
      throw new DBError('Error creating lead', error);
    }
  }
}
