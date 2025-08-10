import type { Request, Response } from 'express';
import { CONTAINER_TYPES } from '../../config/inversify/inversifyTypes';
import { interfaces, controller, httpPost, request, response, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { ContactCreateSchema, type ContactCreateDTO } from './dto/create-contact.dto';
import { validateRequestBody } from 'zod-express-middleware';
import { ContactService } from '@/services/contact/contact.service';
import { ROUTES } from '@/constants/routes';

@controller(ROUTES.API.CONTACTS.BASE)
export class ContactController implements interfaces.Controller {
  constructor(@inject(CONTAINER_TYPES.ContactService) private contactService: ContactService) {}

  @httpPost(ROUTES.API.CONTACTS.CREATE, validateRequestBody(ContactCreateSchema))
  async create(@request() req: Request<{}, {}, ContactCreateDTO>, @response() res: Response) {
    const data = req.body;
    const result = await this.contactService.createOrReturn(data);
    return res.status(201).json(result);
  }
}
