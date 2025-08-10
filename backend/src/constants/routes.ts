export const ROUTES = {
  AMO: {
    WEBHOOKS: {
      BASE: '/amo/webhooks',
      CONTACT: {
        ADDED: '/contact/added',
        UPDATED: '/contact/updated'
      },
      LEAD: {
        ADDED: '/lead/added',
        UPDATED: '/lead/updated'
      }
    },
    APP: {
      INSTALL: '/amo/app/install',
      DELETE: '/amo/app/delete'
    }
  },
  API: {
    CONTACTS: {
        BASE: '/contacts',
        CREATE: '/create'
    },
    LEADS: {
        BASE: '/leads',
        CREATE: '/create'
    } 
  }
} as const;