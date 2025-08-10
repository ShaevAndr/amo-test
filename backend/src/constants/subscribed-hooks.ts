import { env } from "@/config/env";
import { ROUTES } from "./routes";

export const amoHooks = [
    {
        destination: env.SERVER_URL + ROUTES.AMO.WEBHOOKS.BASE+ROUTES.AMO.WEBHOOKS.LEAD.ADDED,
        settings: [
            "add_lead"
        ],
    },

    {
        destination: env.SERVER_URL + ROUTES.AMO.WEBHOOKS.BASE+ROUTES.AMO.WEBHOOKS.LEAD.UPDATED,
        settings: [
            "update_lead"
        ],
    },

    {
        destination: env.SERVER_URL + ROUTES.AMO.WEBHOOKS.BASE+ROUTES.AMO.WEBHOOKS.CONTACT.ADDED,
        settings: [
            "add_contact"
        ]
    },

    {
        destination: env.SERVER_URL + ROUTES.AMO.WEBHOOKS.BASE+ROUTES.AMO.WEBHOOKS.CONTACT.UPDATED,
        settings: [
            "update_contact"
        ]
    },
]