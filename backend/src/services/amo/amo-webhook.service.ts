import { injectable, inject } from 'inversify';
import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import { ContactService } from '../contact/contact.service';
import { LeadService } from '../lead/lead.service';
import type { AmoWebhook, AmoContactWebhook, AmoLeadWebhook } from '@/controllers/amo/types/webhook.types';
import { AmoService } from './amo.service';
import { extractPhoneFromAmoContact } from '@/utils/extract-phone';

@injectable()
export class AmoWebhookService {
  constructor(
    @inject(CONTAINER_TYPES.ContactService) private contactService: ContactService,
    @inject(CONTAINER_TYPES.LeadService) private leadService: LeadService,
    @inject(CONTAINER_TYPES.AmoService) private amoService: AmoService
  ) {}

  async processContactAdded(webhookData: AmoWebhook): Promise<void> {
    const items = webhookData.contacts?.add ?? [];
    for (const c of items as AmoContactWebhook[]) {
      const phone = extractPhoneFromAmoContact(c);
      if (!phone) {
        continue;
      }
      try {
        await this.contactService.create({ amocrm_id: c.id, name: c.name, phone });
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  async processContactUpdated(webhookData: AmoWebhook): Promise<void> {
    const items = webhookData.contacts?.update ?? [];
    for (const c of items as AmoContactWebhook[]) {
      const phone = extractPhoneFromAmoContact(c);
      const newContact = {
        amocrm_id: c.id,
        name: c.name,
        phone: phone,
      };
      this.updateContact(newContact);
    }
  }

  async processLeadAdded(webhookData: AmoWebhook): Promise<void> {
    const items = webhookData.leads?.add ?? [];
    for (const l of items as AmoLeadWebhook[]) {
      try {
        const mainContactId = l._embedded?.contacts?.find(c => c.is_main)?.id;
        mainContactId && (await this.checkContact(mainContactId));

        await this.leadService.create({
          amocrm_id: l.id,
          name: l.name,
          status_id: l.status_id,
          contact_id: mainContactId,
        });
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  async processLeadUpdated(webhookData: AmoWebhook): Promise<void> {
    const items = webhookData.leads?.update ?? [];
    for (const l of items as AmoLeadWebhook[]) {
      try {
        const mainContactId = l._embedded?.contacts?.find(c => c.is_main)?.id;
        mainContactId && (await this.checkContact(mainContactId));

        const dbLead = await this.leadService.getByAmoId(l.id);
        mainContactId && (await this.checkContact(mainContactId));

        const updatedLead = {
          amocrm_id: l.id,
          name: l.name,
          status_id: l.status_id,
          contact_id: mainContactId,
        };

        if (!dbLead) {
          await this.leadService.create(updatedLead);
        } else {
          await this.leadService.updateByAmoId(updatedLead);
        }
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  private async updateContact(contact: { amocrm_id: number; name?: string; phone?: string }) {
    try {
      const existingContact = await this.contactService.getByAmoId(contact.amocrm_id);
      if (!existingContact) {
        console.log(`Contact with amo ID ${contact.amocrm_id} not found, creating new one`);
        await this.contactService.create(contact);
      } else {
        await this.contactService.update(contact);
        console.log(`Contact ${contact.amocrm_id} updated from webhook`);
      }
    } catch (error) {
      console.error('Error processing contact updated webhook:', error);
    }
  }

  private async checkContact(id: number) {
    const existingContact = await this.contactService.getByAmoId(id);
    if (existingContact) return;

    const amoContact = await this.amoService.getContactById(id);

    if (!amoContact) {
      throw new Error('Contact not found');
    }

    const phone = extractPhoneFromAmoContact(amoContact);
    await this.contactService.create({
      amocrm_id: id,
      name: amoContact?.name || 'John Doe',
      phone: phone,
    });
  }
}
