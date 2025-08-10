// src/transports/shevernitskiy-amo.transport.ts
import { injectable } from 'inversify';
import { Amo, ApiError, AuthError } from '@shevernitskiy/amo';
import type { IContact, ILead, CustomFieldValue, AmoTransport, HookSubscribe, HookUnsubscribe } from './interface';
import { env } from '@/config/env';
import { readFileSync, writeFileSync } from 'node:fs';

interface ApiListResponse<T> {
  _embedded?: { [key: string]: T[] };
  _links?: Record<string, unknown>;
}

@injectable()
export class ShevernitskiyAmoTransport implements AmoTransport {
  private client: Amo;

  constructor() {
    const token = JSON.parse(readFileSync('./token.json', 'utf-8'));
    this.client = new Amo(
      'spinoza33.amocrm.ru',
      {
        client_id: env.AMO_CLIENT_ID,
        client_secret: env.AMO_CLIENT_SECRET,
        redirect_uri: env.AMO_REDIRECT_URI,
        // code: process.env.AMO_AUTH_CODE!,
        token_type: 'Bearer',
        access_token: env.AMO_ACCESS_TOKEN!,
        ...token,
      },
      {
        on_token: token => {
          console.log('New token obtained', token);
          writeFileSync('./token.json', JSON.stringify(token, null, 2), 'utf8');
        },
        on_error: err => {
          console.error('amo error', err);
        },
      }
    );
  }

  subscribeHook(hook: HookSubscribe): Promise<void> {
    throw new Error('Method not implemented.');
  }

  unsubscribeHook(hook: HookUnsubscribe): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getContactById(id: number): Promise<IContact | null> {
    throw new Error('Method not implemented.');
  }

  async getContactByPhone(phone: string): Promise<IContact | null> {
    try {
      const response = await this.client.raw.get<ApiListResponse<IContact>>({ url: `/api/v4/contacts?query=${encodeURIComponent(phone)}` });

      const items = response._embedded?.contacts;
      return items?.length ? items[0] : null;
    } catch (err) {
      if (err instanceof ApiError || err instanceof AuthError) {
        throw err;
      }
      throw new Error('Unexpected AmoCRM error');
    }
  }

  async getLeadByName(name: string): Promise<ILead | null> {
    const resp = await this.client.lead.getLeads({ limit: 1, filter: filter => filter.single('name', name) });
    const lead = resp._embedded.leads.length ? (resp._embedded.leads[0] as ILead) : null;
    return lead;
  }

  async addContact(contact: any): Promise<number> {
    const created = await this.client.contact.addContacts([contact]);
    return created._embedded.contacts[0].id;
  }

  async addLead(lead: any) {
    const created = await this.client.lead.addLeads([lead]);
    return created._embedded.leads![0].id;
  }
}
