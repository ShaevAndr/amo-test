import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import type { ILeadRepository } from '@/repositories/lead/interface';
import { inject, injectable } from 'inversify';
import { DuplicateError } from '../errors/DuplicateError';
import type { AmoService } from '../amo/amo.service';
import { LeadCreateDTO } from '@/controllers/lead/dto/create-lead.dto';

@injectable()
export class LeadService {
  constructor(
    @inject(CONTAINER_TYPES.DrizzleLeadRepository) private leadRepository: ILeadRepository,
    @inject(CONTAINER_TYPES.AmoService) private amoService: AmoService
  ) {}

  async createOrReturn(inputDto: LeadCreateDTO): Promise<{ id: number }> {
    //Проверка в БД
    const lead = await this.leadRepository.getByName(inputDto.name);
    if (lead) {
      throw new DuplicateError('Lead already exists in DB');
    }

    //Проверка в amoCRM
    const amoLead = await this.amoService.getLeadByName(inputDto.name);

    if (amoLead) {
      await this.leadRepository.create({
        amocrm_id: amoLead.id,
        name: amoLead.name ?? inputDto.name,
        status: String(amoLead.status_id ?? 'unknown'),
      });
      throw new DuplicateError('Lead already exists in amoCRM');
    }

    const amoId = await this.amoService.addLead({ name: inputDto.name });

    const { id } = await this.leadRepository.create({
      amocrm_id: amoId,
      name: inputDto.name,
      status: 'created',
    });

    return { id };
  }

  async updateByAmoId(input: { amocrm_id: number; name?: string; status?: string; contact_id?: number }) {
    const { amocrm_id, ...rest } = input;
    await this.leadRepository.updateByAmoId(amocrm_id, rest);
  }

  // Создание сделки на основании вебхука (сделка уже создана в amo)
  async create(input: { amocrm_id: number; name?: string; status_id?: number; contact_id?: number }) {
    const created = await this.leadRepository.create({
      amocrm_id: input.amocrm_id,
      name: input.name ?? 'Lead',
      status: input.status_id ? String(input.status_id) : 'created',
      contact_id: input.contact_id,
    } as any);
    return created;
  }

  async getByAmoId(amoId: number) {
    return await this.leadRepository.getByAmoId(amoId);
  }
}
