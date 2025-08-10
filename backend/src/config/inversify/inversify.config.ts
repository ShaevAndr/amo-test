import { Container } from 'inversify';
import { CONTAINER_TYPES } from './inversifyTypes';

import type { ILeadRepository } from '@/repositories/lead/interface';
import type { IContactRepository } from '@/repositories/contact/interface';
import { ContactService } from '@/services/contact/contact.service';
import { AmoService } from '@/services/amo/amo.service';
import { TestAmoService } from '@/services/amo/test-amo.service';

import { AxiosAmoTransport } from '@/services/amo/transport/axios-amo.transport';
import { ShevernitskiyAmoTransport } from '@/services/amo/transport/shevernitskiy-amo.transport';
import { DrizzleContactRepository } from '@/repositories/contact/drizzle/lead.repository';
import { DrizzleLeadRepository } from '@/repositories/lead/drizzle/lead.repository';
import type { AmoTransport } from '@/services/amo/transport/interface';
import { LeadService } from '@/services/lead/lead.service';
import { AmoWebhookService } from '@/services/amo/amo-webhook.service';

// контейнер DI
const container = new Container();

// Repos
container.bind<IContactRepository>(CONTAINER_TYPES.DrizzleContactRepository).to(DrizzleContactRepository);
container.bind<ILeadRepository>(CONTAINER_TYPES.DrizzleLeadRepository).to(DrizzleLeadRepository);

// // Services
container.bind<ContactService>(CONTAINER_TYPES.ContactService).to(ContactService);
container.bind<LeadService>(CONTAINER_TYPES.LeadService).to(LeadService);

container.bind<AmoService>(CONTAINER_TYPES.AmoService).to(AmoService);
container.bind<AmoWebhookService>(CONTAINER_TYPES.AmoWebhookService).to(AmoWebhookService);
container.bind(CONTAINER_TYPES.TestAmoService).to(TestAmoService);

container.bind<AmoTransport>(CONTAINER_TYPES.ShevernitskiyAmoTransport).to(ShevernitskiyAmoTransport);
container.bind<AmoTransport>(CONTAINER_TYPES.AxiosAmoTransport).to(AxiosAmoTransport);

export { container };
