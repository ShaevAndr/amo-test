import type { LeadInsert, LeadRepo } from '@/models/leadModel';

export type IDType = {
  id: number;
};

export interface ILeadRepository {
  create(lead: Partial<LeadInsert>): Promise<IDType>;
  getByAmoId(amoId: number): Promise<LeadRepo>;
  getByName(name: string): Promise<LeadRepo>;
  updateByAmoId(Amoid: number, data: Partial<LeadInsert>): Promise<void>;
  updateByName(name: string, data: Partial<LeadInsert>): Promise<void>;
}
