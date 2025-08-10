import type { ContactInsert, ContactRepo } from '@/models/contactModel';

export type IDType = {
  id: number;
};

export interface IContactRepository {
  create(contact: Partial<ContactInsert>): Promise<IDType>;
  getByAmoId(AmoId: number): Promise<ContactRepo>;
  getByPhone(phone: string): Promise<ContactRepo>;
  updateByAmoId(amoId: number, data: Partial<ContactInsert>): Promise<void>;
}
