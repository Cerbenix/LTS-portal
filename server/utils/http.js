import { createError } from "h3";

export function assertMethod(event, allowedMethod) {
    const method = event.node.req.method;
    if (method !== allowedMethod) {
        throw createError({ statusCode: 405, statusMessage: `Method ${method} Not Allowed` });
    }
    return true;
}

export function assertPortalAuth(body) {
    const password = body?.password;
    if (!password || password !== process.env.PORTAL_PASSWORD) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized: Invalid password" });
    }
    return true;
}

export function assertWebhookSecret(query) {
    const secret = query?.secret;
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized: Missing or invalid secret token" });
    }
    return true;
}
