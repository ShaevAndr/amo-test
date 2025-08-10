export const CONTAINER_TYPES = {
  // Контакты
  ContactService: Symbol.for('ContactService'),
  DrizzleContactRepository: Symbol.for('DrizzleContactRepository'),

  // Сделки
  LeadService: Symbol.for('LeadService'),
  DrizzleLeadRepository: Symbol.for('DrizzleLeadRepository'),

  // Webhooks
  WebhookService: Symbol.for('WebhookService'),

  // amoCRM
  AmoService: Symbol.for('AmoService'),
  AmoWebhookService: Symbol.for('AmoWebhookService'),
  TestAmoService: Symbol.for('TestAmoService'),

  // AmoTranstort
  ShevernitskiyAmoTransport: Symbol.for('ShevernitskiyAmoTransport'),
  AxiosAmoTransport: Symbol.for('AxiosAmoTransport'),
};
