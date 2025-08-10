import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import type { IContactRepository } from '@/repositories/contact/interface';
import { inject, injectable } from 'inversify';
import type { AmoService } from '../amo/amo.service';
import { ContactCreateDTO } from '@/controllers/contact/dto/create-contact.dto';
import { DuplicateError } from '../errors/DuplicateError';

@injectable()
export class ContactService {
  constructor(
    @inject(CONTAINER_TYPES.DrizzleContactRepository) private contactRepository: IContactRepository,
    @inject(CONTAINER_TYPES.AmoService) private amoService: AmoService
  ) {}

  async createOrReturn(contact: ContactCreateDTO) {
    // Проверка в БД
    const existingContact = await this.contactRepository.getByPhone(contact.phone);
    if (existingContact) {
      throw new DuplicateError('Contact already exists in DB');
    }

    // Проверка в amoCRM
    const amoExisting = await this.amoService.getContactByPhone(contact.phone);
    if (amoExisting) {
      await this.contactRepository.create({
        amocrm_id: amoExisting.id,
        name: amoExisting.name ?? contact.name,
        phone: contact.phone,
      });
      throw new DuplicateError('Contact already exists in amoCRM');
    }

    const amoId = await this.amoService.addContact(contact);

    const { id } = await this.contactRepository.create({
      amocrm_id: amoId,
      name: contact.name,
      phone: contact.phone,
    });

    return { id };
  }

  async update(input: { amocrm_id: number; name?: string; phone?: string }) {
    const { amocrm_id, ...rest } = input;
    await this.contactRepository.updateByAmoId(amocrm_id, rest);
  }

  async create(input: { amocrm_id: number; name?: string; phone?: string }) {
    const created = await this.contactRepository.create({
      amocrm_id: input.amocrm_id,
      name: input.name ?? 'Unknown',
      phone: input.phone ?? '',
    });
    return created;
  }

  async getByAmoId(amoId: number) {
    return this.contactRepository.getByAmoId(amoId);
  }
}
