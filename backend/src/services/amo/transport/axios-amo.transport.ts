import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';
import { env } from '@/config/env';
import type { AmoTransport, IContact, ILead, CreateLeadPayload, CreateContactPayload, HookSubscribe, HookUnsubscribe } from './interface';
import { AmoError } from './errors/amo.error';

interface ApiListResponse<T> {
  _embedded?: { [key: string]: T[] };
}

@injectable()
export class AxiosAmoTransport implements AmoTransport {
  private http: AxiosInstance;

  constructor() {
    if (!env.AMO_ACCESS_TOKEN) {
      throw new Error('AMO_ACCESS_TOKEN is required for AxiosAmoTransport');
    }
    const baseURL = `https://${env.AMO_DOMAIN}`;
    this.http = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${env.AMO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async subscribeHook(hook: HookSubscribe): Promise<void> {
    try {
      await this.http.post('/api/v4/webhooks', hook);
    } catch (error) {
      // @ts-ignore
      console.error(JSON.stringify(error, null, 2));
    }
  }

  async unsubscribeHook(hook: HookUnsubscribe): Promise<void> {
    try {
      await this.http.delete('/api/v4/webhooks', { data: hook });
    } catch (error) {
      // @ts-ignore
      console.error('Hook subscription error:', { status: error.response?.status, data: error.response?.data, message: error.message });
    }
  }

  async getContactByPhone(phone: string): Promise<IContact | null> {
    try {
      const response = await this.http.get<ApiListResponse<IContact>>(`/api/v4/contacts`, { params: { query: phone, limit: 1 } });

      if (response.status === 204) return null;

      const items = response.data._embedded?.contacts;
      return items?.length ? items[0] : null;
    } catch (error) {
      throw new AmoError('Amo fetch contact error', error);
    }
  }

  async getContactById(id: number): Promise<IContact | null> {
    try {
      const response = await this.http.get<IContact>(`/api/v4/contacts/${id}`);
      if (response.status === 204) return null;
      return response.data;
    } catch (error) {
      throw new AmoError(`Amo fetch contact error with id=${id}`, error);
    }
  }

  async getLeadByName(name: string): Promise<ILead | null> {
    try {
      const response = await this.http.get<ApiListResponse<ILead>>(`/api/v4/leads`, {
        params: { 'filter[name]': name, limit: 1 },
      });

      if (response.status === 204) return null;

      const items = response.data._embedded?.leads;
      return items?.length ? items[0] : null;
    } catch (error) {
      throw new AmoError('Amo fetch lead error', error);
    }
  }

  async addLead(lead: CreateLeadPayload): Promise<number> {
    try {
      const { data } = await this.http.post(`/api/v4/leads`, [lead]);
      return data._embedded.leads[0].id;
    } catch (error) {
      throw new AmoError('Amo add lead error', error);
    }
  }

  async addContact(contact: CreateContactPayload): Promise<number> {
    try {
      const { data } = await this.http.post(`/api/v4/contacts`, [contact]);
      return data._embedded.contacts[0].id;
    } catch (error) {
      throw new AmoError('Amo add contact error', error);
    }
  }
}
