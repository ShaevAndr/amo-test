export type AmoWebhook = {
  contacts?: {
    add?: AmoContactWebhook[];
    update?: AmoContactWebhook[];
  };
  leads?: {
    add?: AmoLeadWebhook[];
    update?: AmoLeadWebhook[];
  };
  account?: unknown;
};

export type AmoContactWebhook = {
  id: number;
  name?: string;
  custom_fields_values?: Array<{
    field_code?: string;
    field_id?: number;
    values?: Array<{ value: string }>;
  }>;
};

export type AmoLeadWebhook = {
  id: number;
  name?: string;
  status_id?: number;
  _embedded?: { contacts?: Array<{ id: number; is_main?: boolean }> };
};
