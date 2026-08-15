import { createError } from "h3";

export function assertPortalAuth(body) {
    const password = body?.password;
    if (!password || password !== process.env.PORTAL_PASSWORD) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized: Invalid password" });
    }
    return true;
}

export function assertWebhookSecret(query) {
    const secret = query?.secret;
    console.log("Webhook secret received:", process.env.WEBHOOK_SECRET);
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized: Missing or invalid secret token" });
    }
    return true;
}
