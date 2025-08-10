import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const ContactCreateSchema = z.object({
  name: z.string().min(3, 'Имя обязательно'),
  phone: z
    .string()
    .min(5, 'Слишком короткий номер')
    .transform(rawPhone => {
      const phone = parsePhoneNumberFromString(rawPhone, 'RU');
      if (!phone || !phone.isValid()) {
        throw new Error('Некорректный номер телефона');
      }
      return phone.number;
    }),
});

export type ContactCreateDTO = z.infer<typeof ContactCreateSchema>;
