import { z } from 'zod';

export const LeadCreateSchema = z.object({
  name: z.string().min(1),
});
export type LeadCreateDTO = z.infer<typeof LeadCreateSchema>;
