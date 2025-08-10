import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { CONTAINER_TYPES } from '../../config/inversify/inversifyTypes';
import { LeadService } from '../../services/lead/lead.service';
import { controller, httpPost, interfaces, request, response } from 'inversify-express-utils';
import { LeadCreateSchema, type LeadCreateDTO } from './dto/create-lead.dto';
import { validateRequestBody } from 'zod-express-middleware';
import { ROUTES } from '@/constants/routes';

@controller(ROUTES.API.LEADS.BASE
)
export class LeadController implements interfaces.Controller {
  constructor(@inject(CONTAINER_TYPES.LeadService) private leadService: LeadService) {}

  @httpPost(ROUTES.API.LEADS.CREATE, validateRequestBody(LeadCreateSchema))
  async create(@request() req: Request<{}, {}, LeadCreateDTO>, @response() res: Response) {
    const data = req.body;
    const result = await this.leadService.createOrReturn(data);
    return res.status(201).json(result);
  }
}
