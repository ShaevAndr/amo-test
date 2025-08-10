export interface IContact {
  id: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number; // timestamp
  updated_at?: number; // timestamp
  custom_fields_values?: Array<CustomFieldValue>;
  _embedded?: {
    tags?: Array<{ id?: number; name?: string }>;
  };
}

export interface ILead {
  id: number;
  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  responsible_user_id?: number;
  created_by?: number;
  updated_by?: number;
  closed_at?: number;
  created_at?: number;
  updated_at?: number;
  loss_reason_id?: number;
  custom_fields_values?: Array<CustomFieldValue>;
  _embedded?: {
    tags?: Array<{ id?: number; name?: string }>;
    contacts?: Array<{ id?: number; is_main?: boolean }>;
    companies?: Array<any>;
  };
}

// Payloads for creating entities in amoCRM
export interface CreateContactPayload {
  name?: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  custom_fields_values?: Array<CustomFieldValue>;
  _embedded?: {
    tags?: Array<{ id?: number; name?: string }>;
    companies?: Array<{ id: number }>;
  };
}

export interface CreateLeadPayload {
  name?: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  responsible_user_id?: number;
  custom_fields_values?: Array<CustomFieldValue>;
  _embedded?: {
    tags?: Array<{ id?: number; name?: string }>;
    contacts?: Array<{ id: number; is_main?: boolean }>;
    companies?: Array<{ id: number }>;
  };
}

export interface CustomFieldValue {
  /** ID пользовательского поля */
  field_id?: number;
  /** Код поля (например “PHONE”, “EMAIL”) */
  field_code?: string;
  /** Массив значений — может быть текст, число, дата и т. д. */
  values?: Array<{
    /** Само значение — тип зависит от поля */
    value: string | number | boolean;
    /** Дополнительный enum-код (если есть) */
    enum?: string;
  }>;
}

export interface HookSubscribe {
  destination: string;
  settings: string[];
}

export interface HookUnsubscribe {
  destination: string;
}

export interface AmoTransport {
  getContactByPhone(phone: string): Promise<IContact | null>;
  getContactById(id: number): Promise<IContact | null>;
  getLeadByName(name: string): Promise<ILead | null>;
  addLead(lead: CreateLeadPayload): Promise<number>;
  addContact(contact: CreateContactPayload): Promise<number>;
  subscribeHook(hook: HookSubscribe): Promise<void>;
  unsubscribeHook(hook: HookUnsubscribe): Promise<void>;
}
