import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer, TYPE } from 'inversify-express-utils';

import './controllers/contact/contact.controller';
import './controllers/amo/amo.controller';
import './controllers/lead/lead.controller';

import { container } from './config/inversify/inversify.config';
import { env } from './config/env';

const server = new InversifyExpressServer(container);

server.setConfig(app => {
  app.use(express.json());
  // например, CORS, helmet, логирование
});

server.setErrorConfig(app => {
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const name = err?.name || 'Error';
    const message = err?.message || 'Internal Server Error';
    if (status >= 500) console.error(err);
    res.status(status).json({ error: name, message });
  });
});

const app = server.build();

app.listen(env.PORT, () => {
  console.log('Server started on http://localhost:' + env.PORT);
});
