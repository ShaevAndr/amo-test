import { IContact } from '@/services/amo/transport/interface';

export const extractPhoneFromAmoContact = (amoContact: IContact): string | undefined => {
  const phone = amoContact.custom_fields_values?.find(f => f.field_code === 'PHONE')?.values?.[0]?.value;
  return phone ? String(phone) : undefined;
};
