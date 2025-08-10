import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import { inject, injectable } from 'inversify';
import type { AmoTransport } from './transport/interface';

@injectable()
export class TestAmoService {
  constructor() {}

  async getContactByPhone(phone: string) {
    return { id: 10 };
  }

  async getLeadByName(name: string) {
    return { id: 10 };
  }

  async addContact(contact: any) {
    return { id: 10 };
  }

  async addLead(lead: any) {
    return { id: 10 };
  }
}
