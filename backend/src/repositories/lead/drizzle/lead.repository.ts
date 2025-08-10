import { injectable } from 'inversify';
import { db } from '../../../database/connection';
import type { IDType, ILeadRepository } from '../interface';
import { leads } from '@/database/schema';
import type { LeadInsert, LeadRepo } from '@/models/leadModel';
import { DBError } from '@/repositories/errors/DBError';
import { eq } from 'drizzle-orm';

@injectable()
export class DrizzleLeadRepository implements ILeadRepository {
  private db;
  constructor() {
    this.db = db;
  }

  async getByAmoId(amoId: number): Promise<LeadRepo> {
    const [lead] = await this.db
      .select({
        id: leads.id,
        name: leads.name,
        status: leads.status,
        amocrm_id: leads.amocrm_id,
        contact_id: leads.contact_id,
        created_at: leads.created_at,
        updated_at: leads.updated_at,
      })
      .from(leads)
      .where(eq(leads.amocrm_id, amoId))
      .limit(1);
    return lead;
  }

  async getByName(name: string): Promise<LeadRepo> {
    const [lead] = await this.db
      .select({
        id: leads.id,
        name: leads.name,
        status: leads.status,
        amocrm_id: leads.amocrm_id,
        contact_id: leads.contact_id,
        created_at: leads.created_at,
        updated_at: leads.updated_at,
      })
      .from(leads)
      .where(eq(leads.name, name))
      .limit(1);
    return lead;
  }

  async updateByAmoId(amoId: number, data: Partial<LeadInsert>): Promise<void> {
    try {
      await this.db.update(leads).set(data).where(eq(leads.amocrm_id, amoId));
    } catch (error) {
      throw new DBError('Error updating lead', error);
    }
  }
  async updateByName(name: string, data: Partial<LeadInsert>): Promise<void> {
    try {
      await this.db.update(leads).set(data).where(eq(leads.name, name));
    } catch (error) {
      throw new DBError('Error updating lead', error);
    }
  }

  async create(data: LeadInsert): Promise<IDType> {
    try {
      const [leadRepo] = await this.db.insert(leads).values(data).$returningId();
      return leadRepo;
    } catch (error) {
      throw new DBError('Error creating lead', error);
    }
  }
}
