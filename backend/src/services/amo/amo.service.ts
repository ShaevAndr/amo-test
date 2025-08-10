import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import { inject, injectable } from 'inversify';
import type { AmoTransport, CreateContactPayload, CreateLeadPayload } from './transport/interface';
import { ContactCreateDTO } from '@/controllers/contact/dto/create-contact.dto';
import { amoHooks } from '@/constants/subscribed-hooks';

@injectable()
export class AmoService {
  constructor(@inject(CONTAINER_TYPES.AxiosAmoTransport) private amoTransport: AmoTransport) {}

  async getContactByPhone(phone: string) {
    return this.amoTransport.getContactByPhone(phone);
  }

  async getContactById(id: number) {
    return this.amoTransport.getContactById(id);
  }

  async getLeadByName(name: string) {
    return this.amoTransport.getLeadByName(name);
  }

  async addContact(dto: ContactCreateDTO): Promise<number> {
    const payload = this.mapContactToAmo(dto);
    return this.amoTransport.addContact(payload);
  }

  async addLead(lead: CreateLeadPayload) {
    return this.amoTransport.addLead(lead);
  }

  async install() {
    for (const hook of amoHooks) {
      await this.amoTransport.subscribeHook(hook)
    }
  }

  async uninstall() {
    const destinations = amoHooks.map(hook=>({destination: hook.destination}))
    for (const destination of destinations) {
      await this.amoTransport.unsubscribeHook(destination)
    }
  }
  
  private mapContactToAmo(dto: ContactCreateDTO): CreateContactPayload {
    return {
      name: dto.name,
      custom_fields_values: [{ field_code: 'PHONE', values: [{ value: dto.phone }] }],
    };
  }
}
