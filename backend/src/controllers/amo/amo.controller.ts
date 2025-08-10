import { controller, httpPost, request, response, interfaces, httpGet } from 'inversify-express-utils';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { CONTAINER_TYPES } from '@/config/inversify/inversifyTypes';
import type { AmoWebhook } from './types/webhook.types';
import { AmoWebhookService } from '@/services/amo/amo-webhook.service';
import { ROUTES } from '@/constants/routes';
import { AmoService } from '@/services/amo/amo.service';

@controller(ROUTES.AMO.WEBHOOKS.BASE)
export class AmoController implements interfaces.Controller {
  constructor(
    @inject(CONTAINER_TYPES.AmoWebhookService) private amoWebhookService: AmoWebhookService,
    @inject(CONTAINER_TYPES.AmoService) private amoService: AmoService
) {}

  @httpPost(ROUTES.AMO.WEBHOOKS.CONTACT.ADDED)
  async contactAdded(@request() req: Request<{}, {}, AmoWebhook>, @response() res: Response) {
    this.amoWebhookService.processContactAdded(req.body);
    console.log("contact add")
    return res.status(207).end();
  }

  @httpPost(ROUTES.AMO.WEBHOOKS.CONTACT.UPDATED)
  async contactUpdated(@request() req: Request<{}, {}, AmoWebhook>, @response() res: Response) {
    this.amoWebhookService.processContactUpdated(req.body);
    return res.status(207).end();
  }

  @httpPost(ROUTES.AMO.WEBHOOKS.LEAD.ADDED)
  async leadAdded(@request() req: Request<{}, {}, AmoWebhook>, @response() res: Response) {
    this.amoWebhookService.processLeadAdded(req.body);
    return res.status(207).end();
  }

  @httpPost(ROUTES.AMO.WEBHOOKS.LEAD.UPDATED)
  async leadUpdated(@request() req: Request<{}, {}, AmoWebhook>, @response() res: Response) {
    this.amoWebhookService.processLeadUpdated(req.body);
    return res.status(207).end();
  }

  @httpGet(ROUTES.AMO.APP.INSTALL)
  async install(@request() req, @response() res) {
    this.amoService.install()
    return res.status(200).end();
  }

  @httpGet(ROUTES.AMO.APP.DELETE)
  async uninstall(@request() req, @response() res) {
    this.amoService.uninstall()
    return res.status(200).end();
  }
}
